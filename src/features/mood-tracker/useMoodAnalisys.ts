import { useMemo } from "react";
import { TrendAnalysis, TrendDescription } from "../../domain/trend";
import { MoodEntry, MoodValue } from "../../domain/mood";

type RegressionResult = {
  slope: number;
  rSquared: number;
};

type TrendFactors = {
  slope: number;
  rSquared: number;
  volatility: number;
  percentages: {
    high: number;
    medium: number;
    low: number;
  };
};

export function calculateRegression(
  x: number[],
  y: MoodValue[],
  meanX: number,
  meanY: number,
  n: number
): RegressionResult {
  if (n === 0) return { slope: 0, rSquared: 0 };

  let numerator = 0;
  let denominator = 0;
  let totalSquaredResiduals = 0;
  let totalSquaredTotal = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - meanX;
    const yDiff = y[i] - meanY;
    numerator += xDiff * yDiff;
    denominator += xDiff * xDiff;

    const predicted = meanY + (numerator / (denominator || 1)) * xDiff;
    totalSquaredResiduals += Math.pow(y[i] - predicted, 2);
    totalSquaredTotal += Math.pow(yDiff, 2);
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const rSquared =
    totalSquaredTotal === 0 ? 0 : 1 - totalSquaredResiduals / totalSquaredTotal;

  return { slope, rSquared };
}

export function calculateVolatility(moodScores: MoodValue[]): number {
  if (moodScores.length < 2) return 0;

  const mean =
    moodScores.reduce((sum, value) => sum + value, 0) / moodScores.length;
  const absoluteDeviations = moodScores.map((value) => Math.abs(value - mean));
  const mad =
    absoluteDeviations.reduce((sum, value) => sum + value, 0) /
    moodScores.length;

  const maxDeviation = 1;
  const normalizedVolatility = mad / maxDeviation;

  return normalizedVolatility;
}
export function findLongestStreak(moodScores: MoodValue[]): {
  mood: MoodValue;
  length: number;
} {
  if (moodScores.length === 0) {
    return { mood: 2, length: 0 };
  }

  let currentMood: MoodValue = moodScores[0];
  let currentStreak = 1;
  let maxStreak = 1;
  let maxMood: MoodValue = currentMood;

  for (let i = 1; i < moodScores.length; i++) {
    const validMood = [1, 2, 3].includes(moodScores[i])
      ? (moodScores[i] as MoodValue)
      : 2;

    if (validMood === currentMood) {
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
        maxMood = currentMood;
      }
    } else {
      currentMood = validMood;
      currentStreak = 1;
    }
  }

  return { mood: maxMood, length: maxStreak };
}

export function analyzeTrend({
  slope,
  rSquared,
  volatility,
  percentages,
}: TrendFactors): TrendDescription {
  if (volatility > 0.8) {
    return "highly_variable";
  }

  //high confidence curve
  if (rSquared > 0.4) {
    if (slope > 0.04) return "improving_significantly";
    if (slope < -0.04) return "declining_significantly";
    if (slope > 0.02) return "improving_slightly";
    if (slope < -0.02) return "declining_slightly";
  }

  //use percentages when other values are offcharts
  if (percentages.high > 60) {
    return "consistently_positive";
  }
  if (percentages.high > 45) {
    return "mostly_positive";
  }
  if (percentages.high > 35) return "leaning_positive";
  if (percentages.medium > 60) return "generally_neutral";
  if (percentages.low > 35) return "leaning_negative";
  if (percentages.low > 60) {
    return "consistently_negative";
  }
  if (percentages.low > 45) {
    return "mostly_negative";
  }
  if (Math.abs(percentages.high - percentages.low) < 15)
    return "relatively_stable";

  return "relatively_stable";
}

export function getMoodDescription(mood: MoodValue): string {
  const descriptions: Record<MoodValue, string> = {
    1: "mostly_negative",
    2: "generally_neutral",
    3: "mostly_positive",
  };
  return descriptions[mood] || descriptions[2];
}

export function getStreakDescription(streak: {
  mood: MoodValue;
  length: number;
}): { key: string; values?: { count: number; mood: string } } {
  if (streak.length === 0) {
    return { key: "no_data" };
  }

  return {
    key: "dashboard.stats.longestStreak",
    values: {
      count: streak.length,
      mood: getMoodDescription(streak.mood),
    },
  };
}

export function getVolatilityDescription(volatility: number): string {
  if (volatility < 0.3) return "relatively_stable";
  if (volatility < 0.6) return "moderately_variable";
  if (volatility < 0.9) return "highly_variable";
  return "highly_variable";
}

export function useMoodTrendAnalysis(moods: MoodEntry[]): TrendAnalysis {
  return useMemo(() => {
    const moodScores = moods.map((mood) => {
      return [1, 2, 3].includes(mood.mood) ? mood.mood : 2;
    });
    const n = moodScores.length;

    if (n === 0) {
      return {
        trend: "no_data",
        stats: {
          slope: 0,
          averageMood: 2,
          percentages: { high: 0, medium: 0, low: 0 },
          volatility: 0,
          longestStreak: { mood: 2, length: 0 },
        },
        prediction: 2,
      };
    }

    const x = Array.from({ length: n }, (_, i) => i);

    const moodCounts = moodScores.reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<MoodValue, number>);

    const percentages = {
      high: ((moodCounts[3] || 0) / n) * 100,
      medium: ((moodCounts[2] || 0) / n) * 100,
      low: ((moodCounts[1] || 0) / n) * 100,
    };

    const meanX = x.reduce((acc, val) => acc + val, 0) / n;
    const meanY = moodScores.reduce((acc, val) => acc + val, 0) / n;

    const { slope, rSquared } = calculateRegression(
      x,
      moodScores,
      meanX,
      meanY,
      n
    );
    const volatility = calculateVolatility(moodScores);
    const longestStreak = findLongestStreak(moodScores);

    const prediction = Math.max(1, Math.min(3, meanY + slope * (n + 1)));

    return {
      trend: analyzeTrend({ slope, rSquared, volatility, percentages }),
      stats: {
        slope,
        averageMood: meanY,
        percentages,
        volatility,
        longestStreak,
      },
      prediction,
    };
  }, [moods]);
}

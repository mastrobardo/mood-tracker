import { useMemo } from "react";
import { TrendAnalysis, TrendDescription } from "../../domain/trend";
import {
  MoodEntry,
  MoodTrendAnalysisOptions,
  MoodValue,
} from "../../domain/mood";

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

    // For R-squared calculation
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

  // Calculate day-to-day changes
  const changes = [];
  for (let i = 1; i < moodScores.length; i++) {
    changes.push(Math.abs(moodScores[i] - moodScores[i - 1]));
  }

  const meanChange =
    changes.length === 0
      ? 0
      : changes.reduce((acc, val) => acc + val, 0) / changes.length;
  const squaredDiffs = changes.map((change) =>
    Math.pow(change - meanChange, 2)
  );
  const variance =
    changes.length === 0
      ? 0
      : squaredDiffs.reduce((acc, val) => acc + val, 0) / changes.length;

  return Math.sqrt(variance);
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
  const SIGNIFICANT_SLOPE = 0.05;
  const HIGH_VOLATILITY = 0.8;
  const HIGH_R_SQUARED = 0.7;
  const DOMINANT_PERCENTAGE = 50;

  // get help
  if (volatility > HIGH_VOLATILITY) {
    return "highly variable";
  }

  // Curve fits
  if (rSquared > HIGH_R_SQUARED) {
    if (slope > SIGNIFICANT_SLOPE) {
      return "improving significantly";
    }
    if (slope < -SIGNIFICANT_SLOPE) {
      return "declining significantly";
    }
  }

  // Weak but we got it
  if (slope > SIGNIFICANT_SLOPE / 2) {
    return "improving slightly";
  }
  if (slope < -SIGNIFICANT_SLOPE / 2) {
    return "declining slightly";
  }

  if (percentages.high > DOMINANT_PERCENTAGE) {
    return "mostly positive";
  }
  if (percentages.low > DOMINANT_PERCENTAGE) {
    return "mostly negative";
  }

  return "relatively stable";
}

export function getMoodDescription(mood: MoodValue): string {
  const descriptions: Record<MoodValue, string> = {
    1: "Bad mood",
    2: "Neutral mood",
    3: "Good mood",
  };
  return descriptions[mood] || descriptions[2];
}

export function getStreakDescription(streak: {
  mood: MoodValue;
  length: number;
}): string {
  if (streak.length === 0) return "No streak found";

  return `Longest streak: ${streak.length} days of ${getMoodDescription(
    streak.mood
  ).toLowerCase()}`;
}

export function getVolatilityDescription(volatility: number): string {
  if (volatility < 0.3) return "Very stable mood pattern";
  if (volatility < 0.6) return "Moderately variable mood pattern";
  if (volatility < 0.9) return "Highly variable mood pattern";
  return "Extremely variable mood pattern";
}

export function useMoodTrendAnalysis(moods: MoodEntry[]): TrendAnalysis {
  return useMemo(() => {
    const moodScores = moods.map((mood) => {
      return [1, 2, 3].includes(mood.mood) ? mood.mood : 2;
    });
    const n = moodScores.length;

    if (n === 0) {
      return {
        trend: "no data",
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

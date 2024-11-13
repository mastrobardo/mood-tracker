import { MoodValue } from "./mood";

export type TrendDescription =
  | "improving_significantly"
  | "improving_slightly"
  | "relatively_stable"
  | "declining_slightly"
  | "declining_significantly"
  | "mostly_positive"
  | "consistently_positive"
  | "leaning_positive"
  | "mostly_negative"
  | "consistently_negative"
  | "leaning_negative"
  | "highly_variable"
  | "moderately_variable"
  | "mixed_extremes"
  | "generally_neutral"
  | "no_data";

export interface TrendAnalysis {
  trend: TrendDescription;
  stats: {
    slope: number;
    averageMood: number;
    percentages: {
      high: number;
      medium: number;
      low: number;
    };
    volatility: number;
    longestStreak: {
      mood: MoodValue;
      length: number;
    };
  };
  prediction?: number;
}

export type TrendFactors = {
  slope: number;
  rSquared: number;
  volatility: number;
  percentages: {
    high: number;
    medium: number;
    low: number;
  };
};

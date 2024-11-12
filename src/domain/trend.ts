import { MoodValue } from "./mood";

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

export type TrendDescription =
  | "improving significantly"
  | "improving slightly"
  | "relatively stable"
  | "declining slightly"
  | "declining significantly"
  | "mostly positive"
  | "consistently positive"
  | "leaning positive"
  | "mostly negative"
  | "consistently negative"
  | "leaning negative"
  | "highly variable"
  | "moderately variable"
  | "mixed extremes"
  | "generally neutral"
  | "no data";

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

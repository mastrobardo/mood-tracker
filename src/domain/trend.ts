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
  | "mostly negative"
  | "highly variable"
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

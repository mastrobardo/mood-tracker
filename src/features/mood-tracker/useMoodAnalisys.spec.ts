import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import {
  useMoodTrendAnalysis,
  calculateRegression,
  calculateVolatility,
  findLongestStreak,
  analyzeTrend,
  getMoodDescription,
  getStreakDescription,
  getVolatilityDescription,
} from "./useMoodAnalisys";
import { MoodEntry, MoodValue } from "../../domain/mood";

describe("Mood Trend Analysis", () => {
  const createMoodEntries = (moods: MoodValue[]): MoodEntry[] => {
    return moods.map((mood) => ({
      id: 1,
      day: "any-day",
      mood,
    }));
  };

  describe("Hook Basic Functionality", () => {
    it("handles empty input", () => {
      const { result } = renderHook(() => useMoodTrendAnalysis([]));

      expect(result.current).toEqual({
        trend: "no data",
        stats: {
          slope: 0,
          averageMood: 2,
          percentages: { high: 0, medium: 0, low: 0 },
          volatility: 0,
          longestStreak: { mood: 2, length: 0 },
        },
        prediction: 2,
      });
    });

    it("handles invalid mood values", () => {
      const moods = createMoodEntries([1, 4 as MoodValue, 5 as MoodValue, 2]);

      const { result } = renderHook(() => useMoodTrendAnalysis(moods));

      expect(result.current.stats.averageMood).toBe(1.75);
      expect(result.current.stats.percentages).toEqual({
        low: 25,
        medium: 75,
        high: 0,
      });
    });

    it("calculates correct percentages for valid moods", () => {
      const moods = createMoodEntries([1, 2, 2, 3, 3]);

      const { result } = renderHook(() => useMoodTrendAnalysis(moods));

      expect(result.current.stats.percentages).toEqual({
        low: 20,
        medium: 40,
        high: 40,
      });
    });
  });

  describe("calculateRegression", () => {
    it("handles empty arrays", () => {
      expect(calculateRegression([], [], 0, 0, 0)).toEqual({
        slope: 0,
        rSquared: 0,
      });
    });

    it("handles constant values", () => {
      const x = [0, 1, 2];
      const y = [2, 2, 2] as MoodValue[];
      expect(calculateRegression(x, y, 1, 2, 3)).toEqual({
        slope: 0,
        rSquared: 0,
      });
    });

    it("calculates perfect positive correlation", () => {
      const x = [0, 1, 2];
      const y = [1, 2, 3] as MoodValue[];
      const result = calculateRegression(x, y, 1, 2, 3);
      expect(result.slope).toBe(1);
      expect(result.rSquared).toBeCloseTo(1, 5);
    });
  });

  describe("calculateVolatility", () => {
    it("returns 0 for single value", () => {
      expect(calculateVolatility([2])).toBe(0);
    });

    it("returns 0 for constant values", () => {
      expect(calculateVolatility([2, 2, 2, 2])).toBe(0);
    });

    it("calculates correct volatility for simple pattern", () => {
      expect(calculateVolatility([1, 2, 1, 2])).toBe(0.5);
    });

    it("calculates correct volatility for complex pattern", () => {
      const volatility = calculateVolatility([1, 2, 3, 1] as MoodValue[]);
      expect(volatility).toBeCloseTo(0.75, 2);
    });
  });

  describe("findLongestStreak", () => {
    it("handles empty array", () => {
      expect(findLongestStreak([])).toEqual({ mood: 2, length: 0 });
    });

    it("finds single value streak", () => {
      expect(findLongestStreak([2])).toEqual({ mood: 2, length: 1 });
    });

    it("finds longest streak in mixed values", () => {
      expect(findLongestStreak([1, 1, 1, 2, 2])).toEqual({
        mood: 1,
        length: 3,
      });
    });

    it("normalizes invalid moods", () => {
      const result = findLongestStreak([1, 4, 4, 1] as MoodValue[]);
      expect(result).toEqual({ mood: 2, length: 2 });
    });
  });

  describe("Description Functions", () => {
    it("getMoodDescription handles all values", () => {
      expect(getMoodDescription(1)).toBe("Bad mood");
      expect(getMoodDescription(2)).toBe("Neutral mood");
      expect(getMoodDescription(3)).toBe("Good mood");
      expect(getMoodDescription(4 as MoodValue)).toBe("Neutral mood");
    });

    it("getStreakDescription formats all cases", () => {
      expect(getStreakDescription({ mood: 3, length: 4 })).toBe(
        "Longest streak: 4 days of good mood"
      );
      expect(getStreakDescription({ mood: 2, length: 0 })).toBe(
        "No streak found"
      );
    });

    it("getVolatilityDescription covers all ranges", () => {
      expect(getVolatilityDescription(0.2)).toBe("Very stable mood pattern");
      expect(getVolatilityDescription(0.4)).toBe(
        "Moderately variable mood pattern"
      );
      expect(getVolatilityDescription(0.7)).toBe(
        "Highly variable mood pattern"
      );
      expect(getVolatilityDescription(1.0)).toBe(
        "Extremely variable mood pattern"
      );
    });
  });

  describe("Trend Analysis", () => {
    it("identifies highly variable pattern", () => {
      const result = analyzeTrend({
        slope: 0,
        rSquared: 0,
        volatility: 0.9,
        percentages: { high: 30, medium: 30, low: 40 },
      });
      expect(result).toBe("highly variable");
    });

    it("identifies significant improvement", () => {
      const result = analyzeTrend({
        slope: 0.06,
        rSquared: 0.8,
        volatility: 0.3,
        percentages: { high: 40, medium: 30, low: 30 },
      });
      expect(result).toBe("improving significantly");
    });

    it("identifies significant decline", () => {
      const result = analyzeTrend({
        slope: -0.06,
        rSquared: 0.8,
        volatility: 0.3,
        percentages: { high: 30, medium: 30, low: 40 },
      });
      expect(result).toBe("declining significantly");
    });

    it("identifies slight improvement", () => {
      const result = analyzeTrend({
        slope: 0.03,
        rSquared: 0.5,
        volatility: 0.3,
        percentages: { high: 35, medium: 35, low: 30 },
      });
      expect(result).toBe("improving slightly");
    });

    it("identifies slight decline", () => {
      const result = analyzeTrend({
        slope: -0.03,
        rSquared: 0.5,
        volatility: 0.3,
        percentages: { high: 30, medium: 35, low: 35 },
      });
      expect(result).toBe("declining slightly");
    });

    it("identifies mostly positive", () => {
      const result = analyzeTrend({
        slope: 0.01,
        rSquared: 0.1,
        volatility: 0.3,
        percentages: { high: 60, medium: 20, low: 20 },
      });
      expect(result).toBe("mostly positive");
    });

    it("identifies mostly negative", () => {
      const result = analyzeTrend({
        slope: -0.01,
        rSquared: 0.1,
        volatility: 0.3,
        percentages: { high: 20, medium: 20, low: 60 },
      });
      expect(result).toBe("mostly negative");
    });

    it("identifies relatively stable", () => {
      const result = analyzeTrend({
        slope: 0.01,
        rSquared: 0.1,
        volatility: 0.3,
        percentages: { high: 30, medium: 40, low: 30 },
      });
      expect(result).toBe("relatively stable");
    });
  });

  describe("Integration Tests", () => {
    it("handles real world improvement pattern", () => {
      const moods = createMoodEntries([1, 1, 2, 2, 2, 3, 3, 3, 3]);

      const { result } = renderHook(() => useMoodTrendAnalysis(moods));

      expect(result.current.trend).toBe("improving significantly");
      expect(result.current.stats.slope).toBeGreaterThan(0.05);
      expect(result.current.prediction).toBeLessThanOrEqual(3);
      expect(result.current.prediction).toBeGreaterThanOrEqual(1);
    });

    it("handles real world decline pattern", () => {
      const moods = createMoodEntries([3, 3, 3, 3, 2, 2, 2, 1, 1]);

      const { result } = renderHook(() => useMoodTrendAnalysis(moods));

      expect(result.current.trend).toBe("declining significantly");
      expect(result.current.stats.slope).toBeLessThan(-0.05);
      expect(result.current.prediction).toBeLessThanOrEqual(3);
      expect(result.current.prediction).toBeGreaterThanOrEqual(1);
    });
  });
});

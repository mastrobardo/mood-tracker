export type MoodValue = 1 | 2 | 3;

export type MoodEntry = {
  id: number;
  day: string;
  mood: MoodValue;
};

export type MoodStats = {
  totalEntries: number;
  averageMood: number;
  mostFrequentMood: MoodValue;
};

export type MoodTrendAnalysisOptions = {
  moods: MoodEntry[];
};

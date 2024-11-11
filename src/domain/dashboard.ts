import { MoodEntry, MoodStats } from "./mood";

export type DashboardData = {
  moods: MoodEntry[];
  stats: MoodStats;
};

export type LoaderData = {
  data: Promise<DashboardData>;
};

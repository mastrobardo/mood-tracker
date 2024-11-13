import axios from "axios";
import { DashboardData } from "../../domain/dashboard";
import { MoodValue, MoodEntry } from "../../domain/mood";
import MockAdapter from "axios-mock-adapter";
import { TrendDescription } from "../../domain/trend";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.response.use(async (response) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return response;
});

const mock = new MockAdapter(api);

type MoodGenerationPattern = Exclude<TrendDescription, "no data">;

const generateHistoricalMoods = (): MoodEntry[] => {
  const moods: MoodEntry[] = [];
  const today = new Date();
  const pattern = (import.meta.env.VITE_MOOD_PATTERN ||
    "relatively stable") as MoodGenerationPattern;
  const volatility =
    pattern === "highly_variable" || pattern === "moderately_variable"
      ? parseFloat(import.meta.env.VITE_MOOD_VOLATILITY || "0.8")
      : 0.1;

  for (let i = 30; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    let mood: MoodValue;
    const progress = (30 - i) / 30;
    const random = Math.random();

    switch (pattern) {
      case "improving_significantly":
        mood =
          random < progress * 0.9 ? 3 : random < progress * 0.9 + 0.3 ? 2 : 1;
        break;

      case "improving_slightly":
        mood = random < progress * 0.6 ? 3 : random < 0.7 ? 2 : 1;
        break;

      case "declining_significantly":
        mood =
          random < progress * 0.9 ? 1 : random < progress * 0.9 + 0.3 ? 2 : 3;
        break;

      case "declining_slightly":
        mood = random < progress * 0.6 ? 1 : random < 0.7 ? 2 : 3;
        break;

      case "consistently_positive":
        mood = random < 0.85 ? 3 : random < 0.95 ? 2 : 1;
        break;

      case "mostly_positive":
        mood = random < 0.65 ? 3 : random < 0.85 ? 2 : 1;
        break;

      case "leaning_positive":
        mood = random < 0.45 ? 3 : random < 0.85 ? 2 : 1;
        break;

      case "consistently_negative":
        mood = random < 0.85 ? 1 : random < 0.95 ? 2 : 3;
        break;

      case "mostly_negative":
        mood = random < 0.65 ? 1 : random < 0.85 ? 2 : 3;
        break;

      case "leaning_negative":
        mood = random < 0.45 ? 1 : random < 0.85 ? 2 : 3;
        break;

      case "highly_variable":
        const variation = Math.sin(i * Math.PI * 0.5) * 0.8 + random * 0.4;
        mood = variation < 0.3 ? 1 : variation < 0.7 ? 2 : 3;
        break;

      case "moderately_variable":
        const modVar = Math.sin(i * Math.PI * 0.3) * 0.6 + random * 0.4;
        mood = modVar < 0.3 ? 1 : modVar < 0.7 ? 2 : 3;
        break;

      case "mixed_extremes":
        mood = i % 2 === 0 ? (random < 0.7 ? 1 : 2) : random < 0.7 ? 3 : 2;
        break;

      case "generally_neutral":
        mood = random < 0.15 ? 1 : random < 0.85 ? 2 : 3;
        break;

      default:
        mood = random < 0.2 ? 1 : random < 0.8 ? 2 : 3;
    }

    if (
      (pattern === "highly_variable" || pattern === "moderately_variable") &&
      Math.random() < volatility
    ) {
      mood = [1, 2, 3][Math.floor(Math.random() * 3)] as MoodValue;
    }

    moods.push({
      id: i,
      day: date.toISOString().split("T")[0] + "T00:00:00Z",
      mood,
    });
  }

  return moods;
};

export default generateHistoricalMoods;

mock.onGet("/moods").reply(() => {
  const moods = generateHistoricalMoods();
  const mockData: DashboardData = {
    moods,
    stats: {
      totalEntries: moods.length,
      averageMood: 2,
      mostFrequentMood: 2,
    },
  };
  return [200, mockData];
});

mock.onPost("/moods/mood").reply((config) => {
  const input = JSON.parse(config.data);
  return [
    200,
    {
      id: Date.now(),
      day: input.day,
      mood: input.mood,
    },
  ];
});

export const fetchMoodData = async (): Promise<DashboardData> => {
  const { data } = await api.get<DashboardData>("/moods");
  return data;
};

export const updateMood = async (input: {
  mood: MoodValue;
  day: string;
}): Promise<MoodEntry> => {
  const { data } = await api.post<MoodEntry>("/moods/mood", input);
  return data;
};

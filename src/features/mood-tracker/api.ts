import axios from "axios";
import { DashboardData } from "../../domain/dashboard";
import { MoodValue, MoodEntry } from "../../domain/mood";
import MockAdapter from "axios-mock-adapter";
import mockData from "../../mocks/mock.json";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.response.use(async (response) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return response;
});

const mock = new MockAdapter(api, { delayResponse: 2000 });

mock.onGet("/moods").reply(() => {
  return [200, mockData];
});

mock.onPost("/moods/mood").reply((config) => {
  const input = JSON.parse(config.data);
  return [
    200,
    {
      id: mockData.moods.length + 1,
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

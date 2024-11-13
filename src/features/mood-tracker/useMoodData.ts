import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  UseSuspenseQueryOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { DashboardData } from "../../domain/dashboard";
import { fetchMoodData, updateMood } from "./api";
import { message } from "antd";
import { MoodEntry } from "../../domain/mood";
import { useMoodDataContext } from "./mood-data.context";
import { useEffect } from "react";
import { formatDate } from "./utils";

export const MOOD_QUERY_KEY = ["moods"] as const;

type MoodQueryOptions = Omit<
  UseSuspenseQueryOptions<
    DashboardData,
    Error,
    DashboardData,
    typeof MOOD_QUERY_KEY
  >,
  "queryKey" | "queryFn"
>;

export function useMoodData(options?: MoodQueryOptions) {
  const queryClient = useQueryClient();
  const messageApi = message;
  const { moodData, setMoodData } = useMoodDataContext();

  const query = useSuspenseQuery({
    queryKey: MOOD_QUERY_KEY,
    queryFn: moodData ? () => Promise.resolve(moodData) : fetchMoodData,
    ...options,
  });

  useEffect(() => {
    if (query?.data && !moodData) {
      setMoodData(query.data);
    }
  }, [query.data, setMoodData]);

  const mutation: UseMutationResult<
    MoodEntry,
    Error,
    Omit<MoodEntry, "id">
  > = useMutation({
    mutationFn: updateMood,
    onMutate: async (newMood) => {
      await queryClient.cancelQueries({ queryKey: MOOD_QUERY_KEY });

      const previousData =
        queryClient.getQueryData<DashboardData>(MOOD_QUERY_KEY);

      if (previousData) {
        const today = new Date();
        const todayStr = formatDate(today);
        const todayMoodIndex = previousData.moods.findIndex((mood) =>
          mood.day.includes(todayStr)
        );

        let newMoods;
        if (todayMoodIndex !== -1) {
          newMoods = [...previousData.moods];
          newMoods[todayMoodIndex] = {
            ...newMoods[todayMoodIndex],
            mood: newMood.mood,
          };
        } else {
          newMoods = [
            ...previousData.moods,
            { id: previousData.moods.length + 1, ...newMood },
          ];
        }

        const newData = {
          ...previousData,
          moods: newMoods,
        };

        queryClient.setQueryData(MOOD_QUERY_KEY, newData);
        setMoodData(newData);
      }

      return { previousData };
    },
    onError: (error, variables, context) => {
      console.error("Mutation error:", error, variables);
      if (context?.previousData) {
        queryClient.setQueryData(MOOD_QUERY_KEY, context.previousData);
        setMoodData(context.previousData);
      }
      messageApi.error("Failed to update mood");
    },
    onSuccess: async () => {
      messageApi.success("Mood updated successfully");
      await queryClient.invalidateQueries({ queryKey: MOOD_QUERY_KEY });
    },
  });

  return {
    ...query,
    updateMoodData: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}

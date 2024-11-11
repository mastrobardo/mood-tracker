import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import type {
  UseSuspenseQueryOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { DashboardData } from "../../domain/dashboard";
import { fetchMoodData, updateMood } from "./api";
import { message } from "antd";
import { MoodEntry, MoodValue } from "../../domain/mood";
import { useMoodDataContext } from "./mood-data.context";
import { useEffect } from "react";

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
      console.log("Previous data:", previousData);

      if (previousData) {
        const newData = {
          ...previousData,
          moods: [...previousData.moods, { id: Date.now(), ...newMood }],
        };

        queryClient.setQueryData(MOOD_QUERY_KEY, newData);
        setMoodData(newData);
      }

      return { previousData };
    },
    onError: (error, variables, context) => {
      console.error("Mutation error:", error);
      console.log("Failed variables:", variables);
      console.log("Context:", context);

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

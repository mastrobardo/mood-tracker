import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Task } from "../../domain/task";
import { fetchTasks } from "./api";
import { useTaskContext } from "./tasks.context";

export const TASKS_QUERY_KEY = ["tasks"] as const;

export function useTasks() {
  const { state, dispatch } = useTaskContext();

  const query = useSuspenseQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn:
      state.tasks !== undefined
        ? () => Promise.resolve(state.tasks)
        : fetchTasks,
  });

  useEffect(() => {
    if (query.data && state.tasks === undefined) {
      dispatch({ type: "SET_TASKS", payload: query.data });
    }
  }, [query.data, dispatch, state.tasks]);

  const addTask = (task: Omit<Task, "id">) => {
    dispatch({ type: "ADD_TASK", payload: task });
  };

  const deleteTask = (id: number) => {
    dispatch({ type: "DELETE_TASK", payload: id });
  };

  const toggleTask = (id: number) => {
    dispatch({ type: "TOGGLE_TASK", payload: id });
  };

  return {
    tasks: state.tasks,
    isLoading: query.isPending,
    addTask,
    deleteTask,
    toggleTask,
  };
}

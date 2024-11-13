import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "../components/layout";
import { LoadingFallback } from "../components/loading-fallback";
import { ErrorFallback } from "../components/error-fallback";
import type { QueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "../features/errors/error-boundary";
import { fetchMoodData } from "../features/mood-tracker/api";

const Dashboard = lazy(() =>
  import("../features/pages/dashboard-page").then((module) => ({
    default: module.DashboardPage,
  }))
);

const MoodPage = lazy(() =>
  import("../features/pages/mood-page").then((module) => ({
    default: module.MoodPage,
  }))
);

const TasksPage = lazy(() =>
  import("../features/pages/tasks-page").then((module) => ({
    default: module.TasksPage,
  }))
);

type RouteWrapperProps = {
  component: React.ReactNode;
};

function RouteWrapper({ component }: RouteWrapperProps) {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense fallback={<LoadingFallback />}>{component}</Suspense>
    </ErrorBoundary>
  );
}

export const ROUTES = {
  DASHBOARD: "/",
  MOODS: "/moods",
  TASKS: "/tasks",
} as const;

export const createAppRouter = (queryClient: QueryClient) => {
  return createBrowserRouter([
    {
      path: ROUTES.DASHBOARD,
      element: <Layout />,
      children: [
        {
          index: true,
          element: <RouteWrapper component={<Dashboard />} />,
          // this is useless, actually. Just to show i know how modern routes work
          loader: async () => {
            try {
              await queryClient.prefetchQuery({
                queryKey: ["moods"],
                queryFn: fetchMoodData,
                retry: false,
              });
              return null;
            } catch (error) {
              throw error;
            }
          },
        },
        {
          path: ROUTES.MOODS,
          element: <RouteWrapper component={<MoodPage />} />,
        },
        {
          path: ROUTES.TASKS,
          element: <RouteWrapper component={<TasksPage />} />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to={ROUTES.DASHBOARD} replace />,
    },
  ]);
};

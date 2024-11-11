import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "../components/layout";
import { LoadingFallback } from "../components/loading-fallback";
import { ErrorFallback } from "../components/error-fallback";
import type { QueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "../features/errors/error-boundary";
import { fetchMoodData } from "../features/mood-tracker/api";

const Dashboard = lazy(() =>
  import("../features/dashboard/dashboard-page").then((module) => ({
    default: module.DashboardPage,
  }))
);

// const Analytics = lazy(() =>
//   import("../pages/Analytics").then((module) => ({
//     default: module.Analytics,
//   }))
// );

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
  HOME: "/",
  DASHBOARD: "/",
  ANALYTICS: "/analytics",
} as const;

export const createAppRouter = (queryClient: QueryClient) => {
  return createBrowserRouter([
    {
      path: ROUTES.HOME,
      element: <Layout />,
      children: [
        {
          index: true,
          element: <RouteWrapper component={<Dashboard />} />,
          loader: async () => {
            try {
              await queryClient.prefetchQuery({
                queryKey: ["moods"],
                queryFn: fetchMoodData,
                retry: false, // Don't retry on failure
              });
              return null;
            } catch (error) {
              throw error;
            }
          },
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to={ROUTES.HOME} replace />,
    },
  ]);
};

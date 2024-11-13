import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConfigProvider } from "antd";
import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { queryClient } from "./router/query-client";
import { createAppRouter } from "./router/routes";
import { MoodDataProvider } from "./features/mood-tracker/mood-data.context";
import "./i18n/config";
import { TaskProvider } from "./features/tasks/tasks.context";
import { ModalsProvider } from "./features/modal-manager/modal.context";
import "./index.css";

const router = createAppRouter(queryClient);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MoodDataProvider>
        <TaskProvider>
          <ModalsProvider>
            <ConfigProvider>
              <RouterProvider router={router} />
            </ConfigProvider>
          </ModalsProvider>
        </TaskProvider>
      </MoodDataProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);

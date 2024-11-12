import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { Task } from "../../domain/task";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.response.use(async (response) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return response;
});

const mock = new MockAdapter(api, { delayResponse: 1000 });

const generateRandomTasks = (): Task[] => {
  return Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    title: `Task ${index + 1}`,
    description: `This is a detailed description for task ${
      index + 1
    }. It contains more information that can be viewed by tapping the expand button.`,
    completed: false,
  }));
};

mock.onGet("/tasks").reply(() => {
  return [200, generateRandomTasks()];
});

export const fetchTasks = async (): Promise<Task[]> => {
  const { data } = await api.get<Task[]>("/tasks");
  return data;
};

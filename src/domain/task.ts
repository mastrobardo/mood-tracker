export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export type TaskState = {
  tasks: Task[] | undefined;
};

export type TaskAction =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Omit<Task, "id"> }
  | { type: "DELETE_TASK"; payload: number }
  | { type: "TOGGLE_TASK"; payload: number };

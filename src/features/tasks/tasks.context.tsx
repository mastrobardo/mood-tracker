import { createContext, useContext, useReducer, ReactNode } from "react";
import { TaskState, TaskAction } from "../../domain/task";

type TaskContextType = {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

//this seems old redux
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
      };

    case "ADD_TASK": {
      const currentTasks = state.tasks ?? [];
      const newId = Math.max(0, ...currentTasks.map((t) => t.id)) + 1;
      const newTask = {
        ...action.payload,
        id: newId,
      };

      return {
        ...state,
        tasks: [newTask, ...currentTasks],
      };
    }

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks?.filter((task) => task.id !== action.payload) ?? [],
      };

    case "TOGGLE_TASK":
      return {
        ...state,
        tasks:
          state.tasks?.map((task) =>
            task.id === action.payload
              ? { ...task, completed: !task.completed }
              : task
          ) ?? [],
      };

    default:
      return state;
  }
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, { tasks: undefined });

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

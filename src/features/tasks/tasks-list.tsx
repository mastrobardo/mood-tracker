import { useEffect, useState } from "react";
import { List, Modal } from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { useTasks } from "./useTasks";
import classNames from "classnames";
import { Task } from "../../domain/task";
import { useTaskContext } from "./tasks.context";

export const TaskList = () => {
  const { tasks: apiTasks, isLoading, toggleTask, deleteTask } = useTasks();
  const { state } = useTaskContext();
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const tasks = state.tasks ?? apiTasks;

  console.log(
    "tasks, ",
    tasks,
    "state,tasks, ",
    state.tasks,
    "api.tasks, ",
    apiTasks
  );

  useEffect(() => {
    console.log(apiTasks);
  }, [apiTasks]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const newIds = new Set(prev);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  };

  const handleDelete = () => {
    if (taskToDelete !== null) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  return (
    <>
      <List
        loading={isLoading}
        dataSource={tasks}
        locale={{ emptyText: "No tasks added yet" }}
        renderItem={(task: Task) => (
          <List.Item className="px-4 py-3 border-b last:border-b-0">
            <div className="flex flex-col w-full">
              <div className="flex items-start justify-between gap-4">
                <h3
                  className={classNames("text-lg", {
                    "line-through text-gray-500": task.completed,
                    "text-gray-900": !task.completed,
                  })}
                >
                  {task.title}
                </h3>
                <button
                  onClick={() => toggleExpand(task.id)}
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex-shrink-0 hover:bg-gray-200 transition-colors duration-200"
                  aria-label={
                    expandedIds.has(task.id)
                      ? "Collapse description"
                      : "Expand description"
                  }
                >
                  {expandedIds.has(task.id) ? (
                    <UpOutlined className="text-xs" />
                  ) : (
                    <DownOutlined className="text-xs" />
                  )}
                </button>
              </div>
              <p
                className={classNames(
                  "text-gray-600 text-sm transition-all duration-200",
                  {
                    "line-clamp-none": expandedIds.has(task.id),
                    "line-clamp-1": !expandedIds.has(task.id),
                  }
                )}
              >
                {task.description}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={classNames(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200",
                    {
                      "bg-green-100 text-green-600": task.completed,
                      "bg-gray-100 text-gray-600": !task.completed,
                    }
                  )}
                  aria-label={
                    task.completed ? "Mark as incomplete" : "Mark as complete"
                  }
                >
                  <CheckOutlined className="text-sm" />
                </button>
                <button
                  onClick={() => setTaskToDelete(task.id)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                  aria-label="Delete task"
                >
                  <DeleteOutlined className="text-sm" />
                </button>
              </div>
            </div>
          </List.Item>
        )}
      />

      <Modal
        title="Delete Task"
        open={taskToDelete !== null}
        onOk={handleDelete}
        onCancel={() => setTaskToDelete(null)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete this task? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
};

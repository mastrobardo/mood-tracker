import { useModals } from "../modal-manager/modal.context";
import { TaskList } from "../tasks/tasks-list";

export const TasksPage = () => {
  const { openModal } = useModals();
  return (
    <div className="h-full">
      <TaskList onAddTask={() => openModal("task")} />
    </div>
  );
};

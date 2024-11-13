import { MoodEntryForm } from "../mood-tracker/mood-entry-form";
import { TaskFormModal } from "../tasks/task-form";
import { useModal } from "./useModal";

export function ModalManager() {
  const moodModal = useModal();
  const taskModal = useModal();

  return (
    <>
      <MoodEntryForm open={moodModal.isOpen} onClose={moodModal.close} />
      <TaskFormModal open={taskModal.isOpen} onClose={taskModal.close} />
    </>
  );
}

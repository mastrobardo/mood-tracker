import { createContext, useContext, useState, useCallback } from "react";
import { MoodEntryForm } from "../mood-tracker/mood-entry-form";
import { TaskFormModal } from "../tasks/task-form";

type ModalType = "mood" | "task";

interface ModalState {
  type: ModalType | null;
  isOpen: boolean;
  data?: any;
}

interface ModalsContextType {
  modalState: ModalState;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

const ModalsContext = createContext<ModalsContextType | undefined>(undefined);

export function ModalsProvider({ children }: { children: React.ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    isOpen: false,
    data: null,
  });

  const openModal = useCallback((type: ModalType, data?: any) => {
    setModalState({ type, isOpen: true, data });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, isOpen: false, data: null });
  }, []);

  return (
    <ModalsContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
      {modalState.isOpen && (
        <>
          {modalState.type === "mood" && (
            <MoodEntryForm
              open={modalState.isOpen}
              onClose={closeModal}
              currentMood={modalState.data?.currentMood}
            />
          )}
          {modalState.type === "task" && (
            <TaskFormModal open={modalState.isOpen} onClose={closeModal} />
          )}
        </>
      )}
    </ModalsContext.Provider>
  );
}

export function useModals() {
  const context = useContext(ModalsContext);
  if (context === undefined) {
    throw new Error("useModals must be used within a ModalsProvider");
  }
  return context;
}

import { createContext, ReactNode, useContext, useState } from "react";
import { MoodEntry } from "../../domain/mood";
import { DashboardData } from "../../domain/dashboard";

type MoodDataContextType = {
  moodData: DashboardData | null;
  setMoodData: React.Dispatch<React.SetStateAction<DashboardData | null>>;
  updateLocalMoodData: (newEntry: MoodEntry) => void;
};

const MoodDataContext = createContext<MoodDataContextType | undefined>(
  undefined
);

export const MoodDataProvider = ({ children }: { children: ReactNode }) => {
  const [moodData, setMoodData] = useState<DashboardData | null>(null);

  const updateLocalMoodData = (newEntry: MoodEntry) => {
    setMoodData((prevData) => {
      console.log(prevData, "prevdata");
      if (!prevData) return null;
      console.log(prevData, "prevdata");
      return {
        ...prevData,
        moods: [...prevData.moods, newEntry],
      };
    });
  };

  return (
    <MoodDataContext.Provider
      value={{
        moodData,
        setMoodData,
        updateLocalMoodData,
      }}
    >
      {children}
    </MoodDataContext.Provider>
  );
};

export const useMoodDataContext = () => {
  const context = useContext(MoodDataContext);
  if (!context) {
    throw new Error("useMoodDataContext must be used within MoodDataProvider");
  }
  return context;
};

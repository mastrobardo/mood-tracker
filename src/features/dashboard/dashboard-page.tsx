import { useEffect, useState } from "react";
import { Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { MoodEntryForm } from "../mood-tracker/mood-entry-form";
import { MoodStats } from "../mood-tracker/mood-stats";
import { useMoodTrendAnalysis } from "../mood-tracker/useMoodAnalisys";
import { useMoodData } from "../mood-tracker/useMoodData";
import { MoodEntry } from "../../domain/mood";
import { useMoodDataContext } from "../mood-tracker/mood-data.context";

const { Title } = Typography;

export function DashboardPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodEntry | undefined>(
    undefined
  );
  const { data } = useMoodData();
  const { moodData } = useMoodDataContext();

  const analysis = useMoodTrendAnalysis(data.moods);

  const today = new Date().toISOString().split("T")[0];
  // const currentMood = data.moods.find((m) => m.day === today)?.mood;

  useEffect(() => {
    const mood = data.moods[data.moods.length - 1];
    setCurrentMood(mood);
    console.log(moodData, currentMood);
  }, [moodData]);

  const handleFormClose = () => {
    setIsFormOpen(false);
    // refetch();
  };

  console.log("currentMood, ", currentMood);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <Title level={2} className="!mb-0">
          Mood Dashboard
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsFormOpen(true)}
        >
          Add Mood
        </Button>
      </div>

      <div className="grid gap-6">
        <MoodStats analysis={analysis} currentMood={currentMood} />
      </div>

      <MoodEntryForm
        open={isFormOpen}
        onClose={handleFormClose}
        currentMood={currentMood}
      />
    </div>
  );
}

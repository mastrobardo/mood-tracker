import { useEffect, useState } from "react";
import { Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { MoodEntryForm } from "../mood-tracker/mood-entry-form";
import { MoodStats } from "../mood-tracker/mood-stats";
import { useMoodTrendAnalysis } from "../mood-tracker/useMoodAnalisys";
import { useMoodData } from "../mood-tracker/useMoodData";
import { MoodEntry } from "../../domain/mood";
import { useMoodDataContext } from "../mood-tracker/mood-data.context";
import { TaskFormModal } from "../tasks/task-form";
import { TaskList } from "../tasks/tasks-list";
import { formatDate } from "../mood-tracker/utils";

const { Title } = Typography;

export function DashboardPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodEntry | undefined>(
    undefined
  );
  const { data } = useMoodData();
  const { moodData } = useMoodDataContext();
  const moods = moodData ? moodData.moods : data.moods;
  const analysis = useMoodTrendAnalysis(moods);

  useEffect(() => {
    const today = new Date();
    const todayStr = formatDate(today);
    const todayMood = moods.find((mood) => mood.day.includes(todayStr));

    setCurrentMood(todayMood || undefined);
  }, [moods]);

  useEffect(() => {
    //this is just to force update of comp
    console.log("Moods changed:", moods);
    console.log("New analysis:", analysis);
  }, [moods, analysis]);

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleTaskFormClose = () => {
    setIsTaskFormOpen(false);
  };

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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <Title level={2} className="!mb-0">
          Task Manager
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsTaskFormOpen(true)}
        >
          Add Task
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <TaskList />
      </div>

      <MoodEntryForm
        open={isFormOpen}
        onClose={handleFormClose}
        currentMood={currentMood?.mood}
      />

      <TaskFormModal open={isTaskFormOpen} onClose={handleTaskFormClose} />
    </div>
  );
}

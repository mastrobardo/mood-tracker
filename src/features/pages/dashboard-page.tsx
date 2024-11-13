import { useEffect, useState } from "react";
import { Typography, Button, Row, Col, Grid } from "antd";
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
import MoodTimeline from "../graph/mood-charts";

const { Title } = Typography;
const { useBreakpoint } = Grid;

const LAYOUT = {
  GUTTER: 24,
  DESKTOP: {
    MAIN_CONTENT: 16,
    SIDE_CONTENT: 8,
  },
  TABLET: {
    STATS: 12,
    TASKS: 12,
    CHART: 24,
  },
} as const;

export function DashboardPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodEntry | undefined>(
    undefined
  );

  const screens = useBreakpoint();
  const isDesktop = screens.lg;
  const isTablet = screens.md && !screens.lg;

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
      {isDesktop ? (
        <Row gutter={[LAYOUT.GUTTER, LAYOUT.GUTTER]}>
          <Col span={LAYOUT.DESKTOP.MAIN_CONTENT}>
            <div className="space-y-6">
              <MoodStats
                analysis={analysis}
                currentMood={currentMood}
                onAddMood={() => setIsFormOpen(true)}
              />
              {moodData?.moods && (
                <div className="bg-white rounded-lg shadow-sm">
                  <MoodTimeline data={moodData?.moods} type="timeline" />
                </div>
              )}
            </div>
          </Col>
          <Col span={LAYOUT.DESKTOP.SIDE_CONTENT} className="h-full">
            <TaskList onAddTask={() => setIsTaskFormOpen(true)} />
          </Col>
        </Row>
      ) : isTablet ? (
        <Row gutter={[LAYOUT.GUTTER, LAYOUT.GUTTER]}>
          <Col span={LAYOUT.TABLET.STATS}>
            <MoodStats
              analysis={analysis}
              currentMood={currentMood}
              onAddMood={() => setIsFormOpen(true)}
            />
          </Col>
          <Col span={LAYOUT.TABLET.TASKS}>
            <TaskList onAddTask={() => setIsTaskFormOpen(true)} />
          </Col>
          <Col span={LAYOUT.TABLET.CHART}>
            {moodData?.moods && (
              <div className="bg-white rounded-lg shadow-sm">
                <MoodTimeline data={moodData?.moods} type="timeline" />
              </div>
            )}
          </Col>
        </Row>
      ) : (
        <div className="space-y-6">
          <MoodStats
            analysis={analysis}
            currentMood={currentMood}
            onAddMood={() => setIsFormOpen(true)}
          />

          <TaskList onAddTask={() => setIsTaskFormOpen(true)} />

          {moodData?.moods && (
            <div className="bg-white rounded-lg shadow-sm">
              <MoodTimeline data={moodData?.moods} type="timeline" />
            </div>
          )}
        </div>
      )}

      <MoodEntryForm
        open={isFormOpen}
        onClose={handleFormClose}
        currentMood={currentMood?.mood}
      />

      <TaskFormModal open={isTaskFormOpen} onClose={handleTaskFormClose} />
    </div>
  );
}

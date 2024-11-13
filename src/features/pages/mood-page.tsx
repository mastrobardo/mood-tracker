import { useEffect, useState } from "react";
import { Row, Col, Grid } from "antd";
import { MoodEntry } from "../../domain/mood";
import MoodTimeline from "../graph/mood-charts";
import { useMoodDataContext } from "../mood-tracker/mood-data.context";
import { MoodStats } from "../mood-tracker/mood-stats";
import { useMoodTrendAnalysis } from "../mood-tracker/useMoodAnalisys";
import { useMoodData } from "../mood-tracker/useMoodData";
import { formatDate } from "../mood-tracker/utils";
import { useModals } from "../modal-manager/modal.context";

export function MoodPage() {
  const [currentMood, setCurrentMood] = useState<MoodEntry | undefined>(
    undefined
  );

  const { data } = useMoodData();
  const { moodData } = useMoodDataContext();
  const moods = moodData ? moodData.moods : data.moods;
  const analysis = useMoodTrendAnalysis(moods);
  const { openModal } = useModals();

  useEffect(() => {
    const today = new Date();
    const todayStr = formatDate(today);
    const todayMood = moods.find((mood: MoodEntry) =>
      mood.day.includes(todayStr)
    );
    setCurrentMood(todayMood || undefined);
  }, [moods]);

  return (
    <div className="space-y-6">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <MoodStats
            analysis={analysis}
            currentMood={currentMood}
            onAddMood={() => openModal("mood", { currentMood })}
          />
        </Col>
        {moodData?.moods && (
          <Col span={24}>
            <div className="bg-white rounded-lg shadow-sm">
              <MoodTimeline data={moodData?.moods} type="timeline" />
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
}

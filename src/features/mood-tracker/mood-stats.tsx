import { Card, Typography } from "antd";
import { SmileOutlined, MehOutlined, FrownOutlined } from "@ant-design/icons";
import { MoodEntry, MoodValue } from "../../domain/mood";
import { TrendAnalysis } from "../../domain/trend";

const { Text, Title } = Typography;

const getMoodIcon = (mood: MoodValue) => {
  switch (mood) {
    case 3:
      return <SmileOutlined className="text-green-500 text-6xl" />;
    case 2:
      return <MehOutlined className="text-yellow-500 text-6xl" />;
    case 1:
      return <FrownOutlined className="text-red-500 text-6xl" />;
  }
};

type MoodStatsProps = {
  analysis: TrendAnalysis;
  currentMood?: MoodEntry;
};

export function MoodStats({ analysis, currentMood }: MoodStatsProps) {
  return (
    <Card className="shadow-sm bg-white" bordered={false}>
      <div className="mb-8 flex justify-center">
        {getMoodIcon(currentMood?.mood || analysis.stats.longestStreak.mood)}
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <Text className="text-gray-500 text-sm block">Average Mood</Text>
          <Title level={2} className="!m-0 !mt-1">
            {analysis.stats.averageMood.toFixed(2)}
          </Title>
        </div>

        <div className="text-center">
          <Text className="text-gray-500 text-sm block">Trend</Text>
          <Title level={2} className="!m-0 !mt-1 capitalize">
            {analysis.trend}
          </Title>
        </div>

        <div className="text-center">
          <Text className="text-gray-500 text-sm block">Longest Streak</Text>
          <Title level={2} className="!m-0 !mt-1">
            {analysis.stats.longestStreak.length} days
          </Title>
        </div>
      </div>
    </Card>
  );
}

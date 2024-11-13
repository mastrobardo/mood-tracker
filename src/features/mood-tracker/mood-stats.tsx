import { Card, Typography, Button } from "antd";
import {
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
  QuestionOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { MoodEntry, MoodValue } from "../../domain/mood";
import { TrendAnalysis } from "../../domain/trend";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

const getMoodIcon = (mood?: MoodValue) => {
  switch (mood) {
    case 3:
      return <SmileOutlined className="text-green-500 text-6xl" />;
    case 2:
      return <MehOutlined className="text-yellow-500 text-6xl" />;
    case 1:
      return <FrownOutlined className="text-red-500 text-6xl" />;
    default:
      return <QuestionOutlined className="text-gray-400 text-6xl" />;
  }
};

type MoodStatsProps = {
  analysis: TrendAnalysis;
  currentMood?: MoodEntry;
  onAddMood: () => void;
};

export function MoodStats({
  analysis,
  currentMood,
  onAddMood,
}: MoodStatsProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4">
        <h2 className="!m-0 whitespace-nowrap text-lg font-semibold sm:text-xl md:text-2xl">
          {t("dashboard.title")}
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddMood}
          size="middle"
        >
          <span className="hidden sm:inline">{t("dashboard.addMood")}</span>
        </Button>
      </div>

      <Card className="shadow-sm bg-white" bordered={false}>
        <div className="mb-6 flex justify-center">
          {getMoodIcon(currentMood?.mood)}
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <Text className="text-gray-500 text-sm block">
              {t("dashboard.stats.averageMood")}
            </Text>
            <Title level={3} className="!m-0 !mt-1">
              {analysis.stats.averageMood.toFixed(2)}
            </Title>
          </div>

          <div className="text-center">
            <Text className="text-gray-500 text-sm block">
              {t("dashboard.stats.trend")}
            </Text>
            <Title level={3} className="!m-0 !mt-1 capitalize">
              {t(`trends.${analysis.trend}`)}
            </Title>
          </div>

          <div className="text-center">
            <Text className="text-gray-500 text-sm block">
              {t("dashboard.stats.longestStreak")}
            </Text>
            <Title level={3} className="!m-0 !mt-1">
              {t("dashboard.stats.daysCount", {
                count: analysis.stats.longestStreak.length,
              })}
            </Title>
          </div>
        </div>
      </Card>
    </>
  );
}

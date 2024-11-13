import { useCallback } from "react";
import { theme } from "antd";
import { MoodEntry } from "../../domain/mood";

export const useMoodCharts = () => {
  const { token } = theme.useToken();
  // this seems  necessary. Label formatter get overriden by real datums metric names
  const formattedData = (data: MoodEntry[]) =>
    data.map((entry: MoodEntry) => ({
      ...entry,
      day: `${new Date(entry.day).getUTCDate()}/${
        new Date(entry.day).getUTCMonth() + 1
      }`,
    }));
  const getTimelineConfig = useCallback(
    (data: MoodEntry[]) => {
      return {
        data: formattedData(data),
        xField: "day",
        yField: "mood",
        axis: {
          x: {
            label: {
              formatter: (v: string) => {
                const date = new Date(v);
                return `${date.getUTCDate()}/${date.getUTCMonth() + 1}`;
              },
            },
          },
          y: {
            min: 1,
            max: 3,
            tickCount: 3,
            label: {
              formatter: (v: number) => ["Low", "Medium", "High"][v - 1],
            },
          },
        },
        color: token.colorPrimary,
        point: {
          size: 4,
          shape: "circle",
        },
        tooltip: {
          formatter: (datum: MoodEntry) => {
            const date = new Date(datum.day);
            return {
              name: "Mood",
              value: ["Low", "Medium", "High"][datum.mood - 1],
              date: `${date.getUTCDate()}/${date.getUTCMonth() + 1}`,
            };
          },
        },
      };
    },
    [token]
  );

  const getPieConfig = useCallback(
    (data: MoodEntry[]) => {
      const moodCounts = data.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const pieData = Object.entries(moodCounts).map(([mood, count]) => ({
        type: ["Low", "Medium", "High"][Number(mood) - 1],
        value: count,
      }));

      return {
        data: pieData,
        angleField: "value",
        colorField: "type",
        radius: 0.8,
        label: {
          type: "inner",
          offset: "-30%",
          content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
          style: {
            textAlign: "center",
            fontSize: 12,
          },
        },
        color: [token.colorError, token.colorWarning, token.colorSuccess],
        tooltip: {
          formatter: (datum: any) => {
            return {
              name: datum.type,
              value: datum.value,
            };
          },
        },
      };
    },
    [token]
  );

  return {
    getTimelineConfig,
    getPieConfig,
  };
};

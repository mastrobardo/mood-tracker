import { Line, Pie } from "@ant-design/plots";
import { useMoodCharts } from "./useMoodCharts";
import { Grid, Row, Col, Segmented } from "antd";
import { MoodEntry } from "../../domain/mood";
import { useState } from "react";

type MoodChartsProps = {
  data: MoodEntry[];
  type: "timeline" | "pie";
};

const CHART_HEIGHTS = {
  DESKTOP: 500,
  TABLET: 400,
  MOBILE: 300,
} as const;

const LAYOUT = {
  GUTTER: 16,
  TIMELINE_SPAN: 16,
  PIE_SPAN: 8,
  FULL_SPAN: 24,
  PIE_HEIGHT_RATIO: 0.8,
} as const;

const MoodCharts = ({ data, type = "timeline" }: MoodChartsProps) => {
  const [chartType, setChartType] = useState(type);
  const { getTimelineConfig, getPieConfig } = useMoodCharts();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const chartHeight = screens.xl
    ? CHART_HEIGHTS.DESKTOP
    : screens.md
    ? CHART_HEIGHTS.TABLET
    : CHART_HEIGHTS.MOBILE;

  const isDesktop = screens.lg;
  const isTablet = screens.md && !screens.lg;

  if (isDesktop) {
    return (
      <Row gutter={[LAYOUT.GUTTER, LAYOUT.GUTTER]}>
        <Col span={LAYOUT.TIMELINE_SPAN}>
          <div className="w-full" style={{ height: chartHeight }}>
            <Line {...getTimelineConfig(data)} />
          </div>
        </Col>
        <Col span={LAYOUT.PIE_SPAN}>
          <div className="w-full" style={{ height: chartHeight }}>
            <Pie {...getPieConfig(data)} />
          </div>
        </Col>
      </Row>
    );
  }

  if (isTablet) {
    return (
      <Row gutter={[0, LAYOUT.GUTTER]}>
        <Col span={LAYOUT.FULL_SPAN}>
          <div className="w-full" style={{ height: chartHeight }}>
            <Line {...getTimelineConfig(data)} />
          </div>
        </Col>
        <Col span={LAYOUT.FULL_SPAN}>
          <div
            className="w-full"
            style={{ height: chartHeight * LAYOUT.PIE_HEIGHT_RATIO }}
          >
            <Pie {...getPieConfig(data)} />
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Segmented
          options={[
            { label: "Timeline", value: "timeline" },
            { label: "Distribution", value: "pie" },
          ]}
          value={chartType}
          onChange={(value) => setChartType(value as "timeline" | "pie")}
          block
        />
      </div>
      <div className="flex-1" style={{ height: chartHeight }}>
        {chartType === "timeline" ? (
          <Line {...getTimelineConfig(data)} height={chartHeight} />
        ) : (
          <Pie {...getPieConfig(data)} height={chartHeight} />
        )}
      </div>
    </div>
  );
};

export default MoodCharts;

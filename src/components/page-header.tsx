import { Typography } from "antd";
import type { ReactNode } from "react";

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  extra?: ReactNode;
}

export const PageHeader = ({ title, extra }: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row space-between items-left">
      <Title level={2} className="">
        {title}
      </Title>
      {extra && <div className="flex space-x-2">{extra}</div>}
    </div>
  );
};

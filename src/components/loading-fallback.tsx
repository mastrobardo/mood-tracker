import { Spin } from "antd";

export const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-[40dvh]">
    <Spin size="large" />
  </div>
);

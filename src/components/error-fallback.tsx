import { Result, Button } from "antd";
import { useNavigate, useRouteError } from "react-router-dom";
import { ROUTES } from "../router/routes";

export const ErrorFallback = () => {
  const navigate = useNavigate();
  const error = useRouteError() as Error;

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Result
        status="error"
        title="Something went wrong"
        subTitle={error?.message}
        extra={[
          <Button
            key="home"
            type="primary"
            onClick={() => navigate(ROUTES.HOME)}
            className="bg-blue-500"
          >
            Back Home
          </Button>,
          <Button key="reload" onClick={() => window.location.reload()}>
            Try Again
          </Button>,
        ]}
      />
    </div>
  );
};

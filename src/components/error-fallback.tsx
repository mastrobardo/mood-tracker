import { Result, Button } from "antd";
import { useNavigate, useRouteError } from "react-router-dom";
import { ROUTES } from "../router/routes";
import { useTranslation } from "react-i18next";

export const ErrorFallback = () => {
  const navigate = useNavigate();
  const error = useRouteError() as Error;
  const { t } = useTranslation();

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Result
        status="error"
        title={t("error.generalError")}
        subTitle={error?.message}
        extra={[
          <Button
            key="home"
            type="primary"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="bg-blue-500"
          >
            {t("common.backHome")}
          </Button>,
          <Button key="reload" onClick={() => window.location.reload()}>
            {t("common.tryAgain")}
          </Button>,
        ]}
      />
    </div>
  );
};

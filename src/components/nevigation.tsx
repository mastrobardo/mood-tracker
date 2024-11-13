import {
  MenuOutlined,
  HomeOutlined,
  BarChartOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ROUTES } from "../router/routes";
import { useTranslation } from "react-i18next";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <header className="flex items-center h-14 bg-[#0a192f] w-full">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-center w-10 h-14 text-white bg-transparent border-0 hover:bg-[#132f4c]"
        >
          <MenuOutlined />
        </button>

        <Link
          to={ROUTES.DASHBOARD}
          className="text-lg font-semibold text-blue-400"
        >
          {t("app.title")}
        </Link>
      </header>

      {mobileMenuOpen && (
        <nav className="fixed left-0 right-0 top-14 bg-white border-b w-full">
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-2 px-4 py-3 text-black hover:bg-blue-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <HomeOutlined />
            <span>{t("nav.dashboard")}</span>
          </Link>
          <Link
            to={ROUTES.MOODS}
            className="flex items-center gap-2 px-4 py-3 text-black hover:bg-blue-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <BarChartOutlined />
            <span>{t("nav.moods")}</span>
          </Link>
          <Link
            to={ROUTES.TASKS}
            className="flex items-center gap-2 px-4 py-3 text-black hover:bg-blue-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <CheckSquareOutlined />
            <span>{t("nav.tasks")}</span>
          </Link>
        </nav>
      )}
    </div>
  );
};

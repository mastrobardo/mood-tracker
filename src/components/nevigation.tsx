import {
  MenuOutlined,
  HomeOutlined,
  BarChartOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { ROUTES } from "../router/routes";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  const NavLinks = () => (
    <>
      <Link
        to={ROUTES.DASHBOARD}
        className={classNames(
          "flex items-center gap-2 px-6 h-14 md:w-28 justify-center hover:bg-primary-hover",
          {
            "bg-primary text-white": location.pathname === ROUTES.DASHBOARD,
            "text-black md:text-white": location.pathname !== ROUTES.DASHBOARD,
          }
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <HomeOutlined />
        <span>{t("nav.dashboard")}</span>
      </Link>
      <Link
        to={ROUTES.MOODS}
        className={classNames(
          "flex items-center gap-2 px-6 h-14 md:w-28 justify-center hover:bg-primary-hover",
          {
            "bg-primary text-white": location.pathname === ROUTES.MOODS,
            "text-black md:text-white": location.pathname !== ROUTES.MOODS,
          }
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <BarChartOutlined />
        <span>{t("nav.moods")}</span>
      </Link>
      <Link
        to={ROUTES.TASKS}
        className={classNames(
          "flex items-center gap-2 px-6 h-14 md:w-28 justify-center hover:bg-primary-hover",
          {
            "bg-primary text-white": location.pathname === ROUTES.TASKS,
            "text-black md:text-white": location.pathname !== ROUTES.TASKS,
          }
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <CheckSquareOutlined />
        <span>{t("nav.tasks")}</span>
      </Link>
    </>
  );

  return (
    <div className="w-full bg-primary">
      <header className="flex items-center h-14 max-w-7xl mx-auto">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={classNames(
            "md:hidden flex items-center justify-center w-10 h-14 text-white bg-transparent border-0 hover:bg-primary-hover"
          )}
        >
          <MenuOutlined />
        </button>

        <Link
          to={ROUTES.DASHBOARD}
          className={classNames(
            "text-lg font-semibold text-blue-400 md:ml-4 md:w-48"
          )}
        >
          {t("app.title")}
        </Link>

        <nav className="hidden md:flex items-center">
          <NavLinks />
        </nav>
      </header>

      {mobileMenuOpen && (
        <nav className="md:hidden fixed left-0 right-0 top-14 bg-white border-b w-full">
          <NavLinks />
        </nav>
      )}
    </div>
  );
};

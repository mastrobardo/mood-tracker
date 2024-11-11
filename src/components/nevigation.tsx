import {
  MenuOutlined,
  HomeOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useState } from "react";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full">
      <header className="flex items-center h-14 bg-[#0a192f] w-full">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-center w-10 h-14 text-white bg-transparent border-0 hover:bg-[#132f4c]"
        >
          <MenuOutlined />
        </button>

        <Link to="/" className="text-lg font-semibold text-blue-400">
          Mood Tracker
        </Link>
      </header>

      {mobileMenuOpen && (
        <nav className="fixed left-0 right-0 top-14 bg-white border-b w-full">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-3 text-black hover:bg-blue-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <HomeOutlined />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/analytics"
            className="flex items-center gap-2 px-4 py-3 text-black hover:bg-blue-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <BarChartOutlined />
            <span>Analytics</span>
          </Link>
        </nav>
      )}
    </div>
  );
};

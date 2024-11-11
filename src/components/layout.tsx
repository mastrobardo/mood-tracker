import { Layout as AntLayout } from "antd";
import { Outlet } from "react-router-dom";
import { Navigation } from "./nevigation";

const { Header, Content } = AntLayout;

export const Layout = () => (
  <AntLayout className="min-h-screen bg-gray-50">
    <Header className="fixed w-full z-50 px-0 flex items-center shadow-sm bg-white">
      <Navigation />
    </Header>

    <Content className="mt-16 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="p-6 bg-white rounded-lg">
          <Outlet />
        </div>
      </div>
    </Content>
  </AntLayout>
);

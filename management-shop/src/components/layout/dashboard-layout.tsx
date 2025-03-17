import { Layout } from 'antd';
import Sidebar from './sidebar';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const DashboardLayout = () => {
  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Content className="p-6 bg-gray-50 w-full">
          <div className="bg-white rounded-lg p-6 min-h-[calc(100vh-48px)] w-full">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;

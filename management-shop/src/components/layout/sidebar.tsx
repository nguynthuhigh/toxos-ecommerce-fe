import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  StarOutlined,
  DollarOutlined,
  WalletOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      section: "Quản Lý",
      items: [
        { path: "/products", label: "Sản Phẩm", icon: <ShoppingOutlined /> },
        { path: "/orders", label: "Đơn Hàng", icon: <ShoppingCartOutlined /> },
        { path: "/discounts", label: "Mã Giảm Giá", icon: <TagOutlined /> },
        { path: "/reviews", label: "Quản Lý Đánh Giá", icon: <StarOutlined /> },
      ],
    },
    {
      section: "Tài Chính",
      items: [
        { path: "/revenue", label: "Doanh Thu", icon: <DollarOutlined /> },
        {
          path: "/balance",
          label: "Số Dư Tài Khoản Toxos",
          icon: <WalletOutlined />,
        },
      ],
    },
    {
      section: "Báo Cáo",
      items: [
        { path: "/statistics", label: "Thống Kê", icon: <BarChartOutlined /> },
      ],
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 bottom-0   bg-white border-r border-gray-200 z-10 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <Link
            to="/"
            className="text-xl font-semibold text-gray-800 hover:text-blue-600"
          >
            Toxos Shop
          </Link>
        )}
        <button
          onClick={() => onCollapse(!collapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {collapsed ? (
            <MenuUnfoldOutlined className="text-lg" />
          ) : (
            <MenuFoldOutlined className="text-lg" />
          )}
        </button>
      </div>
      <nav className="h-[calc(100vh-4rem)] overflow-y-auto">
        <ul className="p-4 space-y-1">
          {menuItems.map((section, index) => (
            <React.Fragment key={section.section}>
              {index > 0 && <li className="mt-6 mb-4" />}
              {!collapsed && (
                <li className="mb-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                    {section.section}
                  </span>
                </li>
              )}
              {section.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

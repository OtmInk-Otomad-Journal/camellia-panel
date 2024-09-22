import React from "react";

import { Menu } from "antd";

import { DeliveredProcedureOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const items = [
  {
    key: "/sub1",
    label: "制作周刊",
    icon: <DeliveredProcedureOutlined />,
    children: [
      {
        key: "/step0",
        label: "上传 Cookie",
      },
      {
        key: "/step1",
        label: "数据获取",
      },
      {
        key: "/step2",
        label: "审核 / 编辑数据",
      },
      {
        key: "/step3",
        label: "上传 Pick Up 数据",
      },
      {
        key: "/step4",
        label: "筛选 Pick Up 数据",
      },
      {
        key: "/step5",
        label: "运行 Pick Up 数据",
      },
      {
        key: "/step6",
        label: "小日历",
      },
      {
        key: "/step7",
        label: "启动渲染",
      },
      {
        key: "/step8",
        label: "获取结果",
      },
    ],
  },
];

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Menu
      theme="dark"
      selectedKeys={location.pathname}
      defaultOpenKeys={["/sub1"]}
      destyle={{ height: "100%", borderRight: 0 }}
      mode="inline"
      items={items}
      onClick={({ key }) => {
        navigate(key);
      }}
    />
  );
};

export default SideMenu;

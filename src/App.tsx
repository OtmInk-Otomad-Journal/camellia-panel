import { Col, ConfigProvider, Layout, Row, theme, Typography } from "antd";
import React, { PropsWithChildren, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import SideMenu from "./components/SideMenu.tsx";
import { BarChartOutlined } from "@ant-design/icons";
import DarkValue from "./common/darkvalue";

const { Header, Content, Sider } = Layout;

const OutBox: React.FC<PropsWithChildren<{}>> = (slot) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <div
      style={{
        padding: 24,
        minHeight: "calc(100% - 32px)",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        margin: "16px 0",
        boxSizing: "border-box",
      }}
    >
      {slot.children}
    </div>
  );
};

import "./index.css";

const { Title } = Typography;
// import { Children } from 'react';

const App: React.FC<PropsWithChildren<{}>> = () => {
  // 动态检测暗黑模式
  const queryDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
  const [darkStyle, setDarkStyle] = useState(
    queryDarkMode.matches ? true : false
  );
  useEffect(() => {
    queryDarkMode.addEventListener("change", () => {
      setDarkStyle(queryDarkMode.matches ? true : false);
    });
  });

  return (
    <ConfigProvider
      theme={{
        algorithm: darkStyle ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <DarkValue.Provider value={darkStyle}>
        <Layout style={{ height: "100vh" }}>
          <Header style={{ display: "flex", alignItems: "center" }}>
            {/* style={{ display: "flex", alignItems: "center" }} */}
            <Row
              style={{ width: "100%" }}
              justify={{ lg: "start", sm: "center" }}
            >
              <Col>
                <Title style={{ fontSize: "2em" }}>
                  <BarChartOutlined style={{ marginRight: "0.3em" }} />
                  音之墨小周刊 · 面板
                </Title>
              </Col>
            </Row>
          </Header>
          <Layout>
            <Sider breakpoint="lg" collapsedWidth="0">
              <SideMenu />
            </Sider>
            <Layout>
              <Content
                style={{
                  padding: "0 16px",
                  overflowY: "scroll",
                }}
              >
                <OutBox>
                  <Outlet />
                </OutBox>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </DarkValue.Provider>
    </ConfigProvider>
  );
};

export default App;

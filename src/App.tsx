import { ConfigProvider, Layout, theme  } from 'antd';
import { MenuProps, App as AntdApp } from 'antd';
import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import SideMenu from './components/SideMenu.tsx';

import { RouterProvider } from "react-router-dom";
import { router } from "./router/router.tsx";

const { Header, Content, Footer, Sider } = Layout;

const OutBox: React.FC<PropsWithChildren<{}>> = (slot) => {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  return (
      <div
          style={{
              padding: 24,
              minHeight: "calc(100% - 32px)",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              margin: '16px 0',
              boxSizing: "border-box"
          }}
      >
          {slot.children}
      </div>
  );
};

import './index.css';
// import { Children } from 'react';

const App: React.FC<PropsWithChildren<{}>> = () => {

  // const navigate = useNavigate();
  // 动态检测暗黑模式
  const queryDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
  const [themeStyle, setThemeStyle] = useState(queryDarkMode.matches ? true : false);
  useEffect(() => {
      queryDarkMode.addEventListener("change", () => {
          setThemeStyle(queryDarkMode.matches ? true : false)
      })
  })

  return (
    <ConfigProvider theme = {{ algorithm: themeStyle ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <SideMenu />
        </Sider>
        <Layout style={{ height: "100vh" }}>
          <Content style={{ margin: '0 16px' }}>
            <OutBox>
              <Outlet />
            </OutBox>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App

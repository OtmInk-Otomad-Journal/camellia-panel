import { ConfigProvider, Layout, Menu, theme  } from 'antd';
import { MenuProps, App as AntdApp } from 'antd';
import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

import { DeliveredProcedureOutlined } from '@ant-design/icons';

const items = [
  {
    key: '/sub1',
    label: '制作周刊',
    icon: <DeliveredProcedureOutlined />,
    children: [
      {
        key: '/step1',
        label: '数据获取',
      },
      {
        key: '/step2',
        label: '上传 Pick Up 数据',
      },
      {
        key: '/step3',
        label: '筛选 Pick Up 数据',
      },
      {
        key: '/step4',
        label: '小日历',
      },
      {
        key: '/step5',
        label: '启动渲染',
      },
      {
        key: '/step6',
        label: '获取结果',
      }
    ],
  }
];

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

const App: React.FC<PropsWithChildren<{}>> = ( {children} ) => {

  const navigate = useNavigate();
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
            <Menu openKeys={['/sub1']} selectedKeys={[location.pathname]} style={{ height: '100%', borderRight: 0 }} mode="inline" items={items} onClick={({ key }) => {
                if (key != location.pathname) {
                    navigate(key);
                }}}/>
        </Sider>
        <Layout style={{ height: "100vh" }}>
          <Content style={{ margin: '0 16px' }}>
            <OutBox>
              <Outlet />
              { children }
            </OutBox>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App

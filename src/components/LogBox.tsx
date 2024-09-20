import { theme, message } from "antd";

import SyntaxHighlighter from "react-syntax-highlighter";
import {
  a11yDark,
  a11yLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

import DarkValue from "../common/darkvalue";
import React, { PropsWithChildren, useEffect, useState } from "react";

import { address, port } from "../common/config";

const LogRef = React.createRef<HTMLDivElement>();

const LogOutBox: React.FC<PropsWithChildren> = ({ children }) => {
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  return (
    <div
      ref={LogRef}
      style={{
        height: 500,
        width: "100%",
        borderRadius: 8,
        overflowY: "scroll",
        boxSizing: "border-box",
        background: colorBgLayout,
      }}
    >
      {children}
    </div>
  );
};

export default function LogBox(props: { url: string }) {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    token: { colorBgElevated },
  } = theme.useToken();
  const [logs, setLogs] = useState("");

  useEffect(() => {
    const eventSource = new EventSource(`${address}:${port}` + props.url);

    eventSource.onmessage = (event) => {
      if (
        LogRef.current!.scrollTop >
        LogRef.current!.scrollHeight - LogRef.current!.offsetHeight - 100
      ) {
        setLogs((prev) => (prev == "" ? event.data : prev + "\n" + event.data));
        LogRef.current!.scrollTop = LogRef.current!.scrollHeight; // - LogRef.current!.offsetHeight;
      } else {
        setLogs((prev) => (prev == "" ? event.data : prev + "\n" + event.data));
      }
    };

    eventSource.onerror = (err) => {
      messageApi.error("日志显示失败，有可能是程序错误，亦或是网络故障。");
      console.error(err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      {contextHolder}
      <LogOutBox>
        <DarkValue.Consumer>
          {(value) => (
            <SyntaxHighlighter
              PreTag="div"
              CodeTag="span"
              lineNumberStyle={{
                background: colorBgElevated,
                marginRight: "0.5em",
              }}
              customStyle={{
                overflowX: "unset",
                padding: "none",
                background: "none",
                fontFamily: "Consolas",
              }}
              language="accesslog"
              showLineNumbers={true}
              style={value ? a11yDark : a11yLight}
            >
              {logs}
            </SyntaxHighlighter>
          )}
        </DarkValue.Consumer>
      </LogOutBox>
    </>
  );
}

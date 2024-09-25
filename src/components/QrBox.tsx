// 废弃，暂未使用的组件

import { message } from "antd";
import { QRCode } from "antd";

import { useEffect, useState } from "react";

import { address, port } from "../common/config";

export default function QrBox(props: { url: string }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [content, setContent] = useState("");

  useEffect(() => {
    const eventSource = new EventSource(`${address}:${port}` + props.url);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.qr_code_url) {
        messageApi.info("二维码已获取");
        setContent(JSON.parse(event.data).qr_code_url);
      }
      if (data.success == true) {
        messageApi.success("登录成功");
        setContent("");
        eventSource.close();
      }
      if (data.success == false) {
        messageApi.error("登录失败");
        setContent("");
        eventSource.close();
      }
    };

    eventSource.onerror = (err) => {
      messageApi.error("二维码执行失败。");
      setContent("");
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
      <QRCode value={content} />
    </>
  );
}

/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import { Button, message, Divider, Typography } from "antd";
import { get } from "../../common/api";
import { address, port } from "../../common/config";

import { QRCode } from "antd";

const { Title, Paragraph } = Typography;

const SendButton = ({ url }: { url: string }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [buttonState, setButtonState] = useState({
    danger: false,
    text: "扫码登录",
  });

  /**
   * 只会设置为 false
   */
  const falseButton = () => {
    setButtonState((prevState) => ({
      danger: false,
      text: prevState.danger ? "扫码登录" : "终止扫码",
    }));
  };
  const QrBox = (props: { url: string }) => {
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
          falseButton();
          eventSource.close();
        }
        if (data.success == false) {
          messageApi.error("登录失败");
          setContent("");
          falseButton();
          eventSource.close();
        }
      };

      eventSource.onerror = (err) => {
        messageApi.error("二维码执行失败。");
        setContent("");
        falseButton();
        console.error(err);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }, []);

    return (
      <>
        <QRCode value={content} />
      </>
    );
  };

  const toggleDanger = () => {
    if (buttonState.danger) {
      get("/backend/send-cookie/stop")()
        .then((_) => {
          messageApi.success("已终止扫码线程");
        })
        .catch((_) => {
          {
            messageApi.error("终止线程时遇到了异常");
          }
        });
    }
    setButtonState((prevState) => ({
      danger: !prevState.danger,
      text: prevState.danger ? "扫码登录" : "终止扫码",
    }));
  };

  return (
    <>
      {contextHolder}
      {buttonState.danger && <QrBox url={url} />}
      <Button
        style={{ marginTop: 12 }}
        type="primary"
        onClick={toggleDanger}
        danger={buttonState.danger}
      >
        {buttonState.text}
      </Button>
    </>
  );
};

export default function MainPage() {
  return (
    <>
      <Title level={2}>上传 Cookie</Title>
      <Paragraph>
        为了 B 站数据的获取与视频的下载，需要进行扫码以上传 Cookie。
      </Paragraph>
      <Divider orientation="left">扫码登录</Divider>
      <SendButton url="/backend/send-cookie" />
    </>
  );
}

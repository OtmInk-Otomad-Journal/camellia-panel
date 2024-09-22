/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
import { Button, message, Divider, Typography } from "antd";
import LogBox from "../../components/LogBox";
import { get } from "../../common/api";

const { Title, Paragraph } = Typography;

const SendButton = ({ url }: { url: string }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [buttonState, setButtonState] = useState({
    danger: false,
    text: "开始 / 继续获取",
  });

  const toggleDanger = () => {
    if (buttonState.danger) {
      get("/backend/get-pickup-data/stop")()
        .then((_) => {
          messageApi.success("已终止进程");
        })
        .catch((_) => {
          {
            messageApi.error("终止线程时遇到了异常");
          }
        });
    }
    setButtonState((prevState) => ({
      danger: !prevState.danger,
      text: prevState.danger ? "开始 / 继续获取" : "终止线程",
    }));
  };

  return (
    <>
      {contextHolder}
      {buttonState.danger && <LogBox url={url} />}
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
      <Title level={2}>运行 Pick Up 数据</Title>
      <Paragraph>
        运行 Pick Up 的数据，以下载视频资源、获取封面等的内容。
      </Paragraph>
      <Divider orientation="left">运行</Divider>
      <SendButton url="/backend/get-pickup-data" />
    </>
  );
}

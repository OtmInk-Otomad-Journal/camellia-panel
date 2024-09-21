/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
import {
  Space,
  Button,
  message,
  Select,
  Divider,
  Typography,
  DatePicker,
  InputNumber,
  Flex,
  theme,
  Form,
} from "antd";
import dayjs from "dayjs";
import LogBox from "../../components/LogBox";
import { get, post } from "../../common/api";

import { UploadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const { Title, Paragraph } = Typography;

const SendButton = ({ url }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [buttonState, setButtonState] = useState({
    danger: false,
    text: "开始 / 继续获取",
  });

  const toggleDanger = () => {
    if (buttonState.danger) {
      get("/backend/get-data/stop")()
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
  const date = new Date();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  return (
    <>
      {contextHolder}
      <Title level={2}>数据获取</Title>
      <Paragraph>获取本次周刊的数据。</Paragraph>
      <Divider orientation="left">参数设置</Divider>
      <Form
        onFinish={(values) => {
          setLoading(true);
          post("/backend/save-data-config", values)()
            .then((_) => {
              messageApi.success("已提交数据");
              setLoading(false);
            })
            .catch((_) => {
              {
                messageApi.error("提交数据时遇到了异常");
                setLoading(false);
              }
            });
        }}
      >
        <Form.Item label="获取时间范围" name="time_range">
          <RangePicker
            defaultValue={[
              dayjs(date.setDate(date.getDate() - 12)),
              dayjs(date.setDate(date.getDate() + 6)),
            ]}
            disabled
          />
        </Form.Item>
        <Form.Item label="拉取分区代码" name="video_zones">
          <Select
            mode="tags"
            style={{ width: "100%" }}
            defaultValue={[26, 126, 22]}
          />
        </Form.Item>
        <Form.Item label="承认分区代码" name="tag_whitezone">
          <Select mode="tags" style={{ width: "100%" }} defaultValue={[26]} />
        </Form.Item>
        <Form.Item label="承认 TAG" name="tag_whitelist">
          <Select
            mode="tags"
            style={{ width: "100%" }}
            defaultValue={["音mad", "ytpmv"]}
          />
        </Form.Item>
        <Form.Item label="拉取视频个数" name="pull_full_list_stat">
          <InputNumber defaultValue={100} />
        </Form.Item>
        <Form.Item label="主榜个数" name="main_end">
          <InputNumber defaultValue={15} />
        </Form.Item>
        <Form.Item label="主榜中断数" name="insert_count">
          <InputNumber defaultValue={5} />
        </Form.Item>
        <Form.Item label="副榜个数" name="side_end">
          <InputNumber defaultValue={40} />
        </Form.Item>
        <Form.Item label="间隔时间" name="sep_time">
          <InputNumber addonAfter="秒" defaultValue={20} />
        </Form.Item>
        <Form.Item label="主榜最长时间" name="max_main_duration">
          <InputNumber addonAfter="秒" defaultValue={70} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            <UploadOutlined /> 上传配置
          </Button>
        </Form.Item>
      </Form>
      <Divider orientation="left">运行</Divider>
      <SendButton url="/backend/get-data" />
    </>
  );
}

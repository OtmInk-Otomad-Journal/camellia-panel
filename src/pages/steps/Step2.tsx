/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
import { Button, message, Divider, Typography } from "antd";
import { get } from "../../common/api";

import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const rank_types = ["ytpmv", "common"];

export default function MainPage() {
  const [loadings, setLoadings] = useState<boolean[]>([false]);

  const [messageApi, contextHolder] = message.useMessage();

  const enterLoading = (index: number) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  };
  const exitLoading = (index: number) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = false;
      return newLoadings;
    });
  };

  const sendData = (index: number) => {
    enterLoading(index);
    setTimeout(() => {
      for (const rank_type of rank_types) {
        get("/backend/online-send-data?type=" + rank_type)()
          .then((_) => {
            messageApi.success(`已上传${rank_type}数据`);
            exitLoading(index);
          })
          .catch((_) => {
            {
              messageApi.error(`上传${rank_type}数据时遇到了异常`);
              exitLoading(index);
            }
          });
      }
    }, 800);
  };

  const downloadData = (index: number) => {
    enterLoading(index);
    setTimeout(() => {
      for (const rank_type of rank_types) {
        get("/backend/online-get-data?type=" + rank_type)()
          .then((_) => {
            messageApi.success(`已下载${rank_type}数据`);
            exitLoading(index);
          })
          .catch((_) => {
            {
              messageApi.error(`下载${rank_type}数据时遇到了异常`);
              exitLoading(index);
            }
          });
      }
    }, 800);
  };

  return (
    <>
      {contextHolder}
      <Title level={2}>上传 / 下载数据</Title>
      <Divider orientation="left">上传数据榜单</Divider>
      <Paragraph>
        点击下面的按钮，将数据发送到在线网站，以供审核组审核。
      </Paragraph>
      <Button
        type="primary"
        onClick={() => {
          sendData(0);
        }}
        loading={loadings[0]}
      >
        <UploadOutlined />
        上传数据
      </Button>
      <Divider orientation="left">下载数据榜单</Divider>
      <Paragraph>
        在所有内容均审核完毕后，点击下面的按钮以下载审核后的数据。
      </Paragraph>
      <Button
        type="primary"
        onClick={() => {
          downloadData(1);
        }}
        loading={loadings[1]}
      >
        <DownloadOutlined />
        下载数据
      </Button>
    </>
  );
}

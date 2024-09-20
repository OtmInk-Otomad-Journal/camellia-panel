/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";

import { Typography, Divider, Button, Step, message, Upload } from "antd";
import type { UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { address, port } from "../../common/config";

const { Title, Paragraph } = Typography;

export default function MainPage() {
  const props: UploadProps = {
    name: "file",
    action: `${address}:${port}/backend/upload-pickup`,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <>
      <Title level={2}>上传 Pick Up 数据</Title>
      <Paragraph>因技术开发成本有限，需要手动上传 Pick Up 文件。</Paragraph>
      <Divider orientation="left">从收集表下载文件</Divider>
      <Paragraph>
        请先前往收集表表格，将表格导出为 <b>.csv</b> 文件。
      </Paragraph>
      <Button
        type="primary"
        href="https://docs.qq.com/sheet/DQWhIY3pZTEZEcHl4"
        target="_blank"
      >
        前往收集表表格
      </Button>
      <Divider orientation="left">上传 CSV 文件</Divider>
      <Paragraph>
        在下面上传刚刚获取的 <b>.csv</b> 文件。
      </Paragraph>
      <Upload {...props}>
        <Button type="primary" icon={<UploadOutlined />}>
          上传文件
        </Button>
      </Upload>
    </>
  );
}

/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { Button, Divider, Typography, Select, Space, Card } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { get } from "../../common/api";
import { address, port } from "../../common/config";
import { BaseOptionType } from "antd/es/select";

const { Title, Paragraph, Text } = Typography;

type FastDataType = {
  content: string;
};

type ResultListType = {
  files: BaseOptionType[];
};

type FastListType = {
  files: BaseOptionType[];
};

export default function MainPage() {
  const [filelist, setFileList] = useState<ResultListType["files"]>([]);
  const [file, setFile] = useState();
  const [fastlist, setFastList] = useState<FastListType["files"]>([]);
  const [fast, setFast] = useState("");

  const pullFast = (filename: string) => {
    get<FastDataType>(`/backend/get-fastview/${filename}`)().then((data) => {
      // setListData(data);
      setFast(data.content);
    });
  };
  useEffect(() => {
    get<ResultListType>("/backend/get-result-list")().then((data) => {
      // setListData(data);
      setFileList(data.files);
    });
    get<FastListType>("/backend/get-fastview-list")().then((data) => {
      // setListData(data);
      setFastList(data.files);
    });
  }, []);
  return (
    <>
      <Title level={2}>获取结果</Title>
      <Paragraph>渲染结束后，下载结果并上传到 B 站。</Paragraph>
      <Divider orientation="left">下载文件</Divider>
      <Paragraph>选择对应的视频文件进行下载。</Paragraph>
      <Space size="middle">
        <Select onChange={setFile} style={{ width: 200 }} options={filelist} />
        <Button
          type="primary"
          href={`${address}:${port}/backend/download-result/${file}`}
          target="_blank"
        >
          <DownloadOutlined />
          下载文件
        </Button>
      </Space>
      <Divider orientation="left">快速导航</Divider>
      <Paragraph>在下面选择要展示的快速导航文件。</Paragraph>
      <Select
        onChange={(value) => {
          pullFast(value);
        }}
        style={{ width: 200 }}
        options={fastlist}
      />
      <Card style={{ marginTop: 16 }}>
        <Text style={{ whiteSpace: "pre-wrap" }}>{fast}</Text>
      </Card>
    </>
  );
}

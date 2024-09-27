/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Typography,
  Select,
  Space,
  Popconfirm,
  message,
} from "antd";
import {
  DeleteOutlined,
  NodeExpandOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { get } from "../../common/api";
import { BaseOptionType } from "antd/es/select";
import { address, port } from "../../common/config";

const { Title, Paragraph } = Typography;

type ResultListType = {
  files: BaseOptionType[];
};

type ClipListType = {
  files: BaseOptionType[];
};

type DirListType = {
  dirs: BaseOptionType[];
};

export default function MainPage() {
  const [filelist, setFileList] = useState<ResultListType["files"]>([]);
  const [file, setFile] = useState("");
  const [cliplist, setClipList] = useState<ClipListType["files"]>([]);
  const [clip, setClip] = useState("");
  const [dclip, setDClip] = useState("");
  const [clipdirlist, setClipDirList] = useState<ClipListType["files"]>([]);
  const [dir, setDir] = useState("");

  const [messageApi, contextHolder] = message.useMessage();

  const load_data = () => {
    get<ResultListType>("/backend/get-result-list")().then((data) => {
      // setListData(data);
      setFileList(data.files);
    });
    get<ClipListType>("/backend/get-clip-list")().then((data) => {
      // setListData(data);
      setClipList(data.files);
    });
    get<DirListType>("/backend/get-clip-dir-list")().then((data) => {
      // setListData(data);
      setClipDirList(data.dirs);
    });
  };

  useEffect(() => {
    load_data();
  }, []);

  const removeClip = (filename: string) => {
    get(`/backend/del-clip/${filename}`)()
      .then((_) => {
        messageApi.success("已删除该片段");
        load_data();
      })
      .catch((_) => {
        {
          messageApi.error("删除时遇到了异常");
        }
      });
  };

  const removeFinal = (filename: string) => {
    get(`/backend/del-final/${filename}`)()
      .then((_) => {
        messageApi.success("已删除该片段");
        load_data();
      })
      .catch((_) => {
        {
          messageApi.error("删除时遇到了异常");
        }
      });
  };

  const copyDir = (dirname: string) => {
    get(`/backend/unpack-clip-dir/${dirname}`)()
      .then((_) => {
        messageApi.success("已解包该文件夹");
        load_data();
      })
      .catch((_) => {
        {
          messageApi.error("解包时遇到了异常");
        }
      });
  };
  return (
    <>
      {contextHolder}
      <Title level={2}>删除调整</Title>
      <Paragraph>
        渲染结束后，如果你发现其中的内容存在异常，可以在此进行文件的删除。
      </Paragraph>
      <Divider orientation="left">删除总合成</Divider>
      <Paragraph>选择对应的视频文件进行删除。</Paragraph>
      <Space size="middle">
        <Select onChange={setFile} style={{ width: 200 }} options={filelist} />
        <Popconfirm
          title="删除文件"
          description="你确定要删除这个文件吗？"
          onConfirm={() => removeFinal(file)}
          okText="确认"
          cancelText="取消"
        >
          <Button type="primary" danger>
            <DeleteOutlined />
            删除文件
          </Button>
        </Popconfirm>
      </Space>
      <Divider orientation="left">删除片段</Divider>
      <Paragraph>选择对应的片段进行删除。</Paragraph>
      <Space size="middle">
        <Select onChange={setClip} style={{ width: 200 }} options={cliplist} />
        <Popconfirm
          title="删除文件"
          description="你确定要删除这个文件吗？"
          onConfirm={() => removeClip(clip)}
          okText="确认"
          cancelText="取消"
        >
          <Button type="primary" danger>
            <DeleteOutlined />
            删除文件
          </Button>
        </Popconfirm>
      </Space>
      <Divider orientation="left">下载片段</Divider>
      <Paragraph>选择对应的片段进行下载。</Paragraph>
      <Space size="middle">
        <Select onChange={setDClip} style={{ width: 200 }} options={cliplist} />
        <Button
          type="primary"
          href={`${address}:${port}/backend/download-clip/${dclip}`}
          target="_blank"
        >
          <DownloadOutlined />
          下载文件
        </Button>
      </Space>
      <Divider orientation="left">解包已渲染的文件夹</Divider>
      <Paragraph>
        选择对应的文件夹进行解包，其中的文件会复制到根文件夹中。
      </Paragraph>
      <Space size="middle">
        <Select
          onChange={setDir}
          style={{ width: 200 }}
          options={clipdirlist}
        />
        <Popconfirm
          title="解包文件夹"
          description="你确定要解包这个文件夹吗？"
          onConfirm={() => copyDir(dir)}
          okText="确认"
          cancelText="取消"
        >
          <Button type="primary">
            <NodeExpandOutlined />
            解包文件夹
          </Button>
        </Popconfirm>
      </Space>
    </>
  );
}

/* eslint-disable react/react-in-jsx-scope */
import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
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
  Collapse,
  Input,
  Form,
  Row,
  Col,
  FormListFieldData,
} from "antd";
import { CloseOutlined, ArrowRightOutlined } from "@ant-design/icons";
import get from "../../common/api";
import { address, port } from "../../common/config";
import { JSX } from "react/jsx-runtime";

type pullData = {
  ranking: string;
  score: string;
  aid: string;
  bvid: string;
  cid: string;
  title: string;
  uploader: string;
  uid: string;
  copyright: string;
  play: string;
  like: string;
  coin: string;
  star: string;
  pubtime: string;
  adjust_scale: string;
  prescore: string;
  part: string;
  duration: string;
  start_time: string;
  full_time: string;
  web_prefix: string;
  video_src: string;
  cover_src: string;
  avatar_src: string;
  danmaku_src: string;
  light_color: string;
  dark_color: string;
  score_add: string;
};

const { Title, Paragraph } = Typography;

function ComText({ children }) {
  return (
    <span
      style={{
        display: "inline-block",
        minWidth: "8em",
      }}
    >
      {children}
    </span>
  );
}

/**
 * 动态获取表单值，会因值变化而变化
 */
const getValue = (field: FormListFieldData, attr: string) => {
  const form = Form.useFormInstance();
  return Form.useWatch(["items", field.name, attr], form);
};

/**
 * 静态获取表单值，但不重新定义 form
 */
function checkValueWithForm(form, field: FormListFieldData, attr: string) {
  return form.getFieldValue(["items", field.name, attr], form);
}

/**
 * 静态获取表单值，仅拉取一次
 */
const checkValue = (field: FormListFieldData, attr: string) => {
  const form = Form.useFormInstance();
  return form.getFieldValue(["items", field.name, attr]);
};

const PanelInside = ({ field }) => {
  const form = Form.useFormInstance();

  const aid = getValue(field, "aid");
  const bvid = getValue(field, "bvid");

  const scoreChange = () => {
    form.setFieldValue(
      ["items", field.name, "score"],
      checkValueWithForm(form, field, "prescore") *
        checkValueWithForm(form, field, "adjust_scale")
    );
  };

  return (
    <>
      <Divider orientation="left">基本信息</Divider>
      <Flex
        vertical={false}
        align="center"
        gap={10}
        style={{ marginBottom: 24 }}
      >
        <Button
          type="primary"
          href={"https://bilibili.com/video/av" + aid}
          target="_blank"
        >
          av{aid}
        </Button>
        <Button
          type="primary"
          href={"https://bilibili.com/video/" + bvid}
          target="_blank"
        >
          {bvid}
        </Button>
      </Flex>
      <Row gutter={48}>
        <Col>
          <Paragraph>上传者：{checkValue(field, "uploader")}</Paragraph>
          <Paragraph>UID：{checkValue(field, "uid")}</Paragraph>
          <Paragraph>
            版权声明：
            {[1, "1"].includes(checkValue(field, "copyright"))
              ? "自制"
              : "转载"}
          </Paragraph>
          <Paragraph>视频 CID：{checkValue(field, "cid")}</Paragraph>
        </Col>
        <Col>
          <Paragraph>播放量：{checkValue(field, "play")}</Paragraph>
          <Paragraph>点赞量：{checkValue(field, "like")}</Paragraph>
          <Paragraph>硬币量：{checkValue(field, "coin")}</Paragraph>
          <Paragraph>收藏量：{checkValue(field, "star")}</Paragraph>
        </Col>
        <Col>
          <Paragraph>发布时间：{checkValue(field, "pubtime")}</Paragraph>
          <Paragraph>视频长度：{checkValue(field, "duration")}</Paragraph>
          <Paragraph>
            浅色调：
            <div
              style={{
                display: "inline-block",
                width: "1.5em",
                height: "1.5em",
                marginRight: 5,
                borderRadius: 2,
                verticalAlign: "middle",
                background: "hsl" + checkValue(field, "light_color"),
              }}
            ></div>
            hsl{checkValue(field, "light_color")}
          </Paragraph>
          <Paragraph>
            暗色调：
            <div
              style={{
                display: "inline-block",
                width: "1.5em",
                height: "1.5em",
                marginRight: 5,
                borderRadius: 2,
                verticalAlign: "middle",
                background: "hsl" + checkValue(field, "dark_color"),
              }}
            ></div>
            hsl{checkValue(field, "dark_color")}
          </Paragraph>
        </Col>
      </Row>
      {/* <Divider orientation="left">排位</Divider> */}
      {/* <Form.Item label="排位" name={[field.name, "ranking"]}>
        <InputNumber />
      </Form.Item> */}
      <Divider orientation="left">分数</Divider>
      <Row>
        <Col>
          <Row>
            <Col>
              <Form.Item label="原始分数" name={[field.name, "prescore"]}>
                <InputNumber onChange={async () => await scoreChange()} />
              </Form.Item>
              <Form.Item label="赋分系数" name={[field.name, "adjust_scale"]}>
                <InputNumber onChange={async () => await scoreChange()} />
              </Form.Item>
            </Col>
            <Col>
              <Row align="middle" justify="center" style={{ height: "100%" }}>
                <ArrowRightOutlined
                  style={{ fontSize: "3em", margin: "0 1em" }}
                />
              </Row>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row align="middle" style={{ height: "100%" }}>
            <Form.Item label="最终分数" name={[field.name, "score"]}>
              <Input />
            </Form.Item>
          </Row>
        </Col>
      </Row>
      <Divider orientation="left">配置</Divider>
      <Form.Item label="视频分 P" name={[field.name, "part"]}>
        <InputNumber />
      </Form.Item>
      <Form.Item label="截取起点" name={[field.name, "start_time"]}>
        <InputNumber addonAfter="秒" />
      </Form.Item>
      <Form.Item label="截取时长" name={[field.name, "full_time"]}>
        <InputNumber addonAfter="秒" />
      </Form.Item>
      <Form.Item label="额外标签" name={[field.name, "score_add"]}>
        <Input />
      </Form.Item>
    </>
  );
};

const ItemList = ({ field, remove }) => {
  const form = Form.useFormInstance();

  return (
    <>
      <Collapse
        size="large"
        items={[
          {
            key: "1",
            label: (
              <Flex align="center">
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "1.5em",
                    fontWeight: "bold",
                    minWidth: "2em",
                  }}
                >
                  {field.name + 1}
                </span>
                {checkValue(field, "title")}
                <Button
                  danger
                  style={{
                    position: "absolute",
                    right: 55,
                  }}
                  onClick={async () => await remove(field.name)}
                >
                  删除
                </Button>
              </Flex>
            ),
            children: <PanelInside field={field} />,
          },
        ]}
        expandIconPosition="end"
      />
    </>
  );
};
const DataBox = () => {
  const [form] = Form.useForm();

  const [listData, setListData] = useState<[pullData]>([]);
  form.setFieldValue("items", listData);

  useEffect(() => {
    get(`${address}:${port}/backend/pull-data`)().then((data) => {
      setListData(data);
    });
  }, []);

  return (
    <>
      <Form form={form}>
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <Space direction="vertical" style={{ width: "100%" }}>
              {fields.map((field) => {
                if (field.key < 10) {
                  return (
                    <ItemList key={field.key} field={field} remove={remove} />
                  );
                }
              })}
            </Space>
          )}
        </Form.List>
        <Form.Item noStyle shouldUpdate>
          {() => (
            <Typography>
              <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
            </Typography>
          )}
        </Form.Item>
      </Form>
    </>
  );
};

export default function MainPage() {
  return (
    <>
      <Title level={2}>审核 / 编辑数据</Title>
      <Paragraph>获取数据后，可以在这里审核并编辑数据。</Paragraph>
      <Divider orientation="left">数据列表</Divider>
      <DataBox />
      <Space></Space>
      <Divider orientation="left">数据提交</Divider>
      {/* <SendButton url={`${address}:${port}/backend/get-data`} /> */}
    </>
  );
}

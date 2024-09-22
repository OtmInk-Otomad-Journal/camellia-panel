/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import {
  Space,
  Button,
  message,
  Divider,
  Typography,
  Flex,
  theme,
  Form,
  FormListFieldData,
  ConfigProvider,
  ColorPicker,
  Upload,
  UploadProps,
  InputNumber,
  FormInstance,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { get, post } from "../../common/api";
import parse from "html-react-parser";

import "../../assets/calendarStyle.scss";

import ImgCrop from "antd-img-crop";
import { address, port, web_prefix, panel_prefix } from "../../common/config";

const { Title, Paragraph, Text } = Typography;

/**
 * 动态获取表单值，会因值变化而变化
 */
const getValue = (field: FormListFieldData, attr: string) => {
  const form = Form.useFormInstance();
  return Form.useWatch(["items", field.name, attr], form);
};

/**
 * 静态获取表单值，仅拉取一次
 */
const checkValue = (field: FormListFieldData, attr: string) => {
  const form = Form.useFormInstance();
  return form.getFieldValue(["items", field.name, attr]);
};

/**
 * 静态改变表单值，但不重新定义 form
 */
const changeValueWF = (
  form: FormInstance<any>,
  field: FormListFieldData,
  attr: string,
  value: string
) => {
  form.setFieldValue(["items", field.name, attr], value);
};

const TextBoxWithTags = ({
  className,
  field,
  attr,
  style = {},
}: {
  className: string;
  field: FormListFieldData;
  attr: string;
  style?: {};
}) => {
  const form = Form.useFormInstance();

  const textValue = getValue(field, attr);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        <Text
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            color: "rgba(0,0,0,0)",
            userSelect: "none",
          }}
          editable={{
            onChange: (value) => changeValueWF(form, field, attr, value),
            autoSize: true,
            triggerType: ["text"],
          }}
        >
          {textValue || "<空白内容>"}
        </Text>
        <Text
          className={className}
          style={{
            opacity: textValue ? 1 : 0.5,
            ...style,
          }}
        >
          {parse(textValue || "<空白内容>")}
        </Text>
      </div>
    </>
  );
};

const TextBox = ({
  className,
  field,
  attr,
  style = {},
}: {
  className: string;
  field: FormListFieldData;
  attr: string;
  style?: {};
}) => {
  const form = Form.useFormInstance();

  const textValue = getValue(field, attr);

  return (
    <>
      <Text
        className={className}
        style={{
          opacity: textValue ? 1 : 0.5,
          ...style,
        }}
        editable={{
          onChange: (value) => changeValueWF(form, field, attr, value),
          autoSize: true,
          triggerType: ["text"],
        }}
      >
        {textValue || "<空白内容>"}
      </Text>
    </>
  );
};

const CalendarBox = ({
  field,
  remove,
}: {
  field: FormListFieldData;
  remove: (index: number | number[]) => void;
}) => {
  const form = Form.useFormInstance();

  // const [image, setImage] = useState(
  //   checkValue(field, "web_prefix") + checkValue(field, "cover")
  // );

  const uploadTypes: UploadProps = {
    name: "file",
    action: `${address}:${port}/backend/upload-calendar-image`,
    onChange(info) {
      if (info.file.status === "done") {
        const url = info.file.response.data.url;
        changeValueWF(form, field, "cover", url);
        // setImage(checkValueWithForm(form, field, "web_prefix") + url);
        message.success(`图片上传成功`);
      } else if (info.file.status === "error") {
        message.error(`图片上传失败`);
      }
    },
  };

  return (
    <>
      <div className="extra-single">
        <div className="rightI">
          <div className="ca-time">
            <ColorPicker
              defaultValue={checkValue(field, "color")}
              onChange={(_value, css) =>
                changeValueWF(form, field, "color", css)
              }
            >
              <Flex
                justify="center"
                style={{
                  borderRadius: "0.5rem 0.5rem 0 0",
                  backgroundColor: getValue(field, "color"),
                }}
              >
                <TextBox
                  style={{
                    width: "fit-content",
                  }}
                  className="ca-progress"
                  field={field}
                  attr="progress"
                />
              </Flex>
            </ColorPicker>
            <div className="ca-date-wrapper">
              <TextBoxWithTags className="ca-date" field={field} attr="date" />
            </div>
          </div>
          <div className="ca-title-box">
            <TextBox className="ca-title" field={field} attr="title" />
            <TextBox className="ca-subtitle" field={field} attr="subtitle" />
            {/* <div className="ca-subtitle">data.subtitle</div> */}
          </div>
        </div>
        <div className="cover-mask"></div>
        <img
          key={field.name}
          className="cover"
          src={panel_prefix + (getValue(field, "cover") || "")}
        />
        <Space>
          <ImgCrop aspect={1368 / 128}>
            <Upload showUploadList={false} {...uploadTypes}>
              <Button>
                <UploadOutlined /> 上传背景图
              </Button>
            </Upload>
          </ImgCrop>
          <Button danger onClick={async () => remove(field.name)}>
            删除
          </Button>
        </Space>
      </div>
    </>
  );
};

const DataBox = () => {
  const [form] = Form.useForm();

  // const [listData, setListData] = useState<[pullData]>([]);
  // form.setFieldValue("items", listData);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    get("/backend/get-calendar")().then((data) => {
      // setListData(data);
      form.setFieldValue("items", data);
      setLoaded(true);
    });
  }, []);

  return (
    <>
      {loaded && (
        <Form form={form}>
          <Form.Item>
            <ResortData></ResortData>
          </Form.Item>
          <Form.List name="items">
            {(fields, { add, remove }) => {
              return (
                <>
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    <ConfigProvider
                      theme={{ algorithm: theme.defaultAlgorithm }}
                    >
                      <Space
                        direction="vertical"
                        size="middle"
                        style={{ width: "100%" }}
                      >
                        {fields.map((field) => (
                          <CalendarBox
                            key={field.name}
                            field={field}
                            remove={remove}
                          />
                        ))}
                      </Space>
                    </ConfigProvider>
                    <Button
                      type="dashed"
                      onClick={() =>
                        add({
                          color: "rgb(0,128,0)",
                          progress: "状态",
                          date: "日期",
                          title: "新项目",
                          subtitle: "",
                          web_prefix: web_prefix,
                          cover: "",
                        })
                      }
                      block
                    >
                      + 添加项目
                    </Button>
                  </Space>
                </>
              );
            }}
          </Form.List>
          {/* <Form.Item noStyle shouldUpdate>
            {() => (
              <Typography>
                <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
              </Typography>
            )}
          </Form.Item> */}
        </Form>
      )}
    </>
  );
};

const ResortData = () => {
  const [loadings, setLoadings] = useState<boolean[]>([false, false]);

  const [messageApi, contextHolder] = message.useMessage();

  const form = Form.useFormInstance();

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
      const data: [] = form.getFieldValue("items");
      post("/backend/save-calendar", data)()
        .then((_) => {
          messageApi.success("已提交数据");
          exitLoading(index);
        })
        .catch((_) => {
          {
            messageApi.error("提交数据时遇到了异常");
            exitLoading(index);
          }
        });
    }, 800);
  };
  return (
    <>
      {contextHolder}
      <Space size="middle">
        <Button
          type="primary"
          onClick={() => {
            sendData(0);
          }}
          loading={loadings[0]}
        >
          <UploadOutlined />
          上传 / 保存数据
        </Button>
      </Space>
    </>
  );
};

const ConfigBox = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  return (
    <>
      {contextHolder}
      <Form
        form={form}
        onFinish={(values) => {
          setLoading(true);
          console.log(values);
          post("/backend/upload-calendar-config", values)()
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
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            <UploadOutlined /> 上传配置
          </Button>
        </Form.Item>
        <Form.Item label="开始时间" name="start_time">
          <InputNumber addonAfter="秒" />
        </Form.Item>
        <Form.Item label="播放时长" name="full_time">
          <InputNumber addonAfter="秒" />
        </Form.Item>
        <Form.Item label="背景音乐">
          <Upload
            action={`${address}:${port}/backend/upload-calendar-music`}
            accept=".mp3"
          >
            <Button>
              <UploadOutlined /> 上传文件 (.mp3)
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </>
  );
};

export default function MainPage() {
  return (
    <>
      <Title level={2}>小日历</Title>
      <Paragraph>在此处编辑小日历，并配置相关参数。</Paragraph>
      <Paragraph>
        在日期栏中，可以使用
        <Text code>{"<m></m>"}</Text>将字号缩小；例如：
        <Text code>{"9<m>月</m>7<m>日</m>"}</Text>。
      </Paragraph>
      <Divider orientation="left">小日历配置</Divider>
      <ConfigBox />
      <Divider orientation="left">数据处理</Divider>
      <DataBox />
      <Space></Space>
      {/* <Divider orientation="left">数据提交</Divider> */}
    </>
  );
}

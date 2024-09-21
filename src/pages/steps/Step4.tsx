/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useRef } from "react";

import jsonp from "jsonp";

import dayjs from "dayjs";

import {
  Typography,
  Divider,
  Button,
  Step,
  message,
  Upload,
  Row,
  Card,
  Col,
  Switch,
  Steps,
  Flex,
} from "antd";
import { pickData } from "../../types/common";
import { get, post } from "../../common/api";
import { address, port } from "../../common/config";

import {
  FieldTimeOutlined,
  LikeOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";

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
  const [listData, setListData] = useState<pickData[]>([]);
  const [current, setCurrent] = useState(0);

  const [workData, setWorkData] = useState();

  const items = listData.map((item, index) => ({
    key: index + 1,
  }));

  const UploadData = () => {
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
        const data = listData;
        if (data.length > 0) {
          post("/backend/send-pickup-data", data)()
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
        } else {
          messageApi.error("数据为空，不能上传");
        }
      }, 800);
    };
    return (
      <>
        {contextHolder}
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
      </>
    );
  };

  const getBili = (aid: number | string) => {
    jsonp(
      "https://api.bilibili.com/x/web-interface/view?jsonp=jsonp&aid=" + aid,
      (err, response) => {
        if (response.code == 0) {
          setWorkData(response.data);
        } else {
          message.error(
            `Error when fetching data Code=${response.code} Msg=${response.message}`
          );
        }
      }
    );
  };

  const changeStatus = () => {
    setListData((data) => {
      data[current].status = !data[current].status;
      return data;
    });
    // setChecked(listData[current].status);
  };

  const changeCurrent = (num) => {
    setCurrent((value) => {
      getBili(listData[value + num].aid);
      return value + num;
    });
  };

  useEffect(() => {
    get("/backend/pull-pickup-data")().then((data) => {
      setListData(data);
      getBili(data[current].aid);
    });
  }, []);

  return (
    <>
      <Title level={2}>筛选 Pick Up 数据</Title>
      <Paragraph>在此进行 Pick Up 数据的筛选。</Paragraph>
      <Divider orientation="left">上传数据</Divider>
      <Paragraph>在所有数据均筛选完毕后，上传数据。</Paragraph>
      <UploadData />
      <Divider orientation="left">数据筛选</Divider>
      {listData.length > 0 && (
        <>
          <Card>
            <Row style={{ marginBottom: 24 }} gutter={24}>
              <Col>
                <Button
                  onClick={() => {
                    if (current > 0) {
                      changeCurrent(-1);
                    }
                  }}
                >
                  上一个
                </Button>
              </Col>
              <Col style={{ flex: 1 }}>
                <Steps current={current} items={items} />
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() => {
                    if (current < listData.length - 1) {
                      changeCurrent(1);
                    }
                  }}
                >
                  下一个
                </Button>
              </Col>
            </Row>
            <Flex justify="space-between">
              <Col flex={1}>
                {workData && (
                  <>
                    <Title level={3} style={{ margin: "10px 0" }}>
                      {workData.title}
                    </Title>
                    <Row gutter={12}>
                      <Col>
                        <FieldTimeOutlined style={{ marginRight: 5 }} />
                        {dayjs(workData.pubdate * 1000).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </Col>
                      <Col>
                        <UserOutlined style={{ marginRight: 5 }} />
                        {workData.owner.name}
                      </Col>
                    </Row>
                  </>
                )}
                <Divider orientation="left">纳入信息</Divider>
                <Switch
                  key={current}
                  checkedChildren="已纳入"
                  unCheckedChildren="未纳入"
                  defaultChecked={listData[current].status}
                  onChange={changeStatus}
                />
              </Col>
              <Col>
                <iframe
                  style={{
                    aspectRatio: "16 /9",
                    height: 200,
                    borderRadius: 4,
                    marginLeft: 24,
                  }}
                  src={`//player.bilibili.com/player.html?isOutside=true&aid=${listData[current].aid}`}
                  frameBorder="no"
                  framespacing="0"
                  allowFullScreen
                ></iframe>
              </Col>
            </Flex>
            <Divider orientation="left">推荐信息</Divider>
            <Row>
              <Col>
                <Title level={3} style={{ margin: "10px 0" }}>
                  <LikeOutlined style={{ marginRight: 10 }} />
                  {listData[current].picker}
                </Title>
                <Paragraph level={3}>{listData[current].reason}</Paragraph>
              </Col>
            </Row>
          </Card>
        </>
      )}
    </>
  );
}

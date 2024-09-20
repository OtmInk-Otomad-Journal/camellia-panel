/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useRef } from "react";

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
} from "antd";
import { pickData } from "../../types/common";
import { get, post } from "../../common/api";
import { address, port } from "../../common/config";

const { Title, Paragraph } = Typography;

// TODO
// TODO
// TODO

export default function MainPage() {
  const [listData, setListData] = useState<pickData[]>([{ status: false }]);
  const [current, setCurrent] = useState(0);
  const [checked, setChecked] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const items = listData.map((item, index) => ({
    key: index + 1,
  }));

  const changeStatus = () => {
    setListData((data) => {
      data[current].status = !data[current].status;
      return data;
    });
    // setChecked(listData[current].status);
  };

  const changeCurrent = (num) => {
    setCurrent((value) => value + num);
    console.log(listData[current].status);
    setChecked(listData[current].status);
  };
  useEffect(() => {
    get("/backend/pull-pickup-data")().then((data) => {
      setListData(data);
      setLoaded(true);
    });
  }, []);

  return (
    <>
      <Title level={2}>筛选 Pick Up 数据</Title>
      <Paragraph>在此进行 Pick Up 数据的筛选。</Paragraph>
      <Divider orientation="left">数据筛选</Divider>
      {loaded && (
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
          <Row gutter={18}>
            <Col>
              <iframe
                style={{
                  aspectRatio: "16 /9",
                  height: 200,
                  borderRadius: 4,
                }}
                src={`//player.bilibili.com/player.html?isOutside=true&aid=${listData[current].aid}`}
                frameBorder="no"
                framespacing="0"
                allowFullScreen
              ></iframe>
            </Col>
            <Col>
              <Switch
                checkedChildren="已纳入"
                unCheckedChildren="未纳入"
                checked={checked}
                onChange={changeStatus}
              />
              <Title level={3} style={{ margin: "10px 0" }}>
                {listData[current].picker}
              </Title>
              <Paragraph level={3}>{listData[current].reason}</Paragraph>
            </Col>
          </Row>
        </Card>
      )}
      <Divider orientation="left">程序运行</Divider>
    </>
  );
}

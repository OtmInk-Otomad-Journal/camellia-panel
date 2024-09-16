import { useState } from 'react';
import { Space, Button, message, Select, Divider, Typography, DatePicker, InputNumber, Flex, theme } from "antd";
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

const { Title, Paragraph } = Typography;

const SendButton = (script) => {
    const [buttonState, setButtonState] = useState({
        danger: false,
        text: "开始获取"});

    const toggleDanger = () => {
        setButtonState(prevState => ({
            danger: !prevState.danger,
            text: prevState.danger ? '开始获取' : '停止获取',
        }));
    };

    return (
      <>
        {buttonState.danger && <RunningBox />}
        <Button style={{marginTop: 12}} type="primary" onClick={toggleDanger} danger={buttonState.danger}>
            {buttonState.text}
        </Button>
      </>
    );
  };

const RunningBox = () => {
    const { token: { colorBgLayout, borderRadiusLG } } = theme.useToken();
    return <div style={{
        minHeight: 200,
        width: '100%',
        borderRadius: borderRadiusLG,
        padding: 10,
        background: colorBgLayout
    }}></div>
}

function ComText({children}){
    return <span style={{
        display: "inline-block",
        minWidth: "8em"
    }}>{children}</span>
}

export default function MainPage() {
    const date = new Date();

    return <>
        <Title level={2}>数据获取</Title>
        <Paragraph>获取本次周刊的数据。</Paragraph>
        <Divider orientation="left">参数设置</Divider>
        <Space direction="vertical">
            <Flex vertical={false} align="center">
                <ComText>获取时间范围：</ComText>
                <RangePicker
                    defaultValue={[dayjs(date.setDate(date.getDate() - 13)), dayjs(date.setDate(date.getDate() + 6))]}
                    disabled
                /></Flex>
            <Flex vertical={false} align="center">
                <ComText>拉取分区代码：</ComText>
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    defaultValue={[26, 126, 22]}
                    disabled
                />
            </Flex>
            <Flex vertical={false} align="center">
                <ComText>承认分区代码：</ComText>
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    defaultValue={[26]}
                    disabled
                />
            </Flex>
            <Flex vertical={false} align="center">
                <ComText>承认 TAG：</ComText>
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    defaultValue={['音mad', "ytpmv"]}
                    disabled
                />
            </Flex>
            <Flex vertical={false} align="center">
                <ComText>拉取视频个数：</ComText>
                <InputNumber defaultValue={100} disabled/>
            </Flex>
            <Flex vertical={false} align="center">
                <ComText>主榜个数：</ComText>
                <InputNumber defaultValue={15} disabled/>
            </Flex>
            <Flex vertical={false} align="center">
                <ComText>主榜中断数：</ComText>
                <InputNumber defaultValue={5} disabled/>
            </Flex>
            <Flex vertical={false} align="center">
                <ComText>副榜个数：</ComText>
                <InputNumber defaultValue={40} disabled/>
            </Flex>
            <Flex vertical={false} align="center">
                <ComText>间隔时间：</ComText>
                <InputNumber addonAfter="秒" defaultValue={20} disabled/>
            </Flex>
            <Flex vertical={false} align="center">
                <ComText>主榜最长时间：</ComText>
                <InputNumber addonAfter="秒" defaultValue={70} disabled/>
            </Flex>
        </Space>
        <Space>
        </Space>
        <Divider orientation="left">运行</Divider>
        <SendButton />
    </>
}
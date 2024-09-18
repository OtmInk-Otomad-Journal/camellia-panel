import { useState } from 'react';
import { Space, Button, message, Select, Divider, Typography, DatePicker, InputNumber, Flex, theme } from "antd";
import dayjs from 'dayjs';
import LogBox from '../../components/LogBox';
import get from '../../common/api'
import { address, port } from '../../common/config';

const { RangePicker } = DatePicker;

const { Title, Paragraph } = Typography;

const SendButton = ({ url }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [buttonState, setButtonState] = useState({
        danger: false,
        text: "开始 / 继续获取"});

    const toggleDanger = () => {
        if( buttonState.danger ){
            get(`${address}:${port}/backend/get-data/stop`)()
                .then( _ => { messageApi.success("已终止进程") })
                .catch( _ => {
                    { messageApi.error("终止线程时遇到了异常") }
            })
        }
        setButtonState(prevState => ({
            danger: !prevState.danger,
            text: prevState.danger ? '开始 / 继续获取' : '终止线程',
        }));
    };

    return (
      <>
        {contextHolder}
        {buttonState.danger && <LogBox url={url}/>}
        <Button style={{marginTop: 12}} type="primary" onClick={toggleDanger} danger={buttonState.danger}>
            {buttonState.text}
        </Button>
      </>
    );
  };

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
        <SendButton url={`${address}:${port}/backend/get-data`} />
    </>
}
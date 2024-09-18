import { useState } from 'react';
import { Space, Button, message, Select, Divider, Typography, DatePicker, InputNumber, Flex, theme, Collapse, Input } from "antd";
import get from '../../common/api'
import { address, port } from '../../common/config';

type pullData = {
    "ranking": string,
    "score": string,
    "aid": string,
    "bvid": string,
    "cid": string,
    "title": string,
    "uploader": string,
    "uid": string,
    "copyright": string,
    "play": string,
    "like": string,
    "coin": string,
    "star": string,
    "pubtime": string,
    "adjust_scale": string,
    "prescore": string,
    "part": string,
    "duration": string,
    "start_time": string,
    "full_time": string,
    "web_prefix": string,
    "video_src": string,
    "cover_src": string,
    "avatar_src": string,
    "danmaku_src": string,
    "light_color": string,
    "dark_color": string,
    "score_add": string
}

const { Title, Paragraph } = Typography;

function ComText({children}){
    return <span style={{
        display: "inline-block",
        minWidth: "8em"
    }}>{children}</span>
}

const PanelInside = ({ data }: {data: pullData}) => {
    return <>
    {/* 后续改为 Form */}
        <Space direction="vertical">
            <Flex vertical={false} align="center" gap={10}>
                <Button type="primary" href={'https://bilibili.com/video/av' + data.aid} target="_blank">av{data.aid}</Button>
                <Button type="primary" href={'https://bilibili.com/video/' + data.bvid} target="_blank">{data.bvid}</Button>
            </Flex>
            <Flex vertical={false} align="center">
                <ComText>总分数：</ComText>
                <InputNumber defaultValue={data.score} />
            </Flex>
            <Flex vertical={false} align="center">
                <ComText>额外标签：</ComText>
                <Input defaultValue={data.score_add} />
            </Flex>
        </Space>
    </>
}

const DataBox = () => {
    const [listData, setListData] = useState<[pullData]>([{ranking: "1"}]);

    const itemList = listData.map(item => {
        if(item.ranking <= 55){
        return <Collapse
                    size='large'
                    key={item.ranking}
                    items={[{ key: '1',
                            label: <Flex align='center'>
                                        <span style={
                                            {
                                                display: "inline-block",
                                                fontSize: "1.5em",
                                                fontWeight: "bold",
                                                minWidth: "3em"
                                            }
                                        }>{item.ranking}</span>
                                        {item.title}
                                    </Flex>,
                            children: <PanelInside data={item} />}]}
                    expandIconPosition='end'
                    />
                }
    })

    get(`${address}:${port}/backend/pull-data`)().then((data) => {
        setListData(data);
    })
    return <>
        <Space direction="vertical" style={{width: "100%"}}>
            { itemList }
        </Space>
    </>
}

export default function MainPage() {
    return <>
        <Title level={2}>审核 / 编辑数据</Title>
        <Paragraph>获取数据后，可以在这里审核并编辑数据。</Paragraph>
        <Divider orientation="left">数据列表</Divider>
        <DataBox />
        <Space>
        </Space>
        <Divider orientation="left">数据提交</Divider>
        {/* <SendButton url={`${address}:${port}/backend/get-data`} /> */}
    </>
}
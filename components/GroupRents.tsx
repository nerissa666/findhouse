import { Avatar, List } from "antd";
import React, { useEffect, useState } from "react";
import axios from "@/axios";

interface itemType {
  id: number;
  title: string;
  desc: string;
  imgSrc: string;
}
const fetchData = async (): Promise<itemType[]> =>
  await axios.get("/home/groups", {
    params: {
      area: "AREA|88cff55c-aaa4-e2e0",
    },
  });
const GroupRents = () => {
  const [data, setData] = useState<itemType[]>([]);
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchData();
      setData(data);
    };

    loadData();
    return () => {
      // setData([]);
    };
  }, []);
  return (
    <div className="w-full">
      <h3 className="inline-block font-medium">租房小组</h3>
      <span className="float-right text-sm text-gray-500">更多</span>
      <List
        dataSource={data}
        className="w-[100%]"
        renderItem={(item) => (
          <List.Item className="w-1/2 float-right" key={item.id}>
            <List.Item.Meta
              className="flex-row-reverse"
              title={<a href="https://ant.design">{item.title}</a>}
              description={item.desc}
              avatar={<Avatar className="w-[50%] h-[100%]" src={item.imgSrc} />}
            />
          </List.Item>
        )}
      />
    </div>
  );
};
export default GroupRents;

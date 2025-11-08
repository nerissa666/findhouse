import { List, Avatar } from "antd";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useAppSelector } from "@/lib/hooks";
import { BASE_URL } from "@/lib/consts";
interface itemType {
  id: number;
  title: string;
  desc: string;
  imgSrc: string;
}

const GroupRents = () => {
  const area = useAppSelector((state) => state.city.currentCity.value);
  const [data, setData] = useState<itemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/home/groups", {
        params: {
          area,
        },
      })
      .then((res) => {
        setData(res as unknown as itemType[]);
      })
      .catch((err) => {
        console.warn("GroupRents error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) {
    return (
      <div className="w-full">
        <h3 className="inline-block font-medium text-base">租房小组</h3>
        <span className="float-right text-sm text-gray-500">更多</span>
        <div className="w-full h-32 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center mt-2">
          加载中...
        </div>
      </div>
    );
  }

  if (error) {
    console.warn("GroupRents error:", error);
  }

  return (
    <div className="w-full px-2">
      <h3 className="inline-block font-medium text-base">租房小组</h3>
      <span className="float-right text-sm text-gray-500">更多</span>
      <List
        dataSource={data}
        className="w-full !mt-2"
        grid={{ gutter: 16, column: 2 }}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              className="flex-row-reverse"
              title={<a href="#">{item.title}</a>}
              description={item.desc}
              avatar={
                <Avatar
                  className="w-[50%] h-[100%]"
                  src={BASE_URL + item.imgSrc}
                />
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};
export default GroupRents;

import { Avatar, List } from "antd";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchData();
        setData(data);
      } catch (err) {
        console.error("Failed to load group rents data:", err);
        setError("Failed to load group rents data");
        // 设置默认数据
        setData([
          {
            id: 1,
            title: "租房小组1",
            desc: "这是一个租房小组的描述",
            imgSrc: "/next.svg",
          },
          {
            id: 2,
            title: "租房小组2",
            desc: "这是另一个租房小组的描述",
            imgSrc: "/vercel.svg",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => {
      // setData([]);
    };
  }, []);
  if (loading) {
    return (
      <div className="w-full">
        <h3 className="inline-block font-medium">租房小组</h3>
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

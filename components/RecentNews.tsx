import { List, Image } from "antd";
import { useEffect, useState } from "react";
import axios from "@/axios";
interface itemType {
  id: number;
  title: string;
  from: string;
  date: string;
  imgSrc: string;
}
const fetchData = async (): Promise<itemType[]> =>
  await axios.get("/home/news", {
    params: {
      area: "AREA|88cff55c-aaa4-e2e0",
    },
  });
const RecentNews = () => {
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
    <div className="w-full ">
      <h3 className="font-medium">最新资讯</h3>
      <List
        dataSource={data}
        className="w-full "
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              className="relative"
              title={<a href="https://ant.design">{item.title}</a>}
              description={
                <div className="absolute bottom-0 flex justify-between h-auto w-2/5">
                  <span className="text-sm text-gray-500">{item.from}</span>
                  <span className="">{item.date}</span>
                </div>
              }
              avatar={
                <Image
                  width={200}
                  preview={false}
                  alt="img"
                  src={item.imgSrc}
                />
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};
export default RecentNews;

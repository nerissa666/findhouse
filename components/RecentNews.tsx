import { List, Image } from "antd";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
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
const RecentNews = ({ title = true }: { title?: boolean }) => {
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
        console.error("Failed to load recent news data:", err);
        setError("Failed to load recent news data");
        // 设置默认数据
        setData([
          {
            id: 1,
            title: "最新资讯1",
            from: "来源1",
            date: "2024-01-01",
            imgSrc: "/next.svg",
          },
          {
            id: 2,
            title: "最新资讯2",
            from: "来源2",
            date: "2024-01-02",
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
        <h3 className="font-medium text-base">最新资讯</h3>
        <div className="w-full h-32 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center mt-2">
          加载中...
        </div>
      </div>
    );
  }

  if (error) {
    console.warn("RecentNews error:", error);
  }

  return (
    <div className="w-full">
      {title && <h3 className="font-medium text-base">最新资讯</h3>}
      <List
        dataSource={data}
        className="w-full"
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

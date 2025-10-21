"use client";
import { ErrorBlock } from "antd-mobile";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import HouseList from "@/components/HouseList";
import { House } from "@/app/types";
import axios from "@/lib/axios";
import SearchBar from "@/components/SearchBar";
export default () => {
  const [data, setData] = useState<House[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/user/favorites");
      setData(res as unknown as House[]);
    };
    fetchData();
  }, []);
  const errorBlock = () => (
    <ErrorBlock
      status="empty"
      description={
        <>
          您还没有房源，去
          <span
            className="cursor-pointer text-base"
            style={{ color: "var(--color-theme-green)" }}
            onClick={() => {
              router.push("/rent/publish");
            }}
          >
            发布房源
          </span>
          吧~
        </>
      }
    />
  );
  const router = useRouter();
  return (
    <>
      <SearchBar
        from="/collection"
        absolute={false}
        cpnts={{
          map: false,
          select: false,
          share: false,
          title: "我的收藏",
        }}
      />
      <Suspense fallback={errorBlock()}>
        <HouseList data={data} total={data.length} />
      </Suspense>
    </>
  );
};

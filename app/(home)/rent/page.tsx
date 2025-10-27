"use client";
import { ErrorBlock } from "antd-mobile";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
const SearchBar = dynamic(() => import("@/components/SearchBar"), {
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 animate-pulse rounded"></div>,
});
const HouseList = dynamic(() => import("@/components/HouseList"), {
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 animate-pulse rounded"></div>,
});
import { House } from "@/app/types";
import axios from "@/lib/axios";
export default () => {
  const [data, setData] = useState<House[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/user/houses");
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
          title: "我的房源",
        }}
      />
      <Suspense fallback={errorBlock()}>
        <HouseList data={data} total={data.length} />
      </Suspense>
    </>
  );
};

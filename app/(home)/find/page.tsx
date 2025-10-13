"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "@/lib/axios";
import { HousesBody, House, SelectOption } from "@/app/types";
import HouseList from "@/components/HouseList";
import SearchBar from "@/components/SearchBar";
import { useAppSelector } from "@/lib/hooks";
import { useSearchParams } from "next/navigation";
const PAGE_SIZE = 20;

export default () => {
  const searchParams = useSearchParams();
  const rentType = searchParams.get("rentType") || null;
  const city = useAppSelector((state) => state.city.currentCity);
  const [data, setData] = useState<House[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const totalSetRef = useRef(false);

  const featchMoreData = useCallback(() => {
    setLoading(true);
    fetchData(data.length + 1)
      .then((resp) => {
        setData((prev) => prev.concat(resp?.list));
        // 只有第一次才设置total
        if (!totalSetRef.current) {
          setTotal(resp.count);
          totalSetRef.current = true;
        }
      })
      .finally(() => setLoading(false));
  }, [data.length]);

  const fetchData = async (start = 1): Promise<HousesBody> => {
    const res = await axios.get<HousesBody>("/houses", {
      params: {
        cityId: city.value,
        area: city.value,
        rentType: rentType,
        // price: "",
        // more: "CHAR|76eb0532-8099-d1f4,FLOOR|1,AREA|88cff55c-aaa4-e2e0,ORIEN|61e99445-e95e-7f37,true",
        // roomType: "ROOM|d1a00384-5801-d5cd",
        // oriented: "ORIEN|61e99445-e95e-7f37",
        // characteristic: "CHAR|76eb0532-8099-d1f4",
        // floor: "FLOOR|1",
        start,
        end: start + PAGE_SIZE,
      },
    });
    console.log(res, "res");
    return res as unknown as HousesBody;
  };

  useEffect(() => {
    featchMoreData();
  }, [rentType]);

  return (
    <>
      <SearchBar
        from="/find"
        absolute={false}
        cpnts={{ share: false, title: false }}
      />
      <HouseList
        data={data}
        loading={loading}
        onLoadMore={featchMoreData}
        total={total}
      />
    </>
  );
};

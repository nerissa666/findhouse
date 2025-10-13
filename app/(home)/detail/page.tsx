"use client";
import { useEffect, useState } from "react";
import { Button, Swiper, Tag, Toast } from "antd-mobile";
import { useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import styles from "./index.module.scss";
import { RECOMMEND_HOUSES } from "@/lib/consts";

import { BASE_URL, HOUSE_PACKAGE } from "@/lib/consts";
import { getTagColor } from "@/lib/utils";
import HouseList from "@/components/HouseList";
import { House, HouseInfo } from "@/app/types";
import SearchBar from "@/components/SearchBar";
export default () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const [data, setData] = useState<HouseInfo>();
  const [recommendHouses, setRecommendHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //房源详情
    const fetchData = async (): Promise<void> => {
      try {
        const res = await axios.get(`/houses/${code}`);
        setData(res as unknown as HouseInfo);
      } catch (error) {
        console.log("请求出错", error);
      }
    };
    fetchData();
  }, [code]);

  useEffect(() => {
    //猜你喜欢
    setRecommendHouses(RECOMMEND_HOUSES);
  }, []);

  const items =
    data?.houseImg?.map((color, index) => (
      <Swiper.Item key={index}>
        <div
          className={styles.content}
          style={{ backgroundImage: `url(${BASE_URL}${color})` }}
          onClick={() => {
            Toast.show(`你点击了卡片 ${index + 1}`);
          }}
        />
      </Swiper.Item>
    )) ?? [];
  return (
    <>
      <div className="relative">
        <SearchBar
          from="/detail"
          absolute={false}
          cpnts={{
            map: false,
            select: false,
            title: data?.community,
          }}
        />
        <Swiper
          loop
          autoplay
          //   onIndexChange={(i) => {
          //     console.log(i, "onIndexChange1");
          //   }}
        >
          {items}
        </Swiper>
      </div>
      <div className="py-[15px]">
        <h3 className="text-base text-[#333]  font-normal">{data?.title}</h3>
        <div className="my-1">
          {data?.tags.map((tag) => (
            <Tag className="mr-3" color={getTagColor(tag)} key={tag}>
              {tag}
            </Tag>
          ))}
        </div>
        <div
          className={`${"flex justify-between border-y border-[#cecece] my-[15px] py-[15px]"} ${
            styles.baseInfo
          }`}
        >
          <div>
            <div>
              <span>{data?.price}</span>/月
            </div>
            <div>租金</div>
          </div>
          <div>
            <div>
              <span>{data?.roomType}</span>
            </div>
            <div>房型</div>
          </div>
          <div>
            <div>
              <span>{data?.size}</span>平米
            </div>
            <div>面积</div>
          </div>
        </div>
        <div className={styles.wholeInfo}>
          <div>
            <span>装修：</span>
            <span>精装修</span>
          </div>
          <div>
            <span>朝向：</span>
            <span>{data?.oriented.join("、")}</span>
          </div>
          <div>
            <span>楼层：</span>
            <span>{data?.floor}</span>
          </div>
          <div>
            <span>类型：</span>
            <span>普通住宅</span>
          </div>
        </div>
      </div>
      <div className="bg-[#f6f5f6] pt-[10px] ">
        <div className="bg-[#fff] leading-[44px] text-sm text-[#333] text-base">
          <span className="text-[#666]">小区：</span>
          <span className="font-bold">{data?.community}</span>
        </div>
        <div className="w-[375px] h-[145px] "></div>
      </div>

      <div className={styles.houseFurniture}>
        <div className="py-[15px] text-[15px] font-bold mb-[10px] border-b border-[#cecece]">
          房屋配套
        </div>
        <ul className="flex flex-wrap">
          {data?.supporting.map((item) => (
            <li
              key={item}
              className="flex flex-col items-center w-[20%] leading-[23px] my-[10px]"
            >
              <i
                className={`iconfont ${HOUSE_PACKAGE[item]} !text-[23px] `}
              ></i>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-[#f6f5f6] pt-[10px] ">
        <div className={`${styles.houseFurniture} bg-[#fff]`}>
          <div className="py-[15px] text-[15px] font-bold mb-[10px] border-b border-[#cecece]">
            房源概况
          </div>
          <div className="">
            <div className="flex justify-between mb-[10px] items-center">
              <img
                src={BASE_URL + "/img/avatar.png"}
                alt="头像"
                width="52px"
                height="52px"
                className="mr-[10px] mt-[10px]"
              />
              <div className="flex-1">
                <div>王女士</div>
                <div
                  className="text-xs"
                  style={{ color: "var(--color-money-red)" }}
                >
                  <i className="iconfont icon-auth"></i>已认证房主
                </div>
              </div>
              <Button
                color="primary"
                fill="outline"
                size="mini"
                className="!text-[#33be85] !border-[#33be85]"
              >
                发消息
              </Button>
            </div>
            <article className="first-line:indent-[2px]">
              {data?.description}
            </article>
          </div>
        </div>
      </div>
      <div className="bg-[#f6f5f6] pt-[10px] ">
        <div className={`${styles.houseFurniture} bg-[#fff]`}>
          <div className="py-[15px] text-[15px] font-bold mb-[10px] border-b border-[#cecece]">
            猜你喜欢
          </div>
          <HouseList data={recommendHouses} loading={loading} />
        </div>
      </div>
    </>
  );
};

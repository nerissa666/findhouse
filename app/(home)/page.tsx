"use client";
import React, { useRef } from "react";
import SearchBar from "@/components/SearchBar";
import { Menu } from "./menu";
import { ListItem } from "@/app/types";
import Carousels from "@/components/Carousel";
import GroupRents from "@/components/GroupRents";
import RecentNews from "@/components/RecentNews";
import {
  HomeOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  BankOutlined,
} from "@ant-design/icons";
export default function Home() {
  const listRef = useRef<ListItem[]>([
    {
      href: "/find?rentType=true",
      label: "整租",
      icon: <HomeOutlined />,
    },
    {
      href: "/find?rentType=false",
      label: "合租",
      icon: <TeamOutlined />,
    },
    {
      href: "/amap",
      label: "地图找房",
      icon: <EnvironmentOutlined />,
    },
    {
      href: "/rent/publish",
      label: "去出租",
      icon: <BankOutlined />,
    },
  ]);

  return (
    <div className="">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start relative">
        <SearchBar from="/" />
        <Carousels />
        <Menu
          props={{
            list: listRef.current,
            style: "flex flex-row text-center gap-6 px-2",
          }}
          selected
        />
        <GroupRents />
        <RecentNews title={true} />
      </main>
    </div>
  );
}

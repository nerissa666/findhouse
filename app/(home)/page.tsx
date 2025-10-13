"use client";
// import Image from "next/image";
import React, { useRef } from "react";
import dynamic from "next/dynamic";
import SearchBar from "@/components/SearchBar";
import { Menu } from "./menu";
import Carousels from "@/components/Carousel";
import { ListItem } from "@/app/types";
const GroupRents = dynamic(() => import("@/components/GroupRents"), {
  ssr: false,
});
const RecentNews = dynamic(() => import("@/components/RecentNews"), {
  ssr: false,
});
import {
  HomeOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  BankOutlined,
} from "@ant-design/icons";
// import '@ant-design/v5-patch-for-react-19';

export default function Home() {
  const listRef = useRef<ListItem[]>([
    { href: "/find?rentType=true", label: "整租", icon: <HomeOutlined /> },
    { href: "/find?rentType=false", label: "合租", icon: <TeamOutlined /> },
    {
      href: "/map",
      label: "地图找房",
      icon: <EnvironmentOutlined />,
    },
    { href: "/rent", label: "去出租", icon: <BankOutlined /> },
  ]);

  return (
    <div className="">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start relative ">
        <SearchBar from="/" />
        <Carousels />
        <Menu
          props={{
            list: listRef.current,
            style: "flex flex-row text-center gap-6 px-2",
          }}
        />
        <GroupRents />
        <RecentNews title={true} />
      </main>
    </div>
  );
}

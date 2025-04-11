"use client";
// import Image from "next/image";
import React, { useState } from "react";
import dynamic from "next/dynamic";

import { Button, Avatar, List, Radio, Space, Image } from "antd";
import { Menu } from "./menu";
import Carousels from "@/components/Carousel";

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
  return (
    <div className="">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
        <Carousels />
        <Menu
          props={{
            list: [
              { href: "/find", label: "整租", icon: <HomeOutlined /> },
              { href: "/find", label: "合租", icon: <TeamOutlined /> },
              {
                href: "/map",
                label: "地图找房",
                icon: <EnvironmentOutlined />,
              },
              { href: "/rent", label: "去出租", icon: <BankOutlined /> },
            ],
            style: "flex flex-row text-center gap-6",
          }}
        />
        <GroupRents />
        <RecentNews />
      </main>
    </div>
  );
}

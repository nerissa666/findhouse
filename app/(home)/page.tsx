"use client";
// import Image from "next/image";
import React, { useState } from "react";
import { Button, Carousel, Avatar, List, Radio, Space, Image } from "antd";
import { Menu } from "./menu";
import {
  HomeOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  BankOutlined,
} from "@ant-design/icons";
// import '@ant-design/v5-patch-for-react-19';
const data = [
  {
    title: "家住回龙观",
  },
  {
    title: "家住回龙观",
  },
  {
    title: "家住回龙观",
  },
  {
    title: "家住回龙观",
  },
];
export default function Home() {
  return (
    <div className="">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
        <div className="h-40 w-[100%] bg-red-500">
          <h3>1</h3>
        </div>
        {/* <Carousel autoplay>
          <div  className="h-[100px] w-[100px] bg-red-500">
            <h3>1</h3>
          </div>
          <div className="h-[100px] w-[100px] bg-red-500">
            <h3 >1</h3>
          </div>
          <div className="h-[100px] w-[100px] bg-red-500">
            <h3>1</h3>
          </div>
          <div className="h-[100px] w-[100px] bg-red-500">
            <h3>1</h3>
          </div>
        </Carousel> */}
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
        <div className="w-full">
          <h3 className="inline-block font-medium">租房小组</h3>
          <span className="float-right text-sm text-gray-500">更多</span>
          <List
            dataSource={data}
            className="w-[100%]"
            renderItem={(item, index) => (
              <List.Item className="w-1/2 float-right">
                <List.Item.Meta
                  className="flex-row-reverse"
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="归属的感觉"
                  avatar={
                    <Avatar
                      className="w-[50%] h-[100%]"
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                    />
                  }
                />
              </List.Item>
            )}
          />
        </div>
        <div className="w-full ">
          <h3 className="font-medium">最新资讯</h3>
          <List
            dataSource={data}
            className="w-full "
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  className="relative"
                  title={<a href="https://ant.design">{item.title}</a>}
                  description={
                    <div className="absolute bottom-0 flex justify-between h-auto">
                      <span className="text-sm text-gray-500">新华网</span>
                      <span className="">两天前</span>
                    </div>
                  }
                  avatar={
                    <Image
                      width={200}
                      preview={false}
                      alt="img"
                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    />
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </main>
    </div>
  );
}

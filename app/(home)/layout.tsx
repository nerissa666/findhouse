"use client";
import { Menu } from "./menu";

import { useRef } from "react";
// 使用 iconfont 图标
import { ListItem } from "../types";
import { useSelectedPage } from "./use-selected-page";
import {
  HomeOutlined,
  SearchOutlined,
  ContainerOutlined,
  UserOutlined,
} from "@ant-design/icons";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const listRef = useRef<ListItem[]>([
    {
      href: "/",
      label: "首页",
      alias: "home",
      icon: <HomeOutlined />,
    },
    {
      href: "/find",
      label: "找房",
      icon: <SearchOutlined />,
    },
    {
      href: "/news",
      label: "资讯",
      icon: <ContainerOutlined />,
    },
    { href: "/my", label: "我的", icon: <UserOutlined /> },
  ]);
  const selectedPage = useSelectedPage();
  return (
    <>
      <div className="h-[calc(100vh-50px)] overflow-y-auto scrollbar-hide">
        {children}
      </div>
      {(selectedPage === "首页" ||
        selectedPage === "find" ||
        selectedPage === "news" ||
        selectedPage === "my") && (
        <div className="fixed bottom-[-8px] left-0 right-0 z-50">
          <Menu
            props={{
              list: listRef.current,
              style: "text-center bg-white border-t border-black/5",
            }}
          />
        </div>
      )}
    </>
  );
}

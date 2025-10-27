"use client";
import dynamic from "next/dynamic";

// 优化的 Dynamic Import
const Menu = dynamic(() => import("../menu").then((mod) => mod.Menu), {
  loading: () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#21b97a]"></div>
    </div>
  ),
  ssr: false, // Menu 组件不需要服务端渲染
});
import { useRef, useState, useEffect } from "react";
import { ListItem } from "@/app/types";
import Image from "next/image";
import { Button } from "antd-mobile";
import { useAppSelector } from "@/lib/hooks";
import { BASE_URL } from "@/lib/consts";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/stores/slices/authSlice";
import axios from "@/lib/axios";

export default function My() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const listRef = useRef<ListItem[]>([
    { href: "/collection", label: "我的收藏", icon: "icon-coll" },
    { href: "/rent", label: "我的出租", icon: "icon-ind" },
    { href: "#", label: "看房记录", icon: "icon-record" },
    { href: "#", label: "成为房主", icon: "icon-identity" },
    { href: "/my/user", label: "个人资料", icon: "icon-myinfo" },
    { href: "#", label: "联系我们", icon: "icon-cust" },
  ]);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    axios.post("/user/logout").then(() => {
      dispatch(logout());
    });
  };

  return (
    <div>
      <div className="relative min-h-[300px] mb-4">
        <Image
          src={BASE_URL + "/img/profile/bg.png"}
          alt="avatar"
          width={400}
          height={100}
          className="w-full h-auto"
        />
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[85%] h-[55%] bg-white p-4 pt-7"
          style={{ boxShadow: "0px 0px 10px 3px #ddd" }}
        >
          <div className="relative">
            <div className="absolute w-[70px] h-[70px] left-1/2 -translate-x-1/2 -top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full overflow-hidden shadow bg-white">
              <Image
                src={
                  user?.avatar
                    ? BASE_URL + user.avatar
                    : BASE_URL + "/img/profile/avatar.png"
                }
                alt="avatar"
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
            </div>
            <div className="pt-3 text-center">
              {isClient ? user?.username || "游客" : "游客"}
            </div>
            <div className="pt-2 text-center">
              {isClient && user?.username && (
                <Button
                  size="small"
                  color="primary"
                  style={{
                    backgroundColor: "var(--color-theme-green)",
                    borderColor: "var(--color-theme-green)",
                  }}
                  onClick={handleLogout}
                >
                  退 出
                </Button>
              )}
            </div>
            <div className="pt-2 text-center">
              {!isClient || !user?.username ? (
                <Button
                  size="small"
                  color="primary"
                  style={{
                    backgroundColor: "var(--color-theme-green)",
                    borderColor: "var(--color-theme-green)",
                  }}
                  onClick={() => router.push("/my/login")}
                >
                  去登录
                </Button>
              ) : (
                <span onClick={() => router.push("/my/user")}>
                  编辑个人资料
                  <i className="iconfont icon-arrow text-[#7f7f80] !text-xs" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <Menu
        props={{
          list: listRef.current,
          style: "flex flex-row text-center gap-12 p-8",
        }}
        icon
      />
      <Image
        src={BASE_URL + "/img/profile/join.png"}
        alt="avatar"
        width={400}
        height={100}
        className="w-full h-auto mt-4 px-4"
      />
    </div>
  );
}

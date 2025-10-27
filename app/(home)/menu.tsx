"use client";
import Link from "next/link";
import { createContext, useContext } from "react";
import { useSelectedPage } from "./use-selected-page";
import { RouteItem, ListItem } from "@/app/types";
// 创建 Context
const SelectedContext = createContext<{
  selected: boolean | string | undefined;
  icon: boolean | string | undefined;
}>({ selected: undefined, icon: undefined });

// 自定义 Hook 来使用 Context
const useSelected = () => useContext(SelectedContext);

const HeroLink = ({ link }: { link: ListItem }) => {
  const selectedPage = useSelectedPage();
  const { selected, icon } = useSelected(); // 从 Context 获取 selected
  return (
    <Link
      href={link.href}
      className={`inline-block relative overflow-hidden group py-2 tracking-tight text-xm ${
        !icon ? "w-1/5" : "w-full"
      }`}
    >
      <span
        className={`relative z-10 transition-colors duration-200 group-hover:text-white dark:group-hover:text-black  ${
          link.href.includes(selectedPage) ? "text-[#21b97a]" : "text-black"
        }`}
      >
        {!icon ? (
          <span
            className={`text-lg ${
              selected || link.href.includes(selectedPage)
                ? "text-[#21b97a]"
                : "text-black"
            }`}
          >
            {link.icon}
          </span>
        ) : (
          <i className={`!text-xl iconfont ${link.icon}`} />
        )}
        <br />
        <span className="text-sm">{link.label}</span>
      </span>
      <span className="absolute inset-0 w-0 bg-black dark:bg-white transition-all duration-200 ease-out group-hover:w-full" />
    </Link>
  );
};

export const Menu = ({
  props: { list, style },
  selected,
  icon,
}: {
  props: RouteItem;
  selected?: boolean | string;
  icon?: boolean | string;
  type?: boolean | string;
}) => {
  return (
    <SelectedContext.Provider value={{ selected, icon }}>
      <div className={`${style} w-full ${icon ? "grid grid-cols-3" : ""}`}>
        {list.map((link, index) => (
          <HeroLink key={index} link={link} />
        ))}
      </div>
    </SelectedContext.Provider>
  );
};

"use client";
import Link from "next/link";
import { useSelectedPage } from "./use-selected-page";

const HeroLink = ({ link }: { link: { href: string; label: string } }) => {
  const selectedPage = useSelectedPage();
  //   if (selectedPage === link.label) {
  //     return null;
  //   }

  return (
    <Link
      href={link.href}
      className="inline-block relative overflow-hidden group py-1 uppercase font-bold tracking-tight w-1/5"
    >
      <span
        className={`relative z-10 transition-colors duration-200 group-hover:text-white dark:group-hover:text-black ${
          selectedPage === link.label ? "text-blue-300" : "text-black"
        }`}
      >
        {link.icon}<br/>{link.label}
      </span>
      <span className="absolute inset-0 w-0 bg-black dark:bg-white transition-all duration-200 ease-out group-hover:w-full" />
    </Link>
  );
};
export const Menu = ({ props: { list, style } }: { props: React.ReactNode }) => {
  return (
    <div className={` 
    ${style} w-[100%]
    `}>
      {
    //   [
    //     { href: "/", label: "首页" },
    //     { href: "/find", label: "找房" },
    //     { href: "/news", label: "资讯" },
    //     { href: "/my", label: "我的" },
    //   ]
    list
      .map((link: { href: string; label: string, icon: React.ReactNode }, index: number) => (
        <HeroLink key={index} link={link} />
      ))}
    </div>
  );
};

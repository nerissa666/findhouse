"use client";
import Link from "next/link";
import { useSelectedPage } from "./use-selected-page";
import { RouteItem, ListItem } from "@/app/types";
import { useRouter } from "next/navigation";

const HeroLink = ({ link }: { link: ListItem }) => {
  const selectedPage = useSelectedPage();
  console.log(selectedPage, "selectedPage");
  const router = useRouter();
  return (
    <Link
      href={link.href}
      // onClick={() => {
      //   router.push(link.href);
      // }}
      className="inline-block relative overflow-hidden group py-2 tracking-tight text-xm w-1/5"
    >
      <span
        className={`relative z-10 transition-colors duration-200 group-hover:text-white dark:group-hover:text-black  ${
          selectedPage === link.label ? "text-[#21b97a]" : "text-black"
        }`}
      >
        <span className="text-lg">{link.icon}</span>
        <br />
        <span className="text-sm">{link.label}</span>
      </span>
      <span className="absolute inset-0 w-0 bg-black dark:bg-white transition-all duration-200 ease-out group-hover:w-full" />
    </Link>
  );
};
export const Menu = ({ props: { list, style } }: { props: RouteItem }) => {
  return (
    <div
      className={` 
    ${style} w-[100%]
    `}
    >
      {list.map((link, index) => (
        <HeroLink key={index} link={link} />
      ))}
    </div>
  );
};

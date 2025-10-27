"use client";
import dynamic from "next/dynamic";
import SearchBar from "@/components/SearchBar";
const RecentNews = dynamic(() => import("@/components/RecentNews"), {
  ssr: false,
});
export default function News() {
  return (
    <>
      <SearchBar
        from="/news"
        absolute={false}
        cpnts={{ select: false, map: false, share: false, title: "最新咨询" }}
      />
      <RecentNews title={false} />
    </>
  );
}

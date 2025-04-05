"use client";

import { useSelectedLayoutSegment } from "next/navigation";

export const useSelectedPage = () => {
  let segment = useSelectedLayoutSegment();
  
  if (segment === null) {
    segment = "首页";
  }
  return segment;
};

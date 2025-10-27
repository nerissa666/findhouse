// src/lib/utils.ts
import clsx from "clsx";
import { TAG_COLORS } from "../../findhouse/lib/consts";
import { RefObject } from "react";
import { SelectOption } from "@/app/types";
export function cn(...classNames: string[]) {
  return clsx(...classNames);
}

export function getTagColor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  }
  return TAG_COLORS[hash % TAG_COLORS.length];
}
// 处理点击事件 单击和双击
export function handleClick(
  option: SelectOption,
  onClick: (option: SelectOption) => void,
  onDoubleClick: (option: SelectOption) => void,
  {
    clickTimeoutRef,
    lastClickElementRef,
  }: {
    clickTimeoutRef: RefObject<NodeJS.Timeout | null>;
    lastClickElementRef: RefObject<string | null>;
  }
) {
  const { value } = option;
  if (clickTimeoutRef.current && lastClickElementRef.current === value) {
    clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = null;
    lastClickElementRef.current = null;
    onDoubleClick(option);
    return;
  }
  if (clickTimeoutRef.current) {
    clearTimeout(clickTimeoutRef.current);
  }
  lastClickElementRef.current = value;
  clickTimeoutRef.current = setTimeout(() => {
    onClick(option);
    clickTimeoutRef.current = null;
    lastClickElementRef.current = null;
  }, 300);
}

// 防抖处理
export function handleSearch({
  debounceTimer,
  onSearch,
}: {
  debounceTimer: RefObject<NodeJS.Timeout | null>;
  onSearch: () => void;
}): void {
  // 清除之前的定时器
  if (debounceTimer.current) {
    clearTimeout(debounceTimer.current);
  }

  // 设置新的定时器，500ms后执行搜索
  debounceTimer.current = setTimeout(() => {
    onSearch();
  }, 500);
}

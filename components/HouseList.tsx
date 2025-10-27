"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { List, Image, Tag } from "antd-mobile";
import { List as VirtualizedList, AutoSizer } from "react-virtualized";
import type { ListRowProps } from "react-virtualized";
import { getTagColor } from "@/lib/utils";
import { BASE_URL } from "@/lib/consts";
import { HouseListProps } from "@/app/types";
import styles from "./index.module.scss";
const ROW_HEIGHT = 110;
export default ({
  data,
  loading = false,
  onLoadMore,
  total,
}: HouseListProps) => {
  const router = useRouter();
  const [containerHeight, setContainerHeight] = useState(600);

  useEffect(() => {
    const calculateHeight = () => {
      const vh = window.innerHeight || 600; // 提供默认值
      const dataLength = data?.length || 0; // 确保 data.length 有值
      const height = vh - 100; // 100vh - 100px
      const calculatedHeight = Math.min(ROW_HEIGHT * dataLength, height);

      // 确保计算出的高度是有效数字
      const validHeight = isNaN(calculatedHeight) ? 600 : calculatedHeight;

      setContainerHeight(validHeight);
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);

    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, [data.length]);

  const handleRowsRendered = useCallback(
    ({ stopIndex }: { stopIndex: number }) => {
      if (loading) return;
      if (total > 0 && data.length >= total) return;
      if (stopIndex >= data.length - 2 && onLoadMore) {
        onLoadMore();
      }
    },
    [loading, data.length, onLoadMore, total]
  );
  function rowRenderer({ index, key, style }: ListRowProps) {
    const item = data[index];
    return (
      <List.Item
        key={key}
        style={{
          ...style,
          // 如果是第一个元素，移除上边框
          ...(index === 0 && { borderTop: "none" }),
        }}
        prefix={
          <Image
            src={`${BASE_URL}${item.houseImg}`}
            fit="cover"
            alt=""
            width={106}
            height={80}
          />
        }
        onClick={() => router.push(`/detail?code=${item.houseCode}`)}
      >
        <h3
          className="overflow-hidden whitespace-nowrap text-ellipsis"
          style={{ fontSize: "15px", color: "var(--adm-color-text)" }}
        >
          {item.title}
        </h3>
        <div
          className="text-sm"
          style={{
            color: "var(--adm-color-weak)",
            fontSize: "var(--adm-font-size-main)",
          }}
        >
          {item.desc}
        </div>
        {item.tags?.map((tag) => (
          <Tag className="mr-1" color={getTagColor(tag)} key={tag}>
            {tag}
          </Tag>
        ))}
        <div className="text-money-red text-xs">
          <span className="text-base font-medium">{item.price}</span>元/月
        </div>
        {/* Í› */}
      </List.Item>
    );
  }
  return (
    <List>
      <AutoSizer disableHeight>
        {({ width, height }: { width: number; height: number }) => (
          <VirtualizedList
            rowCount={data?.length || 0}
            rowRenderer={rowRenderer}
            width={width}
            // height={110 * data.length}
            height={containerHeight || 600}
            rowHeight={ROW_HEIGHT}
            overscanRowCount={10}
            onRowsRendered={({ stopIndex }) => {
              handleRowsRendered({ stopIndex });
            }}
            className={styles.virtualizedList}
          />
        )}
      </AutoSizer>
    </List>
  );
};

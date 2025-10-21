"use client";
import { Select } from "antd";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./index.module.scss";
import axios from "@/lib/axios";
import { CommunityItem } from "@/app/types";
import { handleSearch } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setFrom } from "@/lib/stores/slices/fromSlice";
export default ({
  from = "/",
  absolute = true,
  cpnts: { back = true, map = true, select = true, share = true, title } = {
    back: false,
    share: false,
    title: false,
  }, // 聪明
}: {
  from?: string;
  absolute?: boolean;
  cpnts?: {
    back?: boolean;
    map?: boolean;
    select?: boolean;
    share?: boolean;
    title?: string | boolean;
  };
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [location, setLocation] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  // 直接从Redux store获取city，这样会自动响应store的变化
  const city = useAppSelector((state) => state.city.currentCity);
  const cityValue = city.value;
  const cityLabel = city.label;

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const onChange = (value: string) => {
    setLocation(value);
  };
  const onSelect = () => {
    router.push(`/map`);
  };

  //
  const onSearch = (value: string): void => {
    if (!value.trim()) {
      setOptions([]);
      return;
    }

    // 检查 cityValue 是否有效
    if (!cityValue) {
      console.warn("City value is empty, skipping API call");
      setOptions([]);
      return;
    }

    axios
      .get("/area/community", {
        params: {
          name: value,
          id: cityValue,
        },
      })
      .then((res) => {
        console.log(res, "res");

        setOptions(
          (res as unknown as CommunityItem[]).map((item: CommunityItem) => ({
            value: item.community,
            label: item.communityName,
          }))
        );
        console.log(options, "options");
      })
      .catch(() => {
        setOptions([]);
      });
  };

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div
      className={
        styles.mySearchBar +
        " flex gap-2 items-center justify-between px-2 w-full " +
        (absolute ? "absolute top-7 z-10" : "bg-[var(--color-bg-base)] py-2")
      }
    >
      {back && (
        <i
          className={`iconfont icon-back text-[#999] !text-base ${styles.adaptiveIcon} `}
          onClick={() => router.back()}
        />
      )}

      <div
        className={`flex-1 flex gap-2 items-center justify-between mx-2 pl-2
            rounded-[5px] border border-[1px] border-transparent ${
              !title ? "bg-white" : ""
            } ${isActive ? styles.activeMySearchBar : ""}`}
      >
        {title && (
          <div className="flex flex-col items-center flex-1 h-full text-base">
            {title}
          </div>
        )}
        {select && (
          <>
            <div
              className="flex items-center gap-1"
              onClick={() => {
                dispatch(setFrom(from));
                router.push("/citylist");
              }}
            >
              <span className="text-sm">{cityLabel}</span>
              <i className="iconfont icon-arrow text-[#7f7f80] !text-xs" />
            </div>
            <div className="flex-1">
              <Select
                showSearch
                value={location || undefined}
                placeholder="请输入小区或地址"
                allowClear
                filterOption={false}
                onSearch={(value) =>
                  handleSearch({
                    debounceTimer,
                    onSearch: () => onSearch(value),
                  })
                }
                onChange={onChange}
                onSelect={onSelect}
                onFocus={() => {
                  setIsActive(true);
                }}
                onBlur={() => {
                  setIsActive(false);
                }}
                notFoundContent={null}
                options={options}
                // mode="tags"
              />
            </div>
          </>
        )}
      </div>

      {map && (
        <i
          className={`iconfont icon-map !text-2xl ${styles.adaptiveIcon} ${
            !absolute
              ? "!text-[var(--color-icon-green)]"
              : " text-[var(--adm-color-text)]"
          }  cursor-pointer`}
          onClick={() => {
            router.push(`/map?value=${cityValue}`);
          }}
        ></i>
      )}
      {share && (
        <i
          className={`iconfont icon-share text-[var(--adm-color-text)] ${styles.adaptiveIcon} !text-lg  cursor-pointer`}
          onClick={() => {
            // router.push(`/share?value=${cityValue}`);
          }}
        />
      )}
    </div>
  );
};

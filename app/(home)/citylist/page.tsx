"use client";
import { Input, List } from "antd";
import styles from "./index.module.scss";
import axios from "@/lib/axios";
import { CityItem } from "@/app/types";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SelectOption, CityListGrouped } from "@/app/types";
import { handleClick, handleSearch } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setCurrentCity } from "@/lib/stores/slices/citySlice";
import SearchBar from "@/components/SearchBar";
export default () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const currentCity = useAppSelector((state) => state.city.currentCity);
  const from = useAppSelector((state) => state.from.from);
  const [cityList, setCityList] = useState<CityListGrouped>({});
  const [searchCityName, setSearchCityName] = useState<string>("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [clear, setClear] = useState<boolean>(false);
  const [index, setIndex] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<string>("");
  const listRef = useRef<HTMLDivElement>(null);

  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastClickElementRef = useRef<string | null>(null);
  const onClick = ({ value, key }: SelectOption & { key: string }) => {
    axios
      .get("/area", { params: { id: value } })
      .then((res) => {
        setCityList((prevList) => {
          const newList = { ...prevList };
          // 遍历所有字母分组
          newList[key] = newList[key].map((item) => {
            return item.value === value
              ? { ...item, children: res as unknown as CityItem[] }
              : item;
          });
          return newList;
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const onDoubleClick = (selectedCity: SelectOption) => {
    // 更新 Redux 中的城市状态
    dispatch(setCurrentCity(selectedCity));
    router.push(from);
  };

  // 点击索引滚动到对应分组
  const scrollToSection = (indexKey: string) => {
    if (!listRef.current) return;

    let targetSection = indexKey;

    // 处理特殊索引映射
    if (indexKey === "hot") {
      targetSection = "热门城市";
    } else if (indexKey === "#") {
      targetSection = "当前城市";
    }

    const sectionElement = listRef.current.querySelector(
      `[data-section="${targetSection}"]`
    );
    if (sectionElement) {
      sectionElement.scrollIntoView({
        // behavior: "smooth",
        block: "center",
        // inline: "nearest",
      });

      setActiveIndex(targetSection);
    }
  };

  // 滚动监听，更新当前激活的索引
  const handleScroll = () => {
    if (!listRef.current) return;

    const sections = listRef.current.querySelectorAll("[data-section]");
    const scrollTop = listRef.current.scrollTop; // 滚动条距离父元素的偏移量
    let currentSection = "";

    sections.forEach((section) => {
      const element = section as HTMLElement;
      const offsetTop = element.offsetTop; //渲染后当前元素 距离父元素的偏移量
      // 25是一个阈值（像素），用来提前判断滚动到哪个区段。这样当前区段在视口的顶部或靠近顶部时即被激活，可以提升索引栏定位的感知体验。
      if (scrollTop >= offsetTop - 25) {
        currentSection = element.getAttribute("data-section") || "";
      }
    });

    if (currentSection && currentSection !== activeIndex) {
      setActiveIndex(currentSection);
    }
  };
  const onSearch = () => {
    if (searchCityName) {
      axios
        .get<CityItem>("/area/info", {
          params: {
            name: searchCityName,
          },
        })
        .then((res) => {
          const { temp, index } = sortByShort([res as unknown as CityItem]);
          setCityList(temp);
          setIndex(index);
        })
        .catch(() => {
          setCityList({});
        });
    }
  };
  const sortByShort = (cityRes: CityItem[]) => {
    // 按 short 的首字母排序并分组
    const hash: { [key: string]: CityItem[] } = {};
    const index: string[] = [];
    (cityRes as unknown as CityItem[]).forEach((item: CityItem) => {
      if (item.short) {
        const firstLetter = item.short[0].toUpperCase();
        if (!hash[firstLetter]) {
          hash[firstLetter] = [];
        }
        !index.includes(firstLetter) && index.push(firstLetter);
        hash[firstLetter].push(item);
      }
    });
    index.sort().unshift("#", "hot");
    const temp: CityListGrouped = Object.keys(hash)
      .sort()
      .reduce((acc, key) => {
        acc[key] = hash[key];
        return acc;
      }, {} as CityListGrouped);
    return { temp, index };
  };
  useEffect(() => {
    const city = searchParams.get("city");
    if (city) {
      try {
        const cityData = JSON.parse(city) as SelectOption;
        dispatch(setCurrentCity(cityData));
      } catch (e) {
        console.error("Failed to parse city parameter:", e);
      }
    }
  }, [searchParams, dispatch]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 先获取城市列表
        const cityRes = await axios.get("/area/city", { params: { level: 1 } });

        const { temp: tempHash, index } = sortByShort(
          cityRes as unknown as CityItem[]
        );

        // 再获取热门城市
        const hotRes = await axios.get("/area/hot");

        // 创建最终的数据结构
        const temp: CityListGrouped = {
          // 当前定位: [],
          当前城市: [currentCity as CityItem],
          热门城市: hotRes as unknown as CityItem[],
          ...tempHash,
        };

        setCityList(temp);
        setIndex(index);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [clear, currentCity]);
  useEffect(() => {
    handleSearch({
      debounceTimer,
      onSearch,
    });
  }, [searchCityName]);
  return (
    <div className={`${styles.citylist} flex flex-col gap-4 relative`}>
      <div className="bg-[var(--color-bg-base)]">
        <SearchBar
          from="/citylist"
          absolute={false}
          cpnts={{ map: false, select: false, share: false, title: "城市选择" }}
        />
        <div className="mx-2 my-3">
          <Input
            placeholder="请输入城市名称"
            allowClear
            prefix={
              <i className="iconfont icon-seach text-[var(--color-gap-gray)]"></i>
            }
            value={searchCityName}
            onChange={(e) => {
              setSearchCityName(e.target.value.trim());
            }}
            onClear={() => {
              setClear(!clear);
            }}
          />
        </div>
      </div>
      <div
        ref={listRef}
        className="h-[calc(100vh-200px)] overflow-y-auto"
        onScroll={handleScroll}
      >
        <List>
          {Object.keys(cityList).map((key) => (
            <div key={key} className="flex flex-col" data-section={key}>
              <div
                className="cursor-pointer select-none hover:bg-gray-100 px-6 border-b border-[var(--color-gap-gray)]"
                style={{ userSelect: "none" }}
              >
                {key}
              </div>
              {cityList[key]?.map(
                ({ label, value, children, coord }: CityItem) => (
                  <List.Item key={value} className="flex flex-col !items-start">
                    <div
                      className="cursor-pointer select-none hover:bg-gray-100 px-10 text-base"
                      style={{ userSelect: "none" }}
                      onClick={() =>
                        handleClick(
                          { value, label, coord },
                          key !== "当前城市" && key !== "热门城市"
                            ? onClick.bind(null, { value, label, key })
                            : () => {},
                          onDoubleClick,
                          {
                            clickTimeoutRef,
                            lastClickElementRef,
                          }
                        )
                      }
                    >
                      {label}
                    </div>
                    {children?.map(
                      ({
                        label: childLabel,
                        value: childValue,
                        coord: childCoord,
                      }: CityItem) => (
                        <div
                          key={childValue}
                          onClick={() =>
                            handleClick(
                              {
                                value: childValue,
                                label: childLabel,
                                coord: childCoord,
                              },
                              onClick.bind(null, {
                                value: childValue,
                                label: childLabel,
                                key,
                              }),
                              onDoubleClick,
                              { clickTimeoutRef, lastClickElementRef }
                            )
                          }
                          className="w-full h-10 cursor-pointer select-none hover:bg-gray-100 px-18 first:mt-4 flex items-center border-b border-[var(--color-gap-gray)] last:border-b-0 text-sm"
                        >
                          {childLabel}
                        </div>
                      )
                    )}
                  </List.Item>
                )
              )}
            </div>
          ))}
        </List>
      </div>
      <div className="flex flex-col absolute right-2 top-28 z-10 w-8 h-[calc(100vh-200px)] justify-center items-center gap-1">
        {index.map((item) => (
          <div
            key={item}
            onClick={() => scrollToSection(item)}
            // 设置为圆形，使用 Tailwind 的 rounded-full
            className={`cursor-pointer select-none hover:bg-gray-100 w-5 h-8  my-1 flex items-center justify-center text-xs rounded-full text-sm transition-colors ${
              (item === "hot" && activeIndex === "热门城市") ||
              (item === "#" && activeIndex === "当前城市") ||
              (item !== "hot" && item !== "#" && activeIndex === item)
                ? "bg-[var(--color-theme-green)] text-white"
                : "bg-transparent text-gray-600"
            }`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

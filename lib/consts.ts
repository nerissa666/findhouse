import { House } from "@/app/types";

export const TAG_COLORS = [
  "#2db7f5",
  "#87d068",
  "#108ee9",
  "#f50",
  "#faad14",
  "#52c41a",
  "#722ed1",
  "#13c2c2",
];

export const BASE_URL = process.env.NEXT_PUBLIC_PROXY ?? "";

// 所有房屋配置项
export const HOUSE_PACKAGE = {
  衣柜: "icon-wardrobe",
  洗衣机: "icon-wash",
  空调: "icon-air",
  天然气: "icon-gas",
  冰箱: "icon-ref",
  暖气: "icon-Heat",
  电视: "icon-vid",
  热水器: "icon-heater",
  宽带: "icon-broadband",
  沙发: "icon-sofa",
  床: "icon-Bed",
};

// 猜你喜欢
export const RECOMMEND_HOUSES: House[] = [
  {
    houseImg: "/img/message/1.png",
    desc: "72.32㎡/南 北/低楼层",
    title: "安贞西里 3室1厅",
    price: 4500,
    tags: ["随时看房"],
  },
  {
    houseImg: "/img/message/2.png",
    desc: "83㎡/南/高楼层",
    title: "天居园 2室1厅",
    price: 7200,
    tags: ["近地铁"],
  },
  {
    houseImg: "/img/message/3.png",
    desc: "52㎡/西南/低楼层",
    title: "角门甲4号院 1室1厅",
    price: 4300,
  },
];

import { ReactNode } from "react";
export interface ListItem {
  href: string;
  label: string;
  icon: ReactNode;
  alias?: string;
}

export interface House {
  houseImg: string;
  title: string;
  tags?: string[];
  price: number;
  desc: string;
  houseCode?: string;
}
export interface HousesBody {
  list: House[];
  count: number;
}
export interface HouseListProps {
  data: House[];
  loading?: boolean;
  onLoadMore?: () => void;
  total: number;
}
export interface HouseInfo {
  houseImg: string[];
  title: string;
  tags: string[];
  price: number;
  houseCode: string;
  description: string;
  roomType: string;
  oriented: string[];
  floor: string;
  community: string;
  coord: {
    latitude: string;
    longitude: string;
  };
  supporting: string[];
  size: number;
}

export interface CommunityItem {
  area: string;
  areaName: string;
  city: string;
  cityName: string;
  community: string;
  communityName: string;
  street: string;
  streetName: string;
}

export interface CityItem {
  label: string;
  value: string;
  pinyin?: string;
  short?: string;
  children?: CityItem[];
}

export type CityListGrouped = {
  [key: string]: CityItem[];
};

export interface SelectOption {
  label?: string;
  value: string;
  coord?: Coord;
}
export interface Coord {
  latitude: string;
  longitude: string;
}
export interface AreaItem extends CityItem {
  coord: Coord;
  count: string;
}

export interface RouteItem {
  list: ListItem[];
  style: string;
}

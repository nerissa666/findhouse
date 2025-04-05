import Image from "next/image";
import { Button, Carousel } from "antd";
import { Menu } from "./menu";
import {
  HomeOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  BankOutlined,
} from "@ant-design/icons";
// import '@ant-design/v5-patch-for-react-19';

export default function Home() {
  return (
    <div className="">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="h-40 w-100 bg-red-500">
          <h3>1</h3>
        </div>
        {/* <Carousel autoplay>
          <div  className="h-[100px] w-[100px] bg-red-500">
            <h3>1</h3>
          </div>
          <div className="h-[100px] w-[100px] bg-red-500">
            <h3 >1</h3>
          </div>
          <div className="h-[100px] w-[100px] bg-red-500">
            <h3>1</h3>
          </div>
          <div className="h-[100px] w-[100px] bg-red-500">
            <h3>1</h3>
          </div>
        </Carousel> */}
        <Menu
          props={{
            list: [
              { href: "/find", label: "整租", icon: <HomeOutlined /> },
              { href: "/find", label: "合租", icon: <TeamOutlined /> },
              {
                href: "/map",
                label: "地图找房",
                icon: <EnvironmentOutlined />,
              },
              { href: "/rent", label: "去出租", icon: <BankOutlined /> },
            ],
            style: "flex flex-row text-center gap-[20px]",
          }}
        />
      </main>
    </div>
  );
}

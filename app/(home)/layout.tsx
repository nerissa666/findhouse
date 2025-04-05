import { Menu } from "./menu";
import { Header } from "./header";
import { Footer } from "./footer";
import { HomeOutlined, SearchOutlined, ContainerOutlined, UserOutlined } from "@ant-design/icons";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header props={{ title: "找房", description: "首页" }} />
      <div>{children}</div>
      <Menu
        props={{
          list: [
            { href: "/", label: "首页", icon: <HomeOutlined /> },
            { href: "/find", label: "找房", icon: <SearchOutlined />},
            { href: "/news", label: "资讯", icon: <ContainerOutlined /> },
            { href: "/my", label: "我的", icon: <UserOutlined /> },
          ],
          style: "fixed bottom-0 right-8 text-center bg-white/50 border-t border-black/50",
        }}
      />
      <Footer />
    </>
  );
}

"use client";
import dynamic from "next/dynamic";
const SearchBar = dynamic(() => import("@/components/SearchBar"), {
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 animate-pulse rounded"></div>,
});
import { Form, Input, Button, Checkbox, Toast } from "antd-mobile";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { setToken, setUser } from "@/lib/stores/slices/authSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
export default () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const [isRegist, setIsRegist] = useState(false);
  const onFinish = (values: { username: string; password: string }) => {
    if (isRegist) {
      axios.post<{ token: string }>("/user/registered", values).then((res) => {
        Toast.show("注册成功");
        setIsRegist(false);
      });
    } else {
      axios.post<{ token: string }>("/user/login", values).then((res) => {
        // 登录成功后返回上一页
        if ((res as unknown as { token: string }).token) {
          // 设置token到Redux store（无论是否记住我都要设置）
          dispatch(setToken((res as unknown as { token: string }).token));
          dispatch(setUser({ id: "1", username: values.username }));

          if (!rememberMe) {
            // 不勾选记住我，清除 localStorage 中的长期存储
            // 但Redux store中的token仍然有效，用于当前会话
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
              localStorage.removeItem("tokenExpiry");
              localStorage.removeItem("user");
            }
          }
          router.back();
        }
      });
    }
  };
  return (
    <div>
      <SearchBar
        from="/my/login"
        absolute={false}
        cpnts={{
          select: false,
          map: false,
          share: false,
          title: isRegist ? "注册账号" : "账号登录",
        }}
      />
      <Form
        className="py-4"
        layout="horizontal"
        onFinish={onFinish}
        footer={
          <Button
            block
            type="submit"
            style={{ backgroundColor: "var(--color-theme-green)" }}
            size="large"
          >
            登 录
          </Button>
        }
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "账号为必填项" }]}
        >
          <Input placeholder="请输入账号" clearable />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "密码为必填项" }]}
        >
          <Input placeholder="请输入密码" type="password" clearable />
        </Form.Item>

        {!isRegist && (
          <>
            <Form.Item label="">
              <div className="flex items-center justify-between px-2">
                <Checkbox
                  checked={rememberMe}
                  onChange={setRememberMe}
                  style={{
                    "--icon-size": "18px",
                    "--adm-color-primary": "var(--color-theme-green)",
                  }}
                >
                  七天免登录
                </Checkbox>
                <span className="text-sm text-gray-500">
                  勾选后7天内无需重复登录
                </span>
              </div>
            </Form.Item>
            <Form.Item label="">
              暂无账号，去
              <Button
                size="small"
                type="submit"
                onClick={() => setIsRegist(true)}
                style={{ backgroundColor: "var(--color-gap-gray)" }}
              >
                注册
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};

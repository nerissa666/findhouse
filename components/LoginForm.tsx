"use client";
import { useState } from "react";
import { Form, Input, Button, Toast } from "antd-mobile";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/lib/stores/slices/authSlice";
import { setToken as setTokenUtil, setUserInfo } from "@/lib/auth";
import axios from "@/lib/axios";

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginForm() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      // 调用登录API
      const response = await axios.post("/user/login", {
        username: values.username,
        password: values.password,
      });

      if (response.token) {
        // 存储token
        setTokenUtil(response.token);
        dispatch(setToken(response.token));

        // 存储用户信息
        if (response.user) {
          setUserInfo(response.user);
          dispatch(setUser(response.user));
        }

        Toast.show("登录成功");
        // 可以在这里跳转到其他页面
        // router.push('/');
      }
    } catch (error) {
      console.error("登录失败:", error);
      Toast.show("登录失败，请检查用户名和密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      footer={
        <Button
          block
          type="submit"
          color="primary"
          loading={loading}
          style={{
            "--background-color": "var(--color-theme-green)",
            "--border-color": "var(--color-theme-green)",
          }}
        >
          登录
        </Button>
      }
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input placeholder="请输入密码" type="password" />
      </Form.Item>
    </Form>
  );
}

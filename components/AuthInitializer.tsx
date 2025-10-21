"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "@/lib/stores/slices/authSlice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 应用启动时初始化认证状态
    dispatch(initializeAuth());
  }, [dispatch]);

  return null; // 这个组件不渲染任何内容
}

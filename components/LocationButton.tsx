"use client";
import React, { useEffect, useState } from "react";
import { Button, message, Tooltip } from "antd";
import { useLocation } from "@/lib/hooks/useLocation";
import { LocationData } from "@/lib/utils/locationUtils";
import {
  AimOutlined,
  LoadingOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

interface LocationButtonProps {
  onLocationChange?: (location: LocationData) => void;
  withAddress?: boolean;
  showAddress?: boolean;
  className?: string;
  size?: "small" | "middle" | "large";
  type?: "primary" | "default" | "dashed" | "link" | "text";
}

export default function LocationButton({
  onLocationChange,
  withAddress = true,
  showAddress = true,
  className = "",
  size = "middle",
  type = "primary",
}: LocationButtonProps) {
  const {
    location,
    error,
    loading,
    supported,
    permission,
    getLocation,
    clearLocation,
  } = useLocation({
    withAddress,
  });

  const [messageApi, contextHolder] = message.useMessage();

  // 处理定位成功
  const handleLocationSuccess = (locationData: LocationData) => {
    onLocationChange?.(locationData);

    if (showAddress && locationData.address) {
      messageApi.success(`定位成功: ${locationData.address}`);
    } else {
      messageApi.success("定位成功");
    }
  };

  // 处理定位失败
  const handleLocationError = (error: any) => {
    let errorMessage = "定位失败";

    switch (error.code) {
      case 1: // PERMISSION_DENIED
        errorMessage = "定位权限被拒绝，请在浏览器设置中允许定位";
        break;
      case 2: // POSITION_UNAVAILABLE
        errorMessage = "定位信息不可用，请检查网络连接";
        break;
      case 3: // TIMEOUT
        errorMessage = "定位超时，请重试";
        break;
      default:
        errorMessage = error.message || "定位失败";
    }

    messageApi.error(errorMessage);
  };

  // 点击定位按钮
  const handleClick = async () => {
    if (!supported) {
      messageApi.error("您的浏览器不支持定位功能");
      return;
    }

    if (permission === "denied") {
      messageApi.error("定位权限被拒绝，请在浏览器设置中允许定位");
      return;
    }

    try {
      await getLocation();
    } catch (err) {
      handleLocationError(err);
    }
  };

  // 监听定位结果
  useEffect(() => {
    if (location) {
      handleLocationSuccess(location);
    }
  }, [location]);

  useEffect(() => {
    if (error) {
      handleLocationError(error);
    }
  }, [error]);

  // 获取按钮图标
  const getButtonIcon = () => {
    if (loading) {
      return <LoadingOutlined spin />;
    }

    if (error) {
      return <ExclamationCircleOutlined />;
    }

    if (location) {
      return <EnvironmentOutlined />;
    }

    return <AimOutlined />;
  };

  // 获取按钮文本
  const getButtonText = () => {
    if (loading) {
      return "定位中...";
    }

    if (error) {
      return "定位失败";
    }

    if (location) {
      return "重新定位";
    }

    return "获取定位";
  };

  // 获取按钮提示
  const getTooltipTitle = () => {
    if (!supported) {
      return "您的浏览器不支持定位功能";
    }

    if (permission === "denied") {
      return "定位权限被拒绝，请在浏览器设置中允许定位";
    }

    if (location) {
      return `当前位置: ${location.lng.toFixed(6)}, ${location.lat.toFixed(6)}`;
    }

    return "点击获取当前位置";
  };

  return (
    <>
      {contextHolder}
      <Tooltip title={getTooltipTitle()}>
        <Button
          type={type}
          size={size}
          icon={getButtonIcon()}
          onClick={handleClick}
          loading={loading}
          disabled={!supported || permission === "denied"}
          className={className}
        >
          {getButtonText()}
        </Button>
      </Tooltip>

      {location && showAddress && location.address && (
        <div className="mt-2 text-sm text-gray-600">
          <EnvironmentOutlined className="mr-1" />
          {location.address}
        </div>
      )}
    </>
  );
}

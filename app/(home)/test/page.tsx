"use client";
import React, { useState, useRef } from "react";

function ClickExample() {
  const [clickType, setClickType] = useState("");
  const timer = useRef(null);

  const handleClick = () => {
    // 如果已有定时器，说明这是第二次点击 → 双击
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
      setClickType("Double Click");
    } else {
      // 第一次点击 → 启动延时判断是否为单击
      timer.current = setTimeout(() => {
        setClickType("Single Click");
        timer.current = null;
      }, 250); // 250ms 内再次点击算双击，可调节
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Click me
      </button>
      <p className="mt-2 text-gray-700">Last: {clickType}</p>
    </div>
  );
}

export default ClickExample;

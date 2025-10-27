"use client";
import PerformanceDemo from "@/components/PerformanceDemo";
import ListDemo from "@/components/ListDemo";
import { useState } from "react";
import { Button } from "antd-mobile";

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div style={{ padding: "20px" }}>
      <h1>React 性能优化完整指南</h1>

      <div style={{ marginBottom: "20px" }}>
        <Button
          color={activeTab === "basic" ? "primary" : "default"}
          onClick={() => setActiveTab("basic")}
          style={{ marginRight: "10px" }}
        >
          基础优化
        </Button>
        <Button
          color={activeTab === "list" ? "primary" : "default"}
          onClick={() => setActiveTab("list")}
        >
          列表优化
        </Button>
      </div>

      {activeTab === "basic" && <PerformanceDemo />}
      {activeTab === "list" && <ListDemo />}

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#f0f8ff",
          borderRadius: "8px",
        }}
      >
        <h2>📚 性能优化知识点总结</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <h3>🎯 memo</h3>
            <p>
              <strong>作用:</strong> 防止组件不必要的重新渲染
            </p>
            <p>
              <strong>用法:</strong>
            </p>
            <pre
              style={{
                backgroundColor: "#f5f5f5",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {`const MyComponent = memo(
  function MyComponent({ prop }) {
    return <div>{prop}</div>;
  }
);`}
            </pre>
            <p>
              <strong>适用场景:</strong>
            </p>
            <ul style={{ fontSize: "12px" }}>
              <li>子组件渲染成本高</li>
              <li>父组件频繁重新渲染</li>
              <li>props 变化不频繁</li>
            </ul>
          </div>

          <div>
            <h3>🎯 useMemo</h3>
            <p>
              <strong>作用:</strong> 缓存计算结果，避免重复计算
            </p>
            <p>
              <strong>用法:</strong>
            </p>
            <pre
              style={{
                backgroundColor: "#f5f5f5",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {`const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);`}
            </pre>
            <p>
              <strong>适用场景:</strong>
            </p>
            <ul style={{ fontSize: "12px" }}>
              <li>复杂计算逻辑</li>
              <li>计算结果用于渲染</li>
              <li>依赖项变化不频繁</li>
            </ul>
          </div>

          <div>
            <h3>🎯 useCallback</h3>
            <p>
              <strong>作用:</strong> 缓存函数引用，避免子组件重新渲染
            </p>
            <p>
              <strong>用法:</strong>
            </p>
            <pre
              style={{
                backgroundColor: "#f5f5f5",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {`const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);`}
            </pre>
            <p>
              <strong>适用场景:</strong>
            </p>
            <ul style={{ fontSize: "12px" }}>
              <li>传递函数给子组件</li>
              <li>子组件使用 memo 优化</li>
              <li>函数依赖项稳定</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3>⚠️ 注意事项</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <h4>❌ 过度优化</h4>
              <ul style={{ fontSize: "12px" }}>
                <li>不要对所有组件都使用 memo</li>
                <li>不要对所有函数都使用 useCallback</li>
                <li>不要对所有计算都使用 useMemo</li>
                <li>优化本身也有成本</li>
              </ul>
            </div>
            <div>
              <h4>✅ 合理使用</h4>
              <ul style={{ fontSize: "12px" }}>
                <li>先测量性能问题</li>
                <li>针对瓶颈进行优化</li>
                <li>使用 React DevTools 分析</li>
                <li>关注实际用户体验</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3>🔧 性能分析工具</h3>
          <ul>
            <li>
              <strong>React DevTools Profiler:</strong> 分析组件渲染性能
            </li>
            <li>
              <strong>Chrome DevTools Performance:</strong> 分析整体性能
            </li>
            <li>
              <strong>console.log:</strong> 简单但有效的调试方法
            </li>
            <li>
              <strong>React.memo 比较函数:</strong> 自定义比较逻辑
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

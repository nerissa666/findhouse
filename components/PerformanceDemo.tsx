"use client";
import { useState, useCallback, useMemo, memo } from "react";
import { Button, Card } from "antd-mobile";

// 1. 普通组件 - 没有优化
function NormalChild({
  name,
  age,
  onClick,
}: {
  name: string;
  age: number;
  onClick: () => void;
}) {
  console.log("NormalChild 重新渲染");
  return (
    <Card title="普通子组件">
      <p>姓名: {name}</p>
      <p>年龄: {age}</p>
      <Button onClick={onClick}>点击我</Button>
    </Card>
  );
}

// 2. 使用 memo 优化的组件
const MemoChild = memo(function MemoChild({
  name,
  age,
  onClick,
}: {
  name: string;
  age: number;
  onClick: () => void;
}) {
  console.log("MemoChild 重新渲染");
  return (
    <Card title="Memo 子组件">
      <p>姓名: {name}</p>
      <p>年龄: {age}</p>
      <Button onClick={onClick}>点击我</Button>
    </Card>
  );
});

// 3. 使用 memo + useCallback 优化的组件
const OptimizedChild = memo(function OptimizedChild({
  name,
  age,
  onClick,
}: {
  name: string;
  age: number;
  onClick: () => void;
}) {
  console.log("OptimizedChild 重新渲染");
  return (
    <Card title="完全优化的子组件">
      <p>姓名: {name}</p>
      <p>年龄: {age}</p>
      <Button onClick={onClick}>点击我</Button>
    </Card>
  );
});

// 4. 复杂计算组件
function ExpensiveComponent({ items }: { items: number[] }) {
  console.log("ExpensiveComponent 重新渲染");

  // 没有优化的计算
  const sum = items.reduce((acc, item) => acc + item, 0);

  return (
    <Card title="复杂计算组件">
      <p>数组: {items.join(", ")}</p>
      <p>总和: {sum}</p>
    </Card>
  );
}

// 5. 使用 useMemo 优化的计算组件
function OptimizedExpensiveComponent({ items }: { items: number[] }) {
  console.log("OptimizedExpensiveComponent 重新渲染");

  // 使用 useMemo 缓存计算结果
  const sum = useMemo(() => {
    console.log("执行复杂计算...");
    return items.reduce((acc, item) => acc + item, 0);
  }, [items]);

  return (
    <Card title="useMemo 优化的计算组件">
      <p>数组: {items.join(", ")}</p>
      <p>总和: {sum}</p>
    </Card>
  );
}

// 主组件
export default function PerformanceDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("张三");
  const [age, setAge] = useState(25);
  const [items, setItems] = useState([1, 2, 3, 4, 5]);

  console.log("主组件重新渲染");

  // 普通函数 - 每次渲染都会创建新的函数
  const handleClick = () => {
    console.log("普通函数被调用");
  };

  // 使用 useCallback 优化的函数
  const handleClickCallback = useCallback(() => {
    console.log("useCallback 函数被调用");
  }, []);

  // 使用 useMemo 缓存的值
  const expensiveValue = useMemo(() => {
    console.log("计算 expensiveValue...");
    return count * 1000;
  }, [count]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>React 性能优化演示</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>控制面板</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>
          <Button onClick={() => setName(name === "张三" ? "李四" : "张三")}>
            切换姓名: {name}
          </Button>
          <Button onClick={() => setAge(age + 1)}>年龄: {age}</Button>
          <Button
            onClick={() => setItems([...items, Math.floor(Math.random() * 10)])}
          >
            添加随机数
          </Button>
        </div>
        <p>Expensive Value: {expensiveValue}</p>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* 普通组件 */}
        <div>
          <h3>普通组件 (每次都会重新渲染)</h3>
          <NormalChild name={name} age={age} onClick={handleClick} />
        </div>

        {/* Memo 组件 */}
        <div>
          <h3>Memo 组件 (props 变化时才重新渲染)</h3>
          <MemoChild name={name} age={age} onClick={handleClick} />
        </div>

        {/* 完全优化的组件 */}
        <div>
          <h3>完全优化的组件 (memo + useCallback)</h3>
          <OptimizedChild name={name} age={age} onClick={handleClickCallback} />
        </div>

        {/* 复杂计算组件 */}
        <div>
          <h3>复杂计算组件 (每次重新计算)</h3>
          <ExpensiveComponent items={items} />
        </div>

        {/* useMemo 优化的计算组件 */}
        <div>
          <h3>useMemo 优化的计算组件 (缓存计算结果)</h3>
          <OptimizedExpensiveComponent items={items} />
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h3>性能优化说明</h3>
        <ul>
          <li>
            <strong>memo</strong>: 防止组件在 props 没有变化时重新渲染
          </li>
          <li>
            <strong>useMemo</strong>: 缓存计算结果，避免重复计算
          </li>
          <li>
            <strong>useCallback</strong>:
            缓存函数引用，避免子组件不必要的重新渲染
          </li>
        </ul>

        <h4>使用场景：</h4>
        <ul>
          <li>✅ 子组件渲染成本高</li>
          <li>✅ 父组件频繁重新渲染</li>
          <li>✅ 有复杂的计算逻辑</li>
          <li>✅ 传递函数给子组件</li>
        </ul>
      </div>
    </div>
  );
}

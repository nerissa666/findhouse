"use client";
import { useState, useCallback, useMemo, memo } from "react";
import { Button, List, Card } from "antd-mobile";

// 列表项组件 - 没有优化
function ListItem({
  item,
  onDelete,
}: {
  item: { id: number; name: string; value: number };
  onDelete: (id: number) => void;
}) {
  console.log(`ListItem ${item.id} 重新渲染`);

  return (
    <List.Item
      key={item.id}
      extra={
        <Button size="small" color="danger" onClick={() => onDelete(item.id)}>
          删除
        </Button>
      }
    >
      <div>
        <div>{item.name}</div>
        <div style={{ color: "#666", fontSize: "12px" }}>值: {item.value}</div>
      </div>
    </List.Item>
  );
}

// 列表项组件 - 使用 memo 优化
const MemoListItem = memo(function MemoListItem({
  item,
  onDelete,
}: {
  item: { id: number; name: string; value: number };
  onDelete: (id: number) => void;
}) {
  console.log(`MemoListItem ${item.id} 重新渲染`);

  return (
    <List.Item
      key={item.id}
      extra={
        <Button size="small" color="danger" onClick={() => onDelete(item.id)}>
          删除
        </Button>
      }
    >
      <div>
        <div>{item.name}</div>
        <div style={{ color: "#666", fontSize: "12px" }}>值: {item.value}</div>
      </div>
    </List.Item>
  );
});

// 列表项组件 - 完全优化
const OptimizedListItem = memo(function OptimizedListItem({
  item,
  onDelete,
}: {
  item: { id: number; name: string; value: number };
  onDelete: (id: number) => void;
}) {
  console.log(`OptimizedListItem ${item.id} 重新渲染`);

  return (
    <List.Item
      key={item.id}
      extra={
        <Button size="small" color="danger" onClick={() => onDelete(item.id)}>
          删除
        </Button>
      }
    >
      <div>
        <div>{item.name}</div>
        <div style={{ color: "#666", fontSize: "12px" }}>值: {item.value}</div>
      </div>
    </List.Item>
  );
});

// 统计组件
function Stats({
  items,
}: {
  items: { id: number; name: string; value: number }[];
}) {
  console.log("Stats 重新渲染");

  // 没有优化的计算
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const average = items.length > 0 ? total / items.length : 0;

  return (
    <Card title="统计信息">
      <p>总项目数: {items.length}</p>
      <p>总值: {total}</p>
      <p>平均值: {average.toFixed(2)}</p>
    </Card>
  );
}

// 使用 useMemo 优化的统计组件
function OptimizedStats({
  items,
}: {
  items: { id: number; name: string; value: number }[];
}) {
  console.log("OptimizedStats 重新渲染");

  // 使用 useMemo 缓存计算结果
  const stats = useMemo(() => {
    console.log("计算统计信息...");
    const total = items.reduce((sum, item) => sum + item.value, 0);
    const average = items.length > 0 ? total / items.length : 0;
    return { total, average };
  }, [items]);

  return (
    <Card title="优化的统计信息">
      <p>总项目数: {items.length}</p>
      <p>总值: {stats.total}</p>
      <p>平均值: {stats.average.toFixed(2)}</p>
    </Card>
  );
}

export default function ListDemo() {
  const [items, setItems] = useState([
    { id: 1, name: "项目 1", value: 10 },
    { id: 2, name: "项目 2", value: 20 },
    { id: 3, name: "项目 3", value: 30 },
  ]);
  const [counter, setCounter] = useState(0);

  console.log("ListDemo 主组件重新渲染");

  // 普通删除函数 - 每次渲染都会创建新的函数
  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // 使用 useCallback 优化的删除函数
  const handleDeleteCallback = useCallback((id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  // 添加新项目
  const addItem = () => {
    const newId = Math.max(...items.map((item) => item.id), 0) + 1;
    setItems([
      ...items,
      {
        id: newId,
        name: `项目 ${newId}`,
        value: Math.floor(Math.random() * 100),
      },
    ]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>列表性能优化演示</h1>

      <div style={{ marginBottom: "20px" }}>
        <Button onClick={() => setCounter(counter + 1)}>
          计数器: {counter} (触发父组件重新渲染)
        </Button>
        <Button onClick={addItem} style={{ marginLeft: "10px" }}>
          添加项目
        </Button>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* 普通列表 */}
        <div>
          <h3>普通列表 (每次父组件渲染，所有子组件都重新渲染)</h3>
          <List>
            {items.map((item) => (
              <ListItem key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </List>
        </div>

        {/* Memo 列表 */}
        <div>
          <h3>Memo 列表 (只有删除的项目重新渲染)</h3>
          <List>
            {items.map((item) => (
              <MemoListItem key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </List>
        </div>

        {/* 完全优化的列表 */}
        <div>
          <h3>完全优化的列表 (memo + useCallback)</h3>
          <List>
            {items.map((item) => (
              <OptimizedListItem
                key={item.id}
                item={item}
                onDelete={handleDeleteCallback}
              />
            ))}
          </List>
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* 普通统计 */}
        <Stats items={items} />

        {/* 优化的统计 */}
        <OptimizedStats items={items} />
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h3>性能对比说明</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "10px",
          }}
        >
          <div>
            <h4>❌ 普通组件</h4>
            <ul style={{ fontSize: "12px" }}>
              <li>父组件渲染 → 所有子组件重新渲染</li>
              <li>每次创建新的函数</li>
              <li>重复计算相同结果</li>
            </ul>
          </div>
          <div>
            <h4>✅ Memo 组件</h4>
            <ul style={{ fontSize: "12px" }}>
              <li>只有 props 变化时才重新渲染</li>
              <li>减少不必要的渲染</li>
              <li>但函数引用仍会变化</li>
            </ul>
          </div>
          <div>
            <h4>✅ 完全优化</h4>
            <ul style={{ fontSize: "12px" }}>
              <li>memo + useCallback</li>
              <li>缓存函数引用</li>
              <li>useMemo 缓存计算结果</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

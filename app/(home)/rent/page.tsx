"use client";
import SearchBar from "@/components/SearchBar/page";
import {
  Form,
  Input,
  TextArea,
  Button,
  Switch,
  Picker,
  ImageUploader,
  ImageUploadItem,
  Selector,
} from "antd-mobile";
import { useRef, useState } from "react";
import { HOUSE_PACKAGE } from "@/lib/consts";

export default function Rent() {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<(string | null)[]>([]);
  const [floorVisible, setFloorVisible] = useState(false);
  const [floorValue, setFloorValue] = useState<(string | null)[]>([]);
  const [orientedVisible, setOrientedVisible] = useState(false);
  const [orientedValue, setOrientedValue] = useState<(string | null)[]>([]);
  const [supportingValue, setSupportingValue] = useState<string[]>([]);
  const [fileList, setFileList] = useState<ImageUploadItem[]>([
    {
      url: "/images/demo.jpg",
    },
  ]);
  const basicColumns = useRef([
    [
      { label: "一室", value: "Mon" },
      { label: "二室", value: "Tues" },
      { label: "三室", value: "Wed" },
      { label: "四室", value: "Thur" },
      { label: "四室+", value: "Fri" },
    ],
  ]);
  const floorColumns = useRef([
    [
      { label: "高楼层", value: "Mon" },
      { label: "中楼层", value: "Tues" },
      { label: "低楼层", value: "Wed" },
    ],
  ]);
  const orientedColumns = useRef([
    [
      { label: "东", value: "Mon" },
      { label: "西", value: "Tues" },
      { label: "南", value: "Wed" },
      { label: "北", value: "Thur" },
      { label: "东南", value: "Fri" },
      { label: "东北", value: "Sat" },
      { label: "西南", value: "Sun" },
      { label: "西北", value: "111" },
    ],
  ]);

  const onUpload = (files: File): Promise<ImageUploadItem> => {
    setFileList([...fileList, { url: URL.createObjectURL(files) }]);
    return Promise.resolve({ url: URL.createObjectURL(files) });
  };
  return (
    <>
      <SearchBar
        from="/rent"
        absolute={false}
        cpnts={{ title: "发布房源", select: false, map: false, share: false }}
      />
      <Form
        layout="horizontal"
        footer={
          <Button block type="submit" color="primary" size="large">
            提交
          </Button>
        }
      >
        <Form.Item
          name="name"
          label="小区名称"
          // rules={[{ required: true, message: "姓名不能为空" }]}
        >
          <Input onChange={console.log} placeholder="请输入小区名称" />
        </Form.Item>
        <Form.Item name="price" label="租金">
          <Input onChange={console.log} placeholder="请输入租金" />
        </Form.Item>
        <Form.Item name="size" label="建筑面积">
          <Input onChange={console.log} placeholder="请输入建筑面积" />
        </Form.Item>

        <Form.Item name="roomType" label="户型">
          <Input
            onChange={console.log}
            placeholder="请选择"
            value={
              basicColumns.current[0].find((item) => item.value === value[0])
                ?.label || ""
            }
            onClick={() => {
              setVisible(true);
            }}
          />
          <Picker
            columns={basicColumns.current}
            visible={visible}
            onClose={() => {
              setVisible(false);
            }}
            value={value}
            onConfirm={(v) => {
              setValue(v as (string | null)[]);
            }}
          />
        </Form.Item>
        <Form.Item name="floor" label="楼层">
          <Input
            onChange={console.log}
            placeholder="请选择"
            value={
              floorColumns.current[0].find(
                (item) => item.value === floorValue[0]
              )?.label || ""
            }
            onClick={() => {
              setFloorVisible(true);
            }}
          />
          <Picker
            columns={floorColumns.current}
            visible={floorVisible}
            onClose={() => {
              setFloorVisible(false);
            }}
            value={floorValue}
            onConfirm={(v) => {
              setFloorValue(v as (string | null)[]);
            }}
          />
        </Form.Item>
        <Form.Item name="oriented" label="朝向">
          <Input
            onChange={console.log}
            placeholder="请选择"
            value={
              orientedColumns.current[0].find(
                (item) => item.value === orientedValue[0]
              )?.label || ""
            }
            onClick={() => {
              setOrientedVisible(true);
            }}
          />
          <Picker
            columns={orientedColumns.current}
            visible={orientedVisible}
            onClose={() => {
              setOrientedVisible(false);
            }}
            value={orientedValue}
            onConfirm={(v) => {
              setOrientedValue(v as (string | null)[]);
            }}
          />
        </Form.Item>

        <Form.Item name="title" label="标题">
          <TextArea
            placeholder="请输入标题,例如:整租 小区名 2室 5000元"
            maxLength={100}
            rows={2}
            showCount
          />
        </Form.Item>
        <Form.Item name="amount" label="房屋图像">
          <ImageUploader
            value={fileList}
            onChange={setFileList}
            upload={onUpload}
          />
        </Form.Item>
        <Form.Item name="supporting" label="房屋配置">
          <div className="flex flex-wrap gap-2">
            {Object.entries(HOUSE_PACKAGE)?.map(([key, value]) => (
              <div
                key={key}
                className={`flex flex-col items-center gap-2 cursor-pointer ${
                  supportingValue.includes(key)
                    ? "text-[var(--color-theme-green)]"
                    : ""
                }`}
                onClick={() => {
                  supportingValue.includes(key)
                    ? setSupportingValue(
                        supportingValue.filter((item) => item !== key)
                      )
                    : setSupportingValue([...supportingValue, key]);
                }}
              >
                <i key={key} className={`iconfont ${value}`}></i>
                <span>{key}</span>
              </div>
            ))}
          </div>
        </Form.Item>
        <Form.Item name="description" label="房屋描述">
          <TextArea
            placeholder="请输入房屋描述"
            maxLength={100}
            rows={5}
            showCount
          />
        </Form.Item>
      </Form>
    </>
  );
}

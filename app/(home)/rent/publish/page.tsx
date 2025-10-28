"use client";
import dynamic from "next/dynamic";
const SearchBar = dynamic(() => import("@/components/SearchBar/page"), {
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 animate-pulse rounded"></div>,
});
import {
  Form,
  Input,
  TextArea,
  Button,
  ImageUploadItem,
  Toast,
} from "antd-mobile";
const Picker = dynamic(() => import("antd-mobile").then((mod) => mod.Picker), {
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 animate-pulse rounded"></div>,
});
const ImageUploader = dynamic(
  () => import("antd-mobile").then((mod) => mod.ImageUploader),
  {
    ssr: false,
    loading: () => (
      <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
    ),
  }
);
const Select = dynamic(() => import("antd").then((mod) => mod.Select), {
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 animate-pulse rounded"></div>,
});
import { useState, useEffect, useRef } from "react";
import { CommunityItem, SelectOption } from "@/app/types";
import styles from "../index.module.scss";
import { BASE_URL, HOUSE_PACKAGE } from "@/lib/consts";
// import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useAppSelector } from "@/lib/hooks";
import { handleSearch as debounce } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Rent() {
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [form] = Form.useForm();
  const city = useAppSelector((state) => state.city.currentCity);
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [floorVisible, setFloorVisible] = useState(false);
  const [orientedVisible, setOrientedVisible] = useState(false);
  const [supportingValue, setSupportingValue] = useState<string[]>([]);
  const [communityList, setCommunityList] = useState<SelectOption[]>([]);
  // 使用 useWatch 监听表单字段变化
  const roomType = Form.useWatch("roomType", form);
  const floor = Form.useWatch("floor", form);
  const oriented = Form.useWatch("oriented", form);
  const [fileList, setFileList] = useState<ImageUploadItem[]>([
    // {
    //   url: "/images/demo.jpg",
    // },
  ]);
  const [params, setParams] = useState<Params>({
    floor: [],
    oriented: [],
    roomType: [],
    supporting: [],
  });
  interface Params {
    floor: SelectOption[];
    oriented: SelectOption[];
    roomType: SelectOption[];
    supporting: SelectOption[];
  }
  const onUpload = async (files: File): Promise<ImageUploadItem> => {
    // 检查文件类型
    if (!files.type.startsWith("image/")) {
      throw new Error("请选择有效的图片文件");
    }

    // 检查文件大小 (5MB限制)
    if (files.size > 5 * 1024 * 1024) {
      throw new Error("图片大小不能超过5MB");
    }

    const formData = new FormData();
    formData.append("file", files);

    try {
      const res = await axios.post("/houses/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // 确保URL正确拼接
      let imageUrl = res[0];
      if (!imageUrl || typeof imageUrl !== "string") {
        throw new Error("服务器返回的数据格式错误");
      }

      if (!imageUrl.startsWith("http")) {
        // 如果BASE_URL为空，使用默认的代理路径
        const baseUrl = BASE_URL || "http://localhost:8080";
        imageUrl =
          baseUrl + (imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl);
      }

      // 测试图片URL是否可访问
      try {
        const testResponse = await fetch(imageUrl, { method: "HEAD" });
        console.log("图片URL测试结果:", testResponse.status);
      } catch (testError) {
        console.warn("图片URL测试失败:", testError);
      }

      return {
        url: imageUrl,
        key: Date.now().toString(),
      };
    } catch (error) {
      // 使用FileReader创建持久的base64预览
      const previewUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.onerror = () => {
          reject(new Error("文件读取失败"));
        };
        reader.readAsDataURL(files);
      });

      console.log("使用预览URL:", previewUrl.substring(0, 50) + "...");

      return {
        url: previewUrl,
        key: Date.now().toString(),
      };
    }
  };

  const onFinish = (
    values: Record<string, string | number | (string | null)[]>
  ) => {
    // 测试 Toast 是否工作
    Toast.show("正在提交...");

    // 处理表单数据
    const formData = {
      ...values,
      supporting: supportingValue.join("|"), // 将选中的配置项用|连接
      // 可以在这里添加其他数据处理逻辑
      // 例如：格式化价格、处理图片等
      houseImg: fileList.map((item) => item.url).join("|"),
      oriented: oriented?.[0] || null,
      floor: floor?.[0] || null,
      roomType: roomType?.[0] || null,
    };

    console.log("提交的表单数据:", formData);

    // 这里可以调用API提交数据
    // token会自动通过axios拦截器携带
    axios
      .post("/user/houses", formData)
      .then((res) => {
        // 使用简单的字符串形式，与其他地方保持一致
        // Toast.show("提交成功");
        // // 延迟一下再返回，确保 Toast 显示
        setTimeout(() => {
          router.back();
        }, 1500);
      })
      .catch((error) => {
        Toast.show("提交失败，请重试");
      });
  };
  const onSearch = (value: string) => {
    axios
      .get("/area/community", {
        params: {
          name: value,
          id: city.value,
        },
      })
      .then((res) => {
        setCommunityList(
          (res as unknown as CommunityItem[]).map((item: CommunityItem) => ({
            value: item.community,
            label: item.communityName,
          }))
        );
      });
  };
  useEffect(() => {
    axios.get("/houses/params").then((res) => {
      setParams(res as unknown as Params);
    });
  }, []);
  return (
    <div className={`${styles.rent} relative`}>
      <SearchBar
        from="/rent"
        absolute={false}
        cpnts={{ title: "发布房源", select: false, map: false, share: false }}
      />
      <Form
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        footer={
          <div className="fixed bottom-[-7px] left-0 right-0 z-50 flex flex-row gap-2">
            <Button
              inline-block
              type="reset"
              size="large"
              style={{
                "--text-color": "var(--color-theme-green)",
                "--border-color": "transparent",
                "--border-radius": "0",
              }}
              onClick={() => {
                // 重置表单字段
                form.resetFields();
                // router.back();
              }}
            >
              取 消
            </Button>
            <Button
              inline-block
              type="submit"
              color="primary"
              size="large"
              style={{
                "--background-color": "var(--color-theme-green)",
                "--border-color": "var(--color-theme-green)",
                "--border-radius": "0",
              }}
            >
              提 交
            </Button>
          </div>
        }
      >
        <Form.Item
          name="community"
          label="小区名称"
          // rules={[{ required: true, message: "姓名不能为空" }]}
        >
          <Select
            showSearch
            allowClear
            value={form.getFieldValue("community") || ""}
            placeholder="请输入小区名称"
            style={{
              width: "100%",
            }}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={(value) =>
              debounce({ debounceTimer, onSearch: () => onSearch(value) })
            }
            onChange={() => {}}
            notFoundContent={null}
            options={communityList}
          />
        </Form.Item>
        <Form.Item name="price" label="租金" extra={"￥/月"}>
          <Input placeholder="请输入租金" />
        </Form.Item>
        <Form.Item name="size" label="建筑面积" extra={"㎡"}>
          <Input placeholder="请输入建筑面积" />
        </Form.Item>

        <Form.Item
          name="roomType"
          label="户型"
          extra={<i className="iconfont icon-箭头向右"></i>}
        >
          <div onClick={() => setVisible(true)} style={{ cursor: "pointer" }}>
            <Input
              placeholder="请选择"
              readOnly
              value={
                params.roomType.find(
                  (item) => item.value === (roomType || [])?.[0]
                )?.label || ""
              }
            />
          </div>
        </Form.Item>
        <Picker
          columns={[params.roomType]}
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          value={form.getFieldValue("roomType") || []}
          onConfirm={(v) => {
            form.setFieldValue("roomType", v as (string | null)[]);
            setVisible(false);
          }}
        />
        <Form.Item
          name="floor"
          label="楼层"
          extra={<i className="iconfont icon-箭头向右"></i>}
        >
          <div
            onClick={() => setFloorVisible(true)}
            style={{ cursor: "pointer" }}
          >
            <Input
              placeholder="请选择"
              readOnly
              value={
                params.floor.find((item) => item.value === (floor || [])?.[0])
                  ?.label || ""
              }
            />
          </div>
        </Form.Item>
        <Picker
          columns={[params.floor]}
          visible={floorVisible}
          onClose={() => {
            setFloorVisible(false);
          }}
          value={form.getFieldValue("floor") || []}
          onConfirm={(v) => {
            form.setFieldValue("floor", v as (string | null)[]);
            setFloorVisible(false);
          }}
        />
        <Form.Item
          name="oriented"
          label="朝向"
          extra={<i className="iconfont icon-箭头向右"></i>}
        >
          <div
            onClick={() => setOrientedVisible(true)}
            style={{ cursor: "pointer" }}
          >
            <Input
              placeholder="请选择"
              readOnly
              value={
                params.oriented.find(
                  (item) => item.value === (oriented || [])?.[0]
                )?.label || ""
              }
            />
          </div>
        </Form.Item>
        <Picker
          columns={[params.oriented]}
          visible={orientedVisible}
          onClose={() => {
            setOrientedVisible(false);
          }}
          value={form.getFieldValue("oriented") || []}
          onConfirm={(v) => {
            form.setFieldValue("oriented", v as (string | null)[]);
            setOrientedVisible(false);
          }}
        />

        <Form.Item name="title" label="标题">
          <TextArea
            placeholder="请输入标题,例如:整租 小区名 2室 5000元"
            maxLength={100}
            rows={2}
            showCount
          />
        </Form.Item>
        <Form.Item label="房屋图像">
          <ImageUploader
            value={fileList || []}
            onChange={(newFileList) => {
              setFileList(newFileList || []);
            }}
            upload={onUpload}
            maxCount={9}
            multiple
          />
        </Form.Item>
        <Form.Item label="房屋配置">
          <div className="grid grid-cols-4 gap-2">
            {params.supporting?.map(({ label, value }) => {
              return (
                <div
                  key={value}
                  className={`flex flex-col items-center gap-2 cursor-pointer ${
                    supportingValue.includes(label)
                      ? "text-[var(--color-theme-green)]"
                      : ""
                  }`}
                  onClick={() => {
                    supportingValue.includes(label)
                      ? setSupportingValue(
                          supportingValue.filter((item) => item !== label)
                        )
                      : setSupportingValue([...supportingValue, label]);
                  }}
                >
                  <i className={`iconfont ${HOUSE_PACKAGE[label]}`}></i>
                  <span>{label}</span>
                </div>
              );
            })}
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
    </div>
  );
}

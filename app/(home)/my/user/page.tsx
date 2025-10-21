"use client";
import SearchBar from "@/components/SearchBar";
import {
  Button,
  Form,
  ImageUploader,
  ImageUploadItem,
  Input,
  Radio,
} from "antd-mobile";
import { BASE_URL } from "@/lib/consts";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useAppSelector } from "@/lib/hooks";
import { useRouteHistory } from "@/lib/hooks/useRouteHistory";
import { message } from "antd";
export default () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const user = useAppSelector((state) => state.auth.user);
  const { goBack } = useRouteHistory();
  const onFinish = (values: any) => {
    // 如果有上传的文件，使用文件列表中的第一个
    const avatarData = fileList.length > 0 ? fileList[0].url : values.avatar;
    axios.patch("/user", { ...values, avatar: avatarData }).then((res) => {
      message.success("修改成功");
      goBack();
    });
  };
  const upload = (files: File): Promise<ImageUploadItem> => {
    const formData = new FormData();
    formData.append("file", files);
    return new Promise((resolve, reject) => {
      axios
        .post("/houses/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // 创建预览 URL
          const previewUrl = URL.createObjectURL(files);
          // 创建上传项
          const uploadItem = {
            url: previewUrl,
            key: Date.now().toString(),
          };
          resolve(uploadItem);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  useEffect(() => {
    axios.get("/user").then(({ avatar, ...rest }) => {
      if (avatar) {
        setFileList([{ url: avatar }]);
        setTimeout(() => {
          console.log(fileList, "fileList");
        }, 3000);
      }
      form.setFieldsValue(rest);
    });
  }, [user?.id]);
  return (
    <>
      <SearchBar
        from="/my/user"
        absolute={false}
        cpnts={{
          map: false,
          select: false,
          share: false,
          title: "查看个人资料",
        }}
      />
      <Form
        form={form}
        className="py-4"
        layout="horizontal"
        onFinish={onFinish}
        footer={
          <>
            <Button
              type="submit"
              style={{
                backgroundColor: "var(--color-theme-green)",
                color: "#fff",
                width: "50%",
              }}
              size="middle"
            >
              修改
            </Button>
            <Button
              type="reset"
              style={{ backgroundColor: "#fff", width: "50%" }}
              size="middle"
              onClick={goBack}
            >
              取消
            </Button>
          </>
        }
      >
        <Form.Item name="nickname" label="昵称">
          <Input placeholder="请输入昵称" clearable />
        </Form.Item>
        <Form.Item name="gender" label="性别">
          <Radio.Group>
            <Radio
              style={{
                marginRight: "20px",
                "--icon-size": "18px",
                "--adm-color-primary": "var(--color-theme-green)",
              }}
              value="1"
            >
              男
            </Radio>
            <Radio
              style={{
                "--icon-size": "18px",
                "--adm-color-primary": "var(--color-theme-green)",
              }}
              value="0"
            >
              女
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="phone" label="电话">
          <Input placeholder="请输入电话" clearable />
        </Form.Item>
        <Form.Item name="avatar" label="头像">
          <ImageUploader
            maxCount={1}
            upload={upload}
            value={fileList}
            onChange={setFileList}
          />
        </Form.Item>
      </Form>
    </>
  );
};

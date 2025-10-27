/**
 * 安全的 Input 组件包装器 - 处理 null 值问题
 */

import { Input, InputProps } from "antd-mobile";
import { useMemo } from "react";

interface SafeInputProps extends Omit<InputProps, "value"> {
  value?: string | null;
  defaultValue?: string;
}

export const SafeInput: React.FC<SafeInputProps> = ({
  value,
  defaultValue = "",
  ...props
}) => {
  // 安全处理 value 值
  const safeValue = useMemo(() => {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    return value;
  }, [value, defaultValue]);

  return <Input {...props} value={safeValue} defaultValue={defaultValue} />;
};

// 导出默认组件
export default SafeInput;

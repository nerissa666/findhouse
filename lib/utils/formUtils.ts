/**
 * 表单工具函数 - 处理 null 值和数据清理
 */

/**
 * 清理对象中的 null 值
 * @param obj 要清理的对象
 * @param defaultValue 默认值，默认为空字符串
 * @returns 清理后的对象
 */
export const cleanNullValues = <T extends Record<string, any>>(
  obj: T,
  defaultValue: any = ""
): T => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === null || value === undefined ? defaultValue : value,
    ])
  ) as T;
};

/**
 * 清理表单数据，处理各种边界情况
 * @param data 表单数据
 * @returns 清理后的表单数据
 */
export const cleanFormData = <T extends Record<string, any>>(data: T): T => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      // 处理 null 和 undefined
      if (value === null || value === undefined) {
        return [key, ""];
      }

      // 处理数字类型
      if (typeof value === "number" && isNaN(value)) {
        return [key, ""];
      }

      // 处理字符串类型
      if (typeof value === "string") {
        return [key, value.trim()];
      }

      // 其他类型保持不变
      return [key, value];
    })
  ) as T;
};

/**
 * 安全的表单字段值设置
 * @param form Form 实例
 * @param values 要设置的值
 */
export const safeSetFieldsValue = (form: any, values: Record<string, any>) => {
  const cleanedValues = cleanFormData(values);
  form.setFieldsValue(cleanedValues);
};

/**
 * 获取表单默认值
 * @param fields 字段配置
 * @returns 默认值对象
 */
export const getFormDefaults = (fields: string[]): Record<string, string> => {
  return fields.reduce((acc, field) => {
    acc[field] = "";
    return acc;
  }, {} as Record<string, string>);
};

/**
 * 验证表单数据
 * @param data 表单数据
 * @param requiredFields 必填字段
 * @returns 验证结果
 */
export const validateFormData = (
  data: Record<string, any>,
  requiredFields: string[] = []
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  requiredFields.forEach((field) => {
    const value = data[field];
    if (!value || (typeof value === "string" && value.trim() === "")) {
      errors.push(`${field} 是必填项`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 处理 API 响应数据
 * @param response API 响应
 * @returns 清理后的数据
 */
export const processApiResponse = <T extends Record<string, any>>(
  response: T
): T => {
  return cleanFormData(response);
};

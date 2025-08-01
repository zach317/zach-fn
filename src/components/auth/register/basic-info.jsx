import React from "react";
import { Form, Input, Select, DatePicker } from "antd";
import {
  PASSWORD_PATTERN,
  USERNAME_PATTERN,
  NO_SPACER_PATTERN,
} from "utils/RegExp";
import { debounceReturn } from "utils/helpers";
import { checkUsername } from "@/auth/services";

const { Item } = Form;
const { Password } = Input;

const genderOptions = [
  { value: "男", label: "男" },
  { value: "女", label: "女" },
];

const handleCheckUsername = async (username) => {
  try {
    const res = await checkUsername({ username });
    return res;
  } catch {
    return false;
  }
};
const BasicInfo = () => {
  return (
    <>
      <Item
        label="用户名"
        name="username"
        rules={[
          { required: true, message: "请输入用户名" },
          {
            pattern: USERNAME_PATTERN,
            message: "用户名仅支持字母、数字、_和—且必须以字母开头,4-16位",
          },
          { validator: debounceReturn(handleCheckUsername) },
        ]}
      >
        <Input placeholder="请输入" />
      </Item>
      <Item
        label="昵称"
        name="nickname"
        rules={[
          { required: true, message: "请输入昵称" },
          { pattern: NO_SPACER_PATTERN, message: "不能含空格" },
        ]}
      >
        <Input maxLength={8} placeholder="请输入" />
      </Item>
      <Item
        label="密码"
        name="password"
        rules={[
          { required: true, message: "请输入密码" },
          {
            pattern: PASSWORD_PATTERN,
            message: "密码必须包含字母和数字，8-16位",
          },
          { pattern: NO_SPACER_PATTERN, message: "不能包含空格" },
        ]}
      >
        <Password placeholder="请输入" />
      </Item>
      <Item
        label="确认密码"
        name="rePassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "请确认密码" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              return value === getFieldValue("password")
                ? Promise.resolve()
                : Promise.reject(new Error("两次密码不一致"));
            },
          }),
        ]}
      >
        <Password placeholder="请输入" />
      </Item>
      <Item
        label="性别"
        name="gander"
        rules={[{ required: true, message: "请选择性别" }]}
      >
        <Select options={genderOptions} placeholder="请选择" />
      </Item>
      <Item
        label="出生年月"
        name="birth"
        rules={[{ required: true, message: "请选择出生年月" }]}
      >
        <DatePicker style={{ width: "100%" }} placeholder="请选择" />
      </Item>
    </>
  );
};

export default BasicInfo;

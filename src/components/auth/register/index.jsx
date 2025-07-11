import React from "react";
import { Form, Input, Select, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";
import {
  PASSWORD_PATTERN,
  USERNAME_PATTERN,
  NO_SPACER_PATTERN,
} from "utils/RegExp";
import { userRegister, checkUsername } from "@/auth/services";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { debounceReturn } from "utils/helpers";

const { Item, useForm } = Form;
const { Password } = Input;
const options = [
  { value: "男", label: "男" },
  { value: "女", label: "女" },
];

const Register = () => {
  const [form] = useForm();
  const { setLoading } = useOutletContext();
  const navigate = useNavigate();

  /**
   * 处理用户注册逻辑的函数
   *
   * 此函数通过表单验证获取用户输入的数据，格式化出生日期，并调用注册接口。
   * 如果注册成功，会显示提示信息并跳转至登录页面；失败则提示错误信息。
   */
  const handleRegister = () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      const { birth } = values;
      const time = dayjs(birth).format("YYYY-MM-DD");
      try {
        const res = await userRegister({ ...values, birth: time });
        setLoading(false);
        if (res.success) {
          message.success("注册成功，即将为您跳转登录页面");
          navigate("/login");
        }
      } catch (error) {
        message.warning(error.message);
        setLoading(false);
      }
    });
  };
  /**
   * 检查用户名是否已存在
   *
   * @param {string} username - 需要检查的用户名
   * @returns {Promise<boolean>} - 返回一个 Promise，解析为 true 表示用户名存在，false 表示不存在
   */
  const handleCheckUsername = async (username) => {
    try {
      const res = await checkUsername({ username });
      return res;
    } catch {
      return false;
    }
  };

  return (
    <>
      <div className="h1-title">注册</div>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 20,
        }}
        labelAlign="left"
        form={form}
      >
        <Item
          rules={[
            {
              required: true,
              message: "请输入用户名",
            },
            {
              pattern: USERNAME_PATTERN,
              message: "用户名仅支持字母、数字、_和—且必须以字母开头,4-16位",
            },
            {
              validator: debounceReturn(handleCheckUsername),
            },
          ]}
          label="用户名"
          name="username"
        >
          <Input placeholder="请输入" />
        </Item>
        <Item
          rules={[
            {
              required: true,
              message: "请输入昵称",
            },
            {
              pattern: NO_SPACER_PATTERN,
              message: "不能输入空格",
            },
          ]}
          label="昵称"
          name="nickname"
        >
          <Input maxLength={8} placeholder="请输入" />
        </Item>
        <Item
          rules={[
            {
              required: true,
              message: "请输入密码",
            },
            {
              pattern: PASSWORD_PATTERN,
              message: "密码必须包含数字和字母,8-16位",
            },
            {
              pattern: NO_SPACER_PATTERN,
              message: "不能输入空格",
            },
          ]}
          label="密码"
          name="password"
        >
          <Password placeholder="请输入" />
        </Item>
        <Item
          rules={[
            {
              required: true,
              message: "请输入确认密码",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("两次密码输入不一致"));
              },
            }),
          ]}
          label="确认密码"
          dependencies={["password"]}
          name="rePassword"
        >
          <Password placeholder="请输入" />
        </Item>
        <Item
          rules={[
            {
              required: true,
              message: "请选择性别",
            },
          ]}
          label="性别"
          name="gander"
        >
          <Select placeholder="请选择" options={options} />
        </Item>
        <Item
          rules={[
            {
              required: true,
              message: "请选择出生年月",
            },
          ]}
          label="出生年月"
          name="birth"
        >
          <DatePicker placeholder="请选择" style={{ width: "100%" }} />
        </Item>
      </Form>
      <Button className="user-button" onClick={handleRegister} type="primary">
        注册
      </Button>
      <div className="link-text">
        已有账号？去
        <Link className="link-a" to="/login">
          登录
        </Link>
      </div>
    </>
  );
};
export default Register;

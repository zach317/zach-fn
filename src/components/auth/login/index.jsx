import React from "react";
import { Button, Form, Input,message } from "antd";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { userLogin } from "@/auth/services";
import crypto from "utils/crypto";

const { useForm, Item } = Form;
const { Password } = Input;

const Login = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const { setLoading } = useOutletContext();

  const handleLogin = () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      try {
        const res = await userLogin(values);
        setLoading(false);
        if (res.success) {
          const userId = crypto.encrypt(res.data);
          localStorage.setItem("userId", userId);
          message.success("登录成功");
          navigate("/");
          return;
        }
        message.warning(res.message);
      } catch (error) {
        setLoading(false);
      }
    });
  };

  return (
    <>
      <div className="h1-title">登录</div>
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
              message: "请输入密码",
            },
          ]}
          label="密码"
          name="password"
        >
          <Password placeholder="请输入" />
        </Item>
      </Form>
      <Button className="user-button" onClick={handleLogin} type="primary">
        登录
      </Button>
      <div className="link-text">
        还没账号？去
        <Link className="link-a" to="/register">
          注册
        </Link>
      </div>
    </>
  );
};
export default Login;

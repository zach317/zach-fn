import React, { useState } from "react";
import { Form, Steps, Button, message } from "antd";
import dayjs from "dayjs";
import { useOutletContext, useNavigate } from "react-router-dom";
import { userRegister } from "@/auth/services";
import BasicInfo from "./basic-info";
import SecurityInfo from "./security-info";

const { useForm } = Form;

const Register = () => {
  const [form] = useForm();
  const [current, setCurrent] = useState(0);
  const { setLoading } = useOutletContext();
  const navigate = useNavigate();

  const handleNext = () => {
    form
      .validateFields([
        "username",
        "nickname",
        "password",
        "rePassword",
        "gender", 
        "birth",
      ])
      .then(() => setCurrent((prev) => prev + 1));
  };

  const handlePrev = () => setCurrent((prev) => prev - 1);

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      const payload = {
        ...values,
        birth: dayjs(values.birth).format("YYYY-MM-DD"),
      };
      try {
        const res = await userRegister(payload);
        if (res.success) {
          message.success("注册成功，即将跳转登录");
          navigate("/login");
        } else {
          message.error(res.message || "注册失败");
        }
      } catch (err) {
        message.error(err.message || "请求失败");
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <>
      <div className="h1-title">注册</div>
      <Steps current={current} style={{ marginBottom: 24 }}>
        <Steps.Step title="基本信息" />
        <Steps.Step title="安全设置" />
      </Steps>

      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        layout="horizontal"
        scrollToFirstError
        autoComplete="off"
        labelAlign="left"
      >
        <div style={{ display: current === 0 ? "block" : "none" }}>
          <BasicInfo />
        </div>

        <div style={{ display: current === 1 ? "block" : "none" }}>
          <SecurityInfo />
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          {current > 0 && (
            <Button style={{ marginRight: 16 }} onClick={handlePrev}>
              上一步
            </Button>
          )}
          {current < 1 ? (
            <Button type="primary" onClick={handleNext}>
              下一步
            </Button>
          ) : (
            <Button type="primary" onClick={handleSubmit}>
              提交注册
            </Button>
          )}
        </div>
      </Form>

      <div className="link-text" style={{ marginTop: 24 }}>
        已有账号？去 <a href="/login">登录</a>
      </div>
    </>
  );
};

export default Register;

import React, { useState, useEffect } from "react";
import { Input, Select, Form } from "antd";
import { getSecurityQuestions } from "../services";

const { TextArea } = Input;
const { Item } = Form;

const SecurityInfo = () => {
  const [securityQuestions, setSecurityQuestions] = useState([]);

  useEffect(() => {
    getSecurityQuestions().then((res) => {
      if (res.success) setSecurityQuestions(res.data);
    });
  }, []);

  return (
    <>
      <Item
        label="数字密保"
        name="securityNumber"
        rules={[
          { required: true, message: "请输入数字密保" },
          { pattern: /^[0-9]+$/, message: "只能输入数字" },
          {
            validator: (_, value) => {
              const num = parseInt(value, 10);
              return num >= 0 && num <= 1000
                ? Promise.resolve()
                : Promise.reject("必须在 0-1000 范围内");
            },
          },
        ]}
      >
        <Input maxLength={4} placeholder="请输入" />
      </Item>
      <Item
        label="字母密保"
        name="securityLetter"
        rules={[
          { required: true, message: "请输入字母密保" },
          { pattern: /^[a-zA-Z]{1,3}$/, message: "1-3 个英文字母" },
        ]}
      >
        <Input maxLength={3} placeholder="请输入" />
      </Item>
      <Item
        label="密保问题"
        name="securityQuestionId"
        rules={[{ required: true, message: "请选择密保问题" }]}
      >
        <Select placeholder="请选择">
          {securityQuestions.map((q) => (
            <Select.Option key={q.id} value={q.id}>
              {q.question}
            </Select.Option>
          ))}
        </Select>
      </Item>
      <Item
        label="密保答案"
        name="security_answer"
        rules={[
          { required: true, message: "请输入答案" },
          { pattern: /^[^<>'"&]*$/, message: "不能包含特殊字符" },
        ]}
      >
        <Input maxLength={30} placeholder="请输入" />
      </Item>
      <Item
        label="自定义问题"
        name="customQuestion"
        rules={[
          { required: true, message: "请输入问题" },
          { pattern: /^[^<>'"&]*$/, message: "不能包含特殊字符" },
        ]}
      >
        <TextArea rows={2} maxLength={100} placeholder="请输入" />
      </Item>
      <Item
        label="自定义答案"
        name="customAnswer"
        rules={[
          { required: true, message: "请输入答案" },
          { pattern: /^[^<>'"&]*$/, message: "不能包含特殊字符" },
        ]}
      >
        <Input maxLength={30} placeholder="请输入" />
      </Item>
    </>
  );
};

export default SecurityInfo;

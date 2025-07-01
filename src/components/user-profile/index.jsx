import React, { useState, useMemo } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import dayjs from "dayjs";
import { useOutletContext } from "react-router-dom";
import { checkUsername, updateUserInfo } from "./services";
import { USERNAME_PATTERN, NO_SPACER_PATTERN } from "utils/RegExp";
import { debounceReturn } from "utils/helpers";
import "./index.less";

const { Item, useForm } = Form;
const options = [
  { value: "男", label: "男" },
  { value: "女", label: "女" },
];

const UserProfile = () => {
  const { user, getUserinfoFunc = () => {} } = useOutletContext();
  const [isEdit, setIsEdit] = useState(false);
  const [form] = useForm();

  const formatBirth = (date) => dayjs(date).format("YYYY-MM-DD");

  const handleEdit = () => {
    form.setFieldsValue({
      ...user,
      birth: dayjs(user.birth),
    });
    setIsEdit(true);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const res = await updateUserInfo({
            ...values,
            birth: formatBirth(values.birth),
          });
          if (res.success) {
            await getUserinfoFunc();
            message.success("资料修改成功");
          }
          setIsEdit(false);
        } catch (error) {
          message.warning(error.message);
        }
      })
      .catch(() => {
        message.warning("表单验证失败");
      });
  };

  const handleDataPickerChange = (value) => {
    const birthday = dayjs(value).valueOf();
    const today = dayjs().valueOf();
    const age = Math.floor((today - birthday) / 1000 / 86400 / 365);
    form.setFieldsValue({ age });
  };

  // 使用 debounceReturn 包装用户名校验逻辑
  const handleCheckUsername = useMemo(() => {
    return debounceReturn(async (_, value) => {
      if (!value) return Promise.reject(new Error("请输入用户名"));
      if (value === user.username) return Promise.resolve();
      const res = await checkUsername({ name: value });
      if (res.success) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(res.message));
    }, user.username);
  }, [user.username]);

  const dataShow = useMemo(
    () => [
      {
        name: "用户名",
        title: "username",
        rules: [
          { required: true, message: "请输入用户名" },
          {
            pattern: USERNAME_PATTERN,
            message: "用户名仅支持字母、数字、_和—且必须以字母开头,4-16位",
          },
          { validator: handleCheckUsername },
        ],
      },
      {
        name: "昵称",
        title: "nickname",
        rules: [
          { required: true, message: "请输入昵称" },
          { pattern: NO_SPACER_PATTERN, message: "不能输入空格" },
        ],
      },
      {
        name: "年龄",
        title: "age",
        disabled: true,
      },
      {
        name: "性别",
        title: "gender",
        render: <Select options={options} />,
      },
      {
        name: "生日",
        title: "birth",
        render: (
          <DatePicker
            onChange={handleDataPickerChange}
            style={{ width: "100%" }}
          />
        ),
      },
    ],
    [handleCheckUsername]
  );

  const ShowEl = useMemo(
    () => (
      <div className="show-wrap">
        {dataShow.map((item) => (
          <div key={item.title} className="show-item">
            <span className="show-label">{item.name}:</span>
            <span className="show-value">
              {item.title === "birth"
                ? formatBirth(user.birth)
                : user[item.title]}
            </span>
          </div>
        ))}
      </div>
    ),
    [dataShow, user]
  );

  const FormEl = useMemo(
    () => (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        labelAlign="left"
        form={form}
        initialValues={{
          ...user,
          birth: dayjs(user.birth),
        }}
        requiredMark={false}
      >
        {dataShow.map((item) => (
          <Item
            rules={item.rules}
            name={item.title}
            key={item.name}
            label={item.name}
          >
            {item.render || (
              <Input
                className={isEdit ? "edit" : ""}
                disabled={item.disabled || !isEdit}
              />
            )}
          </Item>
        ))}
      </Form>
    ),
    [dataShow, user, isEdit, form]
  );

  return (
    <div className="user-profile-wrap">
      <div className="user-profile-left user-profile-item light-line">
        <div className="user-category-wrap">
          <div className="category-item">
            <span className="category-label">交易数量</span>
            <span className="category-value">100000</span>
          </div>
          <div className="category-item">
            <span className="category-label">记账天数</span>
            <span className="category-value">100000</span>
          </div>
          <div className="category-item">
            <span className="category-label">帐本数量</span>
            <span className="category-value">100000</span>
          </div>
          <div className="category-item">
            <span className="category-label">累计积分</span>
            <span className="category-value">100000</span>
          </div>
        </div>
      </div>
      <div className="user-profile-right user-profile-item light-line">
        {isEdit ? FormEl : ShowEl}
        <div className="btn-group">
          <Button
            className="btn"
            onClick={isEdit ? handleSubmit : handleEdit}
            type="primary"
          >
            {isEdit ? "提交" : "编辑"}
          </Button>
          {isEdit && (
            <Button className="btn" onClick={() => setIsEdit(false)}>
              取消
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

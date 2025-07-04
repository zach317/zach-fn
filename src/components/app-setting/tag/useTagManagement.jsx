import { useState, useCallback, useEffect } from "react";
import { message, Form } from "antd";
import { addTag, getTags, updateTag, deleteTag } from "./services";
import crypto from "utils/crypto";

const useTagManagement = () => {
  const [form] = Form.useForm();
  const [editingTag, setEditingTag] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [tags, setTags] = useState([]);

  const setLocalStorage = (data) => {
    localStorage.setItem("tags", crypto.encrypt(JSON.stringify(data)));
  };

  // 数据获取
  const fetchData = useCallback(async () => {
    const tags = localStorage.getItem("tags");
    if (!tags) {
      try {
        const res = await getTags();
        setTags(res.data || []);
        setLocalStorage(res.data);
      } catch (error) {
        message.error(error.message);
      }
      return;
    }
    setTags(JSON.parse(crypto.decrypt(tags)) || []);
  }, []);

  // 初始化加载和tab切换时获取数据
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 处理添加标签
  const handleAdd = useCallback(
    (parentId = "", level = 1) => {
      setEditingTag({
        parentId,
        isNew: true,
        level,
        isSubTag: !!parentId,
      });
      setModalVisible(true);
      form.resetFields();
      // 设置默认颜色
      form.setFieldsValue({
        color: "#0eb0c9",
      });
    },
    [form]
  );

  // 处理删除标签
  const handleDelete = useCallback(
    async (tagId) => {
      const res = await deleteTag({ tagId });
      if (res.success) {
        setTags(res.data);
        setLocalStorage(res.data);
        message.success("删除成功");
      }
    },
    [setTags]
  );

  // 处理编辑标签
  const handleEdit = useCallback(
    (tag, parentId = "") => {
      console.log("🚀 ~ useTagManagement ~ tag:", tag);
      setEditingTag({
        ...tag,
        parentId,
        isNew: false,
        isSubTag: !!parentId,
      });
      setModalVisible(true);
      form.setFieldsValue({
        name: tag.name,
        color: tag.color,
      });
    },
    [form, setEditingTag, setModalVisible]
  );

  // 处理表单提交
  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const { name, color } = values;

      if (editingTag.isNew) {
        // 添加新标签
        const newTag = {
          name,
          color: typeof color === "string" ? color : color.toHexString(),
          level: editingTag.level,
          parentId: editingTag.parentId,
        };

        const res = await addTag(newTag);
        if (res.success) {
          setTags(res.data);
          setLocalStorage(res.data);
          message.success("添加成功");
        }
      } else {
        // 编辑标签
        const updatedColor =
          typeof color === "string" ? color : color.toHexString();
        const res = await updateTag({
          tagId: editingTag.id,
          name,
          color: updatedColor,
        });

        if (res.success) {
          message.success("修改成功");
          setTags(res.data);
          setLocalStorage(res.data);
        }
      }

      setModalVisible(false);
      setEditingTag({});
    } catch (error) {
      if (error.errorFields) {
        message.error("请检查表单输入");
      } else {
        message.error("操作失败");
      }
    }
  }, [
    form,
    editingTag.isNew,
    editingTag.level,
    editingTag.parentId,
    editingTag.id,
  ]);

  const handleCancel = () => {
    setModalVisible(false);
    setEditingTag({});
    form.resetFields();
  };

  return {
    form,
    handleAdd,
    editingTag,
    modalVisible,
    handleSubmit,
    tags,
    handleEdit,
    handleDelete,
    handleCancel,
  };
};

export default useTagManagement;

import React, { useState, useCallback } from "react";
import { Modal, message } from "antd";
import crypto from "utils/crypto";
import { getAllCatrgories, getTags } from "../services";
// import {
//   addTransaction,
//   updateTransaction,
//   deleteTransaction,
// } from "../services";
import "./index.less";

const TransactionModal = ({ visible, onClose, editData = null }) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [transactionType, setTransactionType] = useState("expense");

  // 获取分类数据
  const getCategories = useCallback(async () => {
    const categoryStorage = localStorage.getItem("categories");
    if (categoryStorage) {
      const categories = crypto.decrypt(categoryStorage);
      if (categories.expense && categories.income) {
        setCategories(categories);
      } else {
        await fetchCategories();
      }
    } else {
      await fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAllCatrgories();
      if (res.success) {
        setCategories(res.data);
        localStorage.setItem("categories", crypto.encrypt(res.data));
      }
    } catch (error) {
      message.warning(error.message);
    }
  };

  // 获取标签数据
  const getTagList = useCallback(async () => {
    const tagStorage = localStorage.getItem("tags");
    if (tagStorage) {
      const tags = crypto.decrypt(tagStorage);
      setTags(tags);
    } else {
      try {
        const res = await getTags();
        if (res.success) {
          setTags(res.data);
          localStorage.setItem("tags", crypto.encrypt(res.data));
        }
      } catch (error) {
        message.warning(error.message);
      }
    }
  }, []);

  // 删除交易
  const handleDelete = async () => {
    if (!editData?.id) return;

    try {
      // await deleteTransaction(editData.id);
      message.success("删除成功");
      onClose();
    } catch (error) {
      message.error(error.message || "删除失败");
    }
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          {editData ? "编辑" : "添加"}
          {transactionType === "income" ? "收入" : "支出"}
        </div>
      }
      open={visible}
      onCancel={onClose}
      className="transaction-modal"
      destroyOnClose
    >
      <div className="transaction-modal-wrap"></div>
    </Modal>
  );
};

export default TransactionModal;

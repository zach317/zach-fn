import React from "react";
import { Modal } from "antd";
import "./index.less";

const TransactionModal = ({ visible }) => {
  return (
    <Modal visible={visible}>
      <div className="transaction-modal-wrap">TransactionModal</div>;
    </Modal>
  );
};

export default TransactionModal;

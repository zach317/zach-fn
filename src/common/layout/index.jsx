import React, { useState, useEffect } from "react";
import Header from "#/header";
import { Outlet } from "react-router-dom";
import { getUserinfo } from "./services";
import crypto from "utils/crypto";
import { message } from "antd";
const Layout = () => {
  const [user, setUser] = useState({});
  const id = localStorage.getItem("userId");
  const userId = id && crypto.decrypt(id);
  const getUserinfoFunc = async () => {
    try {
      const res = await getUserinfo();
      if (res?.success) {
        setUser(res.data);
        localStorage.setItem(
          "userInfo",
          crypto.encrypt(JSON.stringify(res.data))
        );
      }
    } catch (error) {
      message.warning(error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserinfoFunc();
    }
  }, [userId]);
  return (
    <div>
      <Header user={user} />
      <Outlet context={{ user, getUserinfoFunc }} />
    </div>
  );
};

export default Layout;

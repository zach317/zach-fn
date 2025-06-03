import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div>
      用户页面
      <Outlet />
    </div>
  );
};
export default UserLayout;

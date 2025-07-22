import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "@/auth/register";
import UserLayout from "@/auth/user-layout";
import Login from "@/auth/login";
import Layout from "#/layout";
import Home from "@/home";
import UserProfile from "@/user-profile";
import AppSettingLayout from "@/app-setting/layout";
import AppSetting from "@/app-setting";
import Category from "@/app-setting/category";
import Tag from "@/app-setting/tag";
import Transaction from "@/transaction";
import Analysis from "@/analysis";

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/setting" element={<AppSettingLayout />}>
          <Route path="/setting" element={<AppSetting />} />
          <Route path="/setting/category" element={<Category />} />
          <Route path="/setting/tag" element={<Tag />} />
        </Route>
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/analysis" element={<Analysis />} />
      </Route>
    </Routes>
  );
};

export default App;

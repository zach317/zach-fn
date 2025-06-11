import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "@/auth/register";
import UserLayout from "@/auth/user-layout";
import Login from "@/auth/login";
import Layout from "#/layout";
import Home from "@/home";
import UserProfile from "@/user-profile";

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
      </Route>
    </Routes>
  );
};

export default App;

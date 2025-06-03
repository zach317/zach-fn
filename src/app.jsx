import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "@/auth/register";
import UserLayout from "@/auth/user-layout";
import Login from "@/auth/login";

const App = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
};

export default App;
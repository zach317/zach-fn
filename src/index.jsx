import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.less";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);

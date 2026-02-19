import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Products from "./pages/Products";
import VerifyOtp from "./pages/VerifyOtp";
import Category from "./pages/Category";
import FileUpload from "./pages/FileUpload"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/products" element={<Products />} />
      <Route path="/category" element={<Category />} />
      <Route path="/fileUpload" element={<FileUpload />} />
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
  // return <h1>Hello</h1>;
}

export default App;

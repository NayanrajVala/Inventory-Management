import { useState } from "react";
import api from "../api";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || localStorage.getItem("email");
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(email, otp);
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      console.log("Otp Verified");
      navigate("/login")
    } catch (err: any) {
      console.log("Error Hit");
      console.log(err.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Enter Otp sent on email</p>
      <input
        value={otp}
        placeholder="Enter Otp here"
        onChange={(e) => {
          setOtp(e.target.value);
        }}
      />

      <button type="submit">Verify</button>
    </form>
  );
}

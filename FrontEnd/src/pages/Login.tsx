import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, user } = res.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login Successfull");
      navigate("/products");
    } catch (err: any) {
      console.log(err);
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div>
      <h2>Login </h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

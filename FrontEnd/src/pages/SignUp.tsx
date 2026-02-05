import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    // e.preventDefault();

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", form);
      localStorage.setItem("email", form.email);

      console.log(res.data);

      navigate("/verify-otp", {
        state: { email: form.email },
      });
    } catch (err: any) {
      console.log(err.response.data);
    }
  };

  return (
    <div>
      <h1>Signup Page</h1>
      <form onSubmit={handleSubmit}>
        <input name="email" onChange={handleChange} placeholder="Email" />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit">SignUp</button>
      </form>
    </div>
  );
}

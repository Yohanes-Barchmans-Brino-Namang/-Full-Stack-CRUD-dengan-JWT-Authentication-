import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", formData);
      
      // Ambil token dari response backend (sesuaikan nama propertinya jika berbeda)
      const token = response.data.accessToken || response.data.access_token;
      
      if (token) {
        // Simpan token ke localStorage dengan key yang disepakati
        localStorage.setItem("accessToken", token);
        // Arahkan ke halaman utama (produk)
        navigate("/");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Email atau password salah.");
      } else {
        setError("Terjadi kesalahan pada server.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Login</h2>
      
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label>Email:</label><br/>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div>
          <label>Password:</label><br/>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        
        <button type="submit" style={{ padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Login
        </button>
      </form>
      
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance"; // Sesuaikan path dengan axiosInstance Anda

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    try {
      // Memanggil endpoint register yang baru saja kita buat di backend
      const response = await api.post("/auth/register", formData);
      
      setSuccess("Registrasi berhasil! Silakan login.");
      
      // Tunggu 2 detik, lalu arahkan ke halaman login
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      // Error handling sesuai spesifikasi tugas (409 untuk duplikat)
      if (err.response?.status === 409) {
        setError("Email sudah terdaftar. Silakan gunakan email lain.");
      } else {
        setError(err.response?.data?.message || "Terjadi kesalahan saat registrasi.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Register</h2>
      
      {/* Menampilkan pesan error atau sukses */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label>Nama:</label><br/>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
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
        
        <button type="submit" style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Daftar
        </button>
      </form>
      
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Sudah punya akun? <Link to="/login">Login di sini</Link>
      </p>
    </div>
  );
};

export default Register;
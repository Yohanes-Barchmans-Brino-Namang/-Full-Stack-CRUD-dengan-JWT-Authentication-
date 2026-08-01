import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

export default function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", price: "", stock: "", description: "" });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Gagal memuat produk:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update produk (PUT)
        await api.put(`/products/${editId}`, form);
      } else {
        // Tambah produk (POST)
        await api.post("/products", form);
      }
      setForm({ name: "", price: "", stock: "", description: "" });
      setEditId(null);
      fetchProducts(); // Refresh tabel
    } catch (error) {
      alert("Gagal menyimpan data produk.");
    }
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, price: product.price, stock: product.stock, description: product.description });
    setEditId(product.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts(); // Refresh tabel
      } catch (error) {
        alert("Gagal menghapus data.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Manajemen Produk (CRUD)</h2>
        <button onClick={handleLogout} style={{ padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Logout
        </button>
      </div>
      <hr style={{ marginBottom: "20px" }} />

      {/* FORM TAMBAH / EDIT PRODUK */}
      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>{editId ? "Edit Produk" : "Tambah Produk Baru"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input type="text" name="name" placeholder="Nama Produk" value={form.name} onChange={handleInputChange} required style={{ padding: "8px" }} />
          <input type="number" name="price" placeholder="Harga" value={form.price} onChange={handleInputChange} required style={{ padding: "8px" }} />
          <input type="number" name="stock" placeholder="Stok" value={form.stock} onChange={handleInputChange} required style={{ padding: "8px", width: "80px" }} />
          <input type="text" name="description" placeholder="Deskripsi Singkat" value={form.description} onChange={handleInputChange} required style={{ padding: "8px", flex: 1 }} />
          <button type="submit" style={{ padding: "8px 16px", backgroundColor: editId ? "#ffc107" : "#28a745", color: editId ? "black" : "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            {editId ? "Simpan Perubahan" : "Simpan Produk"}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm({ name: "", price: "", stock: "", description: "" }); }} style={{ padding: "8px 16px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Batal</button>
          )}
        </form>
      </div>
      
      {/* TABEL PRODUK */}
      <div>
        <h3>Daftar Produk</h3>
        {loading ? <p>Memuat data produk...</p> : products.length === 0 ? <p>Belum ada produk.</p> : (
          <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th>No</th><th>Nama Produk</th><th>Harga</th><th>Stok</th><th>Deskripsi</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td><td>{item.name}</td><td>Rp {item.price}</td><td>{item.stock}</td><td>{item.description}</td>
                  <td>
                    <button onClick={() => handleEdit(item)} style={{ marginRight: "10px", padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer" }}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import api from "../api/axiosInstance";

function ProductForm({ product, onSuccess, onCancel }) {
  const isEdit = !!product;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "uncategorized",
    stock: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prepopulate form jika edit
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        description: product.description || "",
        category: product.category || "uncategorized",
        stock: product.stock || 0,
      });
    }
  }, [product]);
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (!formData.name.trim()) {
      setError("Nama produk wajib diisi");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setError("Harga harus lebih dari 0");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      if (isEdit) {
        // PUT Request - Update produk
        await api.put(`/api/v1/products/${product.id}`, formData);
        alert("✅ Produk berhasil diupdate!");
      } else {
        // POST Request - Tambah produk
        await api.post("/api/v1/products", formData);
        alert("✅ Produk berhasil ditambahkan!");
      }
      onSuccess(); // Refetch data
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err.response?.data?.message || "Gagal menyimpan produk");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={styles.errorMessage}>⚠️ {error}</div>}
      <div style={styles.formGroup}>
        <label style={styles.label}>Nama Produk *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Masukkan nama produk"
          style={styles.input}
          disabled={loading}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Harga (Rp) *</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="0"
          min="0"
          step="1000"
          style={styles.input}
          disabled={loading}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Deskripsi</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Masukkan deskripsi produk"
          rows="3"
          style={styles.textarea}
          disabled={loading}
        />
      </div>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Kategori</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={styles.input}
            disabled={loading}
          >
            <option value="uncategorized">Uncategorized</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="food">Food</option>
            <option value="books">Books</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Stok</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            min="0"
            style={styles.input}
            disabled={loading}
          />
        </div>
      </div>
      <div style={styles.buttonGroup}>
        <button
          type="button"
          onClick={onCancel}
          style={styles.cancelButton}
          disabled={loading}
        >
          Batal
        </button>
        <button type="submit" style={styles.submitButton} disabled={loading}>
          {loading
            ? "Menyimpan..."
            : isEdit
              ? "Update Produk"
              : "Tambah Produk"}
        </button>
      </div>
    </form>
  );
}
const styles = {
  errorMessage: {
    backgroundColor: "#f8d7da",
    color: "#dc3545",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  formGroup: {
    marginBottom: "15px",
    flex: 1,
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  formRow: {
    display: "flex",
    gap: "15px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  submitButton: {
    padding: "10px 24px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  cancelButton: {
    padding: "10px 24px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default ProductForm;

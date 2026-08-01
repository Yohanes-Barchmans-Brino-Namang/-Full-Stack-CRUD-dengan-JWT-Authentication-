import { useState, useEffect, useCallback } from "react";
import api from "../api/axiosInstance";
import Modal from "../components/Modal";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // State untuk modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Fetch data dari API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("products");
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  // Handle tambah produk baru
  const handleAddProduct = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };
  // Handle edit produk
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };
  // Handle hapus produk
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/api/v1/products/${id}`);
      alert("✅ Produk berhasil dihapus!");
      await fetchProducts(); // Refetch data
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("❌ Gagal menghapus produk");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle sukses submit (tambah/edit)
  const handleFormSuccess = async () => {
    setModalOpen(false);
    setEditingProduct(null);
    await fetchProducts(); // Refetch data
  };
  // Handle close modal
  const handleCloseModal = () => {
    if (isSubmitting) return;
    setModalOpen(false);
    setEditingProduct(null);
  };
  /* Filter produk berdasarkan search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );*/
  const filteredProducts = products.filter((product) => {
  const keyword = searchTerm.toLowerCase();
  const matchName = product.name?.toLowerCase().includes(keyword);
  const matchDesc = product.description?.toLowerCase().includes(keyword);

  return matchName || matchDesc;
});
  // Loading State
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading products...</p>
      </div>
    );
  }
  // Error State
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <button onClick={fetchProducts} style={styles.retryButton}>
          � � Coba Lagi
        </button>
      </div>
    );
  }
  // Success State
  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <div>
          <h1>📦 Daftar Produk</h1>
          <p style={styles.totalProducts}>Total produk: {products.length}</p>
        </div>
        <button onClick={handleAddProduct} style={styles.addButton}>
          ➕ Tambah Produk
        </button>
      </div>
      {/* Search & Refresh */}
      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="🔍 Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button onClick={fetchProducts} style={styles.refreshButton}>
          � � Refresh
        </button>
      </div>
      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div style={styles.emptyState}>
          {searchTerm ? (
            <p>Tidak ada produk yang cocok dengan pencarian "{searchTerm}"</p>
          ) : (
            <div>
              <p style={styles.emptyIcon}>📭</p>
              <p>Belum ada produk. Klik "Tambah Produk" untuk menambahkan!</p>
            </div>
          )}
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}
      {/* Modal Tambah/Edit Produk */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? "✏️ Edit Produk" : "➕ Tambah Produk Baru"}
      >
        <ProductForm
          product={editingProduct}
          onSuccess={handleFormSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
      {/* Loading overlay saat submit */}
      {isSubmitting && (
        <div style={styles.submitOverlay}>
          <div style={styles.spinnerSmall}></div>
          <p>Memproses...</p>
        </div>
      )}
    </div>
  );
}
// CSS Styles
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  spinnerSmall: {
    width: "30px",
    height: "30px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorContainer: {
    textAlign: "center",
    padding: "40px",
  },
  retryButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  totalProducts: {
    color: "#888",
    marginTop: "4px",
  },
  addButton: {
    padding: "12px 24px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background 0.2s",
  },
  toolbar: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  searchInput: {
    flex: 1,
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
  },
  refreshButton: {
    padding: "12px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#888",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "10px",
  },
  submitOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    color: "white",
  },
};

// Keyframes animation
const styleSheet = document.createElement("style");
styleSheet.textContent = ` 
  @keyframes spin { 
    0% { transform: rotate(0deg); } 
    100% { transform: rotate(360deg); } 
  } 
  .add-btn:hover { background: #218838; } 
  .refresh-btn:hover { background: #5a6268; } 
`;
document.head.appendChild(styleSheet);

export default ProductList;

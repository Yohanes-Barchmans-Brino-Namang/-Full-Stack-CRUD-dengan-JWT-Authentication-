function ProductCard({ product, onEdit, onDelete }) {
  const priceFormatted = Number(product.price).toLocaleString();

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.name}>{product.name}</h3>
        <div style={styles.actions}>
          <button
            onClick={() => onEdit(product)}
            style={styles.editButton}
            title="Edit produk"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(product.id)}
            style={styles.deleteButton}
            title="Hapus produk"
          >
            🗑️
          </button>
        </div>
      </div>
      <p style={styles.price}>💰 Rp {priceFormatted}</p>
      {product.description && (
        <p style={styles.description}>{product.description}</p>
      )}
      <div style={styles.footer}>
        <span style={styles.category}>📁 {product.category}</span>
        <span style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
          {product.stock > 0 ? `✅ Stok: ${product.stock}` : "❌ Stok Habis"}
        </span>
      </div>
    </div>
  );
}
const styles = {
  card: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    border: "1px solid #eee",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  name: {
    margin: 0,
    fontSize: "18px",
    color: "#333",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  editButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    padding: "4px 8px",
    borderRadius: "5px",
    transition: "background 0.2s",
  },
  deleteButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    padding: "4px 8px",
    borderRadius: "5px",
    transition: "background 0.2s",
  },
  price: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#28a745",
    margin: "4px 0",
  },
  description: {
    color: "#666",
    fontSize: "14px",
    margin: "8px 0",
    lineHeight: "1.5",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px solid #eee",
  },
  category: {
    fontSize: "12px",
    color: "#666",
    backgroundColor: "#f0f0f0",
    padding: "4px 12px",
    borderRadius: "20px",
  },
  inStock: {
    fontSize: "12px",
    color: "#28a745",
    fontWeight: "bold",
  },
  outOfStock: {
    fontSize: "12px",
    color: "#dc3545",
    fontWeight: "bold",
  },
};

// Tambahkan hover effect dengan CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = ` 
  .product-card:hover { 
    transform: translateY(-4px); 
    box-shadow: 0 4px 16px rgba(0,0,0,0.15); 
  } 
  .product-card .edit-btn:hover { 
    background: #e3f2fd; 
  } 
  .product-card .delete-btn:hover { 
    background: #fde8e8; 
  } 
`;
document.head.appendChild(styleSheet);

export default ProductCard;

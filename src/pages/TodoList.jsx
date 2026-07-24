import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import Modal from '../components/Modal';
import TodoForm from '../components/TodoForm';
import TodoCard from '../components/TodoCard';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fitur Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'completed'

  // State Modal & Aksi
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil Data (GET /api/v1/todos)
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/v1/todos');
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError(err.response?.data?.message || 'Gagal mengambil data tugas dari server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Tambah Todo Baru
  const handleAddTodo = () => {
    setEditingTodo(null);
    setModalOpen(true);
  };

  // Edit Todo
  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setModalOpen(true);
  };

  // Toggle Status Selesai (PUT)
  const handleToggleComplete = async (id, newCompletedStatus) => {
    try {
      await api.put(`/api/v1/todos/${id}`, { completed: newCompletedStatus });
      await fetchTodos();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('❌ Gagal memperbarui status tugas');
    }
  };

  // Hapus Todo (DELETE)
  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Yakin ingin menghapus tugas ini?')) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/api/v1/todos/${id}`);
      alert('✅ Tugas berhasil dihapus!');
      await fetchTodos();
    } catch (err) {
      console.error('Error deleting todo:', err);
      alert('❌ Gagal menghapus tugas');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSuccess = async () => {
    setModalOpen(false);
    setEditingTodo(null);
    await fetchTodos();
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setModalOpen(false);
    setEditingTodo(null);
  };

  // Logika Filter & Search
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterStatus === 'active') return matchesSearch && !todo.completed;
    if (filterStatus === 'completed') return matchesSearch && todo.completed;
    return matchesSearch; // 'all'
  });

  // Conditional Rendering: Loading State
  if (loading && todos.length === 0) {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.spinner}></div>
        <p>Memuat daftar tugas...</p>
      </div>
    );
  }

  // Conditional Rendering: Error State
  if (error && todos.length === 0) {
    return (
      <div style={styles.centerContainer}>
        <h2>⚠️ Terjadi Kesalahan</h2>
        <p>{error}</p>
        <button onClick={fetchTodos} style={styles.retryButton}>🔄 Coba Lagi</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerSection}>
        <div>
          <h1 style={styles.appTitle}>📝 Full-Stack Todo App</h1>
          <p style={styles.totalText}>Total tugas: {todos.length}</p>
        </div>
        <button onClick={handleAddTodo} style={styles.addButton}>
          ➕ Tambah Tugas
        </button>
      </div>

      {/* Toolbar: Search & Filter */}
      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="🔍 Cari tugas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.filterButtons}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{ ...styles.filterBtn, backgroundColor: filterStatus === 'all' ? '#007bff' : '#e0e0e0', color: filterStatus === 'all' ? 'white' : '#333' }}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            style={{ ...styles.filterBtn, backgroundColor: filterStatus === 'active' ? '#ffc107' : '#e0e0e0', color: filterStatus === 'active' ? '#333' : '#333' }}
          >
            Aktif
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            style={{ ...styles.filterBtn, backgroundColor: filterStatus === 'completed' ? '#28a745' : '#e0e0e0', color: filterStatus === 'completed' ? 'white' : '#333' }}
          >
            Selesai
          </button>
        </div>
        <button onClick={fetchTodos} style={styles.refreshButton}>🔄 Refresh</button>
      </div>

      {/* Grid / Empty State */}
      {filteredTodos.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyIcon}>📭</p>
          <p>Tidak ada data tugas yang ditemukan.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      )}

      {/* Modal Form Tambah/Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingTodo ? '✏️ Edit Tugas' : '➕ Tambah Tugas Baru'}
      >
        <TodoForm
          todo={editingTodo}
          onSuccess={handleFormSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  centerContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  retryButton: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  headerSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  appTitle: { margin: 0, fontSize: '24px', color: '#333' },
  totalText: { color: '#666', margin: '4px 0 0 0' },
  addButton: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  toolbar: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: '200px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' },
  filterButtons: { display: 'flex', gap: '5px' },
  filterBtn: { padding: '8px 14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  refreshButton: { padding: '10px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  emptyState: { textAlign: 'center', padding: '50px', color: '#888' },
  emptyIcon: { fontSize: '40px', marginBottom: '10px' },
};

export default TodoList;
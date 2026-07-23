import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'[cite: 1]

  // Fetch data dari API menggunakan useCallback[cite: 1]
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/v1/todos');
      console.log('Data todos:', response.data);
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError(err.response?.data?.message || 'Gagal mengambil data todo');
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data saat komponen mount[cite: 1]
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Tambah Todo Baru (POST)[cite: 1]
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      const response = await api.post('/api/v1/todos', { title, completed: false });
      setTodos([...todos, response.data]);
      setTitle('');
    } catch (err) {
      setError('Gagal menambah todo');
    } finally {
      setLoading(false);
    }
  };

  // Update Status Todo (PUT)[cite: 1]
  const handleToggleComplete = async (id, currentStatus) => {
    try {
      setLoading(true);
      const response = await api.put(`/api/v1/todos/${id}`, { completed: !currentStatus });
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
    } catch (err) {
      setError('Gagal mengupdate status todo');
    } finally {
      setLoading(false);
    }
  };

  // Hapus Todo (DELETE)[cite: 1]
  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Hapus todo ini?')) return;
    try {
      setLoading(true);
      await api.delete(`/api/v1/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Gagal menghapus todo');
    } finally {
      setLoading(false);
    }
  };

  // Filter logic[cite: 1]
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Conditional Rendering - Loading State[cite: 1]
  if (loading && todos.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading todos...</p>
      </div>
    );
  }

  // Conditional Rendering - Error State[cite: 1]
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <button onClick={fetchTodos} style={styles.retryButton}>
          🔄 Coba Lagi
        </button>
      </div>
    );
  }

  // Conditional Rendering - Success State[cite: 1]
  return (
    <div style={styles.container}>
      <h1>📝 Aplikasi Todo List</h1>
      
      <form onSubmit={handleAddTodo} style={styles.form}>
        <input
          type="text"
          placeholder="✍️ Tambah tugas baru..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.refreshButton}>Tambah</button>
      </form>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setFilter('all')} style={filter === 'all' ? styles.activeFilterBtn : styles.filterBtn}>Semua</button>
        <button onClick={() => setFilter('active')} style={filter === 'active' ? styles.activeFilterBtn : styles.filterBtn}>Aktif</button>
        <button onClick={() => setFilter('completed')} style={filter === 'completed' ? styles.activeFilterBtn : styles.filterBtn}>Selesai</button>
      </div>

      {loading && <p style={{ color: '#3498db' }}>Memproses data...</p>}

      {filteredTodos.length === 0 ? (
        <p style={styles.noResults}>Tidak ada todo yang cocok.</p>
      ) : (
        <div style={styles.grid}>
          {filteredTodos.map((todo) => (
            <div key={todo.id} style={styles.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  onChange={() => handleToggleComplete(todo.id, todo.completed)}
                  style={{ transform: 'scale(1.5)' }}
                />
                <h3 style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#888' : '#000' }}>
                  {todo.title}
                </h3>
              </div>
              <button onClick={() => handleDeleteTodo(todo.id)} style={styles.deleteBtn}>Hapus</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// CSS Styles disesuaikan dari contoh modul[cite: 1]
const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  errorContainer: { textAlign: 'center', padding: '40px' },
  retryButton: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  form: { display: 'flex', gap: '10px', marginBottom: '20px' },
  searchInput: { flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px' },
  refreshButton: { padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' },
  filterBtn: { padding: '8px 15px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#f8f9fa' },
  activeFilterBtn: { padding: '8px 15px', marginRight: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', backgroundColor: '#007bff', color: 'white' },
  grid: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  card: { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  deleteBtn: { padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  noResults: { textAlign: 'center', padding: '40px', color: '#888' },
};

// Tambahkan keyframes animation[cite: 1]
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .card:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
`;
document.head.appendChild(styleSheet);

export default TodoList;
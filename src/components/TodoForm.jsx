import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';

function TodoForm({ todo, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priority || 'medium',
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
      });
    }
  }, [todo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (todo) {
        // Update (PUT)
        await api.put(`/api/v1/todos/${todo.id}`, formData);
        alert('✅ Tugas berhasil diperbarui!');
      } else {
        // Create (POST)
        await api.post('/api/v1/todos', formData);
        alert('✅ Tugas baru berhasil ditambahkan!');
      }

      onSuccess();
    } catch (err) {
      console.error('Error saving todo:', err);
      setError(err.response?.data?.message || 'Gagal menyimpan data tugas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <div style={styles.errorAlert}>{error}</div>}

      <div style={styles.formGroup}>
        <label style={styles.label}>Judul Tugas *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Contoh: Belajar React & NestJS"
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Deskripsi</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detail tugas..."
          rows="3"
          style={styles.textarea}
        />
      </div>

      <div style={styles.row}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Prioritas</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="low">Low (Rendah)</option>
            <option value="medium">Medium (Sedang)</option>
            <option value="high">High (Tinggi)</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tenggat Waktu (Due Date)</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button type="button" onClick={onCancel} style={styles.cancelButton} disabled={loading}>
          Batal
        </button>
        <button type="submit" style={styles.submitButton} disabled={loading}>
          {loading ? 'Menyimpan...' : todo ? 'Simpan Perubahan' : 'Tambah Tugas'}
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 },
  row: { display: 'flex', gap: '10px' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#333' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  textarea: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', resize: 'vertical' },
  errorAlert: { padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', fontSize: '14px' },
  buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' },
  cancelButton: { padding: '10px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  submitButton: { padding: '10px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
};
export default TodoForm;
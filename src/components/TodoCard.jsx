function TodoCard({ todo, onToggleComplete, onEdit, onDelete }) {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return { bg: '#dc3545', text: 'Tinggi' };
      case 'medium': return { bg: '#ffc107', text: 'Sedang' };
      default: return { bg: '#17a2b8', text: 'Rendah' };
    }
  };

  const priorityInfo = getPriorityBadge(todo.priority);

  return (
    <div style={{ ...styles.card, opacity: todo.completed ? 0.7 : 1 }}>
      <div style={styles.header}>
        <div style={styles.titleWrapper}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id, !todo.completed)}
            style={styles.checkbox}
            title="Tandai selesai"
          />
          <h3 style={{ ...styles.title, textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.title}
          </h3>
        </div>
        <span style={{ ...styles.badge, backgroundColor: priorityInfo.bg }}>
          {priorityInfo.text}
        </span>
      </div>

      {todo.description && <p style={styles.description}>{todo.description}</p>}

      <div style={styles.footer}>
        <span style={styles.dueDate}>
          📅 {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'Tanpa Tenggat'}
        </span>
        <div style={styles.actions}>
          <button onClick={() => onEdit(todo)} style={styles.editBtn} title="Edit Tugas">✏️</button>
          <button onClick={() => onDelete(todo.id)} style={styles.deleteBtn} title="Hapus Tugas">🗑️</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white', padding: '16px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #eee',
    display: 'flex', flexDirection: 'column', gap: '10px', transition: 'all 0.2s',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleWrapper: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1 },
  checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
  title: { margin: 0, fontSize: '18px', color: '#333', wordBreak: 'break-word' },
  badge: { color: 'white', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  description: { color: '#666', fontSize: '14px', margin: 0, lineHeight: '1.4' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px', paddingTop: '10px', borderTop: '1px solid #f0f0f0' },
  dueDate: { fontSize: '12px', color: '#888' },
  actions: { display: 'flex', gap: '6px' },
  editBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' },
};

export default TodoCard;
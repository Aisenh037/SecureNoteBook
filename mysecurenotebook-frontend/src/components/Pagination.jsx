export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={styles.wrapper}>
      <button
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        style={styles.btn}
      >
        ← Prev
      </button>

      <span style={styles.info}>
        Page {page + 1} of {totalPages}
      </span>

      <button
        disabled={page === totalPages - 1}
        onClick={() => onChange(page + 1)}
        style={styles.btn}
      >
        Next →
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #e2e8f0",
  },
  btn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: "14px",
  },
  info: {
    fontSize: "13px",
    color: "#475569",
  },
};

import Navbar from "../components/Navbar";
import Notes from "./Notes";

export default function Dashboard() {
  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.main}>
        <section style={styles.container}>
          <header style={styles.header}>
            <h1 style={styles.title}>My Notes</h1>
            <p style={styles.subtitle}>
              All your notes, securely stored in one place
            </p>
          </header>

          <Notes />
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    padding: "32px 16px",
  },
  container: {
    width: "100%",
    maxWidth: "1100px",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },
  header: {
    marginBottom: "24px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "16px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#0f172a",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "4px",
  },
};

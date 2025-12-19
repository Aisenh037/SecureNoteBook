import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./Signup.module.css";

const API = "http://localhost:8082";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.username || !form.password) {
      toast.error("Username and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Signup failed");
      }

      toast.success("Account created. Please sign in.");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={submit}>
        <h2 className={styles.title}>Create your account</h2>

        <input
          className={styles.input}
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
          required
        />

        <input
          className={styles.input}
          placeholder="Email (optional)"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className={styles.input}
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <button className={styles.button} disabled={loading}>
          {loading ? "Creating…" : "Sign up"}
        </button>

        <div className={styles.footer}>
          Already have an account?
          <button
            type="button"
            onClick={() => navigate("/")}
            className={styles.link}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}

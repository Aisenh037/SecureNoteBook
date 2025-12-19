import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";
import styles from "./Login.module.css";

const API = "http://localhost:8082";

export default function Login() {
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Invalid username or password");

      const data = await res.json();
      loginSuccess(data.jwtToken);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* Brand */}
        <div className={styles.brand}>
          <img
            src="/icons/SecureNoteBook.png"
            alt="SecureNoteBook"
            className={styles.logo}
          />
          <div className={styles.title}>SecureNoteBook</div>
          <div className={styles.subtitle}>
            Sign in to your workspace
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrap}>
              <input
                type={showPwd ? "text" : "password"}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className={styles.eye}
                onClick={() => setShowPwd((v) => !v)}
                title={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.button} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <div className={styles.dividerText}>OR</div>
          <div className={styles.dividerLine} />
        </div>

        {/* OAuth */}
        <div className={styles.oauthStack}>
          <a
            href={`${API}/oauth2/authorization/google`}
            className={styles.oauthBtn}
          >
            <FcGoogle size={20} />
            Continue with Google
          </a>

          <a
            href={`${API}/oauth2/authorization/github`}
            className={styles.oauthBtn}
          >
            <FaGithub size={18} />
            Continue with GitHub
          </a>
        </div>

        {/* Signup CTA */}
        <div className={styles.signup}>
          <span>Don’t have an account?</span>
          <button
            type="button"
            className={styles.signupBtn}
            onClick={() => navigate("/signup")}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}

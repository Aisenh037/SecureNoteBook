import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";

/* ================= MAIN PAGE ================= */

export default function Profile() {
  const { user, token } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "profile";

  if (!user) return null;

  return (
    <div style={page}>
      <div style={card}>
        <Header tab={tab} setParams={setParams} />

        {tab === "profile" && <ProfileViewSection user={user} />}
        {tab === "security" && <SecuritySection />}
      </div>
    </div>
  );
}

/* ================= Layout ================= */

const page = {
  minHeight: "100vh",
  background: "#f1f5f9",
  display: "flex",
  justifyContent: "center",
  padding: "40px 16px",
};

const card = {
  width: "100%",
  maxWidth: 720,
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  padding: 24,
};

/* ================= Header ================= */

function Header({ tab, setParams }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600 }}>
        Account Settings
      </h1>
      <p style={{ color: "#475569", fontSize: 14 }}>
        Manage your profile and security
      </p>

      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        <Tab
          label="Profile"
          active={tab === "profile"}
          onClick={() => setParams({ tab: "profile" })}
        />
        <Tab
          label="Security"
          active={tab === "security"}
          onClick={() => setParams({ tab: "security" })}
        />
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        paddingBottom: 6,
        fontWeight: 500,
        borderBottom: active
          ? "2px solid #2563eb"
          : "2px solid transparent",
        color: active ? "#2563eb" : "#475569",
      }}
    >
      {label}
    </button>
  );
}

/* ================= PROFILE (EDITABLE) ================= */

function ProfileViewSection({ user }) {
  const [editing, setEditing] = useState(false);

  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");

  const dirty =
    username !== user.username ||
    email !== (user.email || "");

  const save = () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    if (email && !email.includes("@")) {
      toast.error("Invalid email format");
      return;
    }

    toast.success("Profile updated (frontend only)");
    setEditing(false);
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <EditableField
        label="Username"
        value={username}
        onChange={setUsername}
        disabled={!editing}
      />

      <EditableField
        label="Email"
        value={email}
        onChange={setEmail}
        disabled={!editing}
        placeholder="Add email"
      />

      <ReadOnlyField
        label="Auth Provider"
        value={user.provider || "LOCAL"}
      />

      <ReadOnlyField
        label="Roles"
        value={user.roles?.join(", ") || "USER"}
      />

      {!editing ? (
        <button style={secondaryBtn} onClick={() => setEditing(true)}>
          Edit Profile
        </button>
      ) : (
        <div style={{ display: "flex", gap: 12 }}>
          <button
            style={{ ...primaryBtn, opacity: dirty ? 1 : 0.5 }}
            disabled={!dirty}
            onClick={save}
          >
            Save Changes
          </button>
          <button
            style={secondaryBtn}
            onClick={() => {
              setUsername(user.username);
              setEmail(user.email || "");
              setEditing(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= SECURITY ================= */

function SecuritySection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

  const strength = passwordStrength(next);

  const labels = ["Weak", "Okay", "Good", "Strong"];
  const colors = ["#dc2626", "#f59e0b", "#2563eb", "#16a34a"];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Input
        label="Current Password"
        type="password"
        value={current}
        onChange={setCurrent}
      />

      <Input
        label="New Password"
        type="password"
        value={next}
        onChange={setNext}
      />

      {next && (
        <div>
          <div
            style={{
              height: 6,
              borderRadius: 6,
              background: "#e5e7eb",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(strength / 4) * 100}%`,
                background: colors[strength - 1],
                transition: "0.3s",
              }}
            />
          </div>
          <div
            style={{
              fontSize: 13,
              marginTop: 6,
              color: colors[strength - 1],
            }}
          >
            Strength: {labels[strength - 1]}
          </div>
        </div>
      )}

      <button
        style={{
          ...primaryBtn,
          opacity: strength < 3 ? 0.5 : 1,
        }}
        disabled={strength < 3}
        onClick={() =>
          toast.success("Password update UI ready")
        }
      >
        Update Password
      </button>
    </div>
  );
}

/* ================= HELPERS ================= */

function passwordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

function EditableField({
  label,
  value,
  onChange,
  disabled,
  placeholder,
}) {
  return (
    <div>
      <label style={{ fontSize: 13, color: "#64748b" }}>
        {label}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...input,
          background: disabled ? "#f8fafc" : "#fff",
          cursor: disabled ? "not-allowed" : "text",
        }}
      />
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: "#64748b" }}>
        {label}
      </div>
      <div style={{ fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function Input({ label, type, value, onChange }) {
  return (
    <div>
      <label style={{ fontSize: 13 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={input}
      />
    </div>
  );
}

/* ================= STYLES ================= */

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
};

const primaryBtn = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 500,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
};

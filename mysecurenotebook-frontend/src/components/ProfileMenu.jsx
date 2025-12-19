import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  /* Close on outside click & ESC */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handler);
    };
  }, []);

  if (!user) return null;

  const initials =
    user.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Avatar Button */}
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#2563eb",
          color: "#fff",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
        }}
        title="Account menu"
      >
        {initials}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 44,
            width: 260,
            background: "#ffffff",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
            zIndex: 100,
            overflow: "hidden",
            animation: "fadeIn 120ms ease-out",
          }}
        >
          {/* User Info */}
          <div
            style={{
              padding: 16,
              borderBottom: "1px solid #e5e7eb",
              background: "#f8fafc",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                color: "#0f172a",
                marginBottom: 4,
              }}
            >
              {user.username}
            </div>

            {user.email && (
              <div style={{ fontSize: 13, color: "#475569" }}>
                {user.email}
              </div>
            )}
          </div>

          {/* Actions */}
          <div>
                <MenuItem
                label="Profile"
                onClick={() => {
                    setOpen(false);
                    navigate("/profile?tab=profile");
                }}
                />

                <MenuItem
                label="Security"
                onClick={() => {
                    setOpen(false);
                    navigate("/profile?tab=security");
                }}
            />

            <div style={{ borderTop: "1px solid #e5e7eb" }} />

            <MenuItem
              label="Logout"
              danger
              onClick={() => {
                setOpen(false);
                logout();
                navigate("/");
              }}
            />
          </div>
        </div>
      )}

      {/* Local animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

/* ---------- Reusable menu item ---------- */
function MenuItem({ label, onClick, danger }) {
  return (
    <div
      onClick={onClick}
      role="menuitem"
      style={{
        padding: "12px 16px",
        cursor: "pointer",
        fontSize: 14,
        color: danger ? "#dc2626" : "#0f172a",
        transition: "background 120ms ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "#f1f5f9")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "transparent")
      }
    >
      {label}
    </div>
  );
}

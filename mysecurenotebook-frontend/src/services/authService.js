/**
 * Centralized Auth API layer
 */

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8082";

/* ================= LOGIN ================= */
export const login = async (username, password) => {
  const res = await fetch(`${API_BASE}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const msg = await safeMessage(res);
    throw new Error(msg || "Invalid credentials");
  }

  // 🔑 RETURN ONLY THE TOKEN STRING
  const data = await res.json();
  return data.jwtToken;
};

/* ================= FETCH PROFILE ================= */
export const fetchProfile = async (token) => {
  if (!token) throw new Error("Missing auth token");

  const res = await fetch(`${API_BASE}/api/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized");
    }
    const msg = await safeMessage(res);
    throw new Error(msg || "Failed to fetch profile");
  }

  return await res.json();
};

/* ================= UTIL ================= */
const safeMessage = async (res) => {
  try {
    const data = await res.json();
    return data?.message;
  } catch {
    return null;
  }
};

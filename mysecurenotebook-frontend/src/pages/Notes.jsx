import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";
import { useAuth } from "../context/AuthContext";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
} from "../services/noteService";
import NoteCard from "../components/NoteCard";

/* =========================
   Debounce Hook
========================= */
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

export default function Notes() {
  const { token } = useAuth();

  /* ===== DATA ===== */
  const [notes, setNotes] = useState([]);

  /* ===== PAGINATION ===== */
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ===== CREATE ===== */
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  /* ===== SEARCH + FILTER ===== */
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [filterBy, setFilterBy] = useState("all"); 
  const [showFilter, setShowFilter] = useState(false);

  /* =========================
     LOAD NOTES
  ========================= */
  const loadNotes = async (p = page) => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await fetchNotes(token, p, size);
      setNotes(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(p);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes(0);
  }, []);

  /* =========================
     CREATE (Optimistic)
  ========================= */
  const addNote = async () => {
    if (!title.trim() || !content.trim()) return;

    const tempId = uuid();
    const optimistic = {
      id: tempId,
      title,
      content,
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      optimistic: true,
    };

    setNotes((prev) => [optimistic, ...prev]);
    setTitle("");
    setContent("");

    try {
      const saved = await createNote(token, {
        title: optimistic.title,
        content: optimistic.content,
      });

      setNotes((prev) =>
        prev.map((n) => (n.id === tempId ? saved : n))
      );

      toast.success("Note created");
    } catch {
      setNotes((prev) => prev.filter((n) => n.id !== tempId));
      toast.error("Create failed");
    }
  };

  /* =========================
     UPDATE
  ========================= */
  const update = async (id, payload) => {
    try {
      const updated = await updateNote(token, id, payload);
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? updated : n))
      );
      toast.success("Note updated");
    } catch {
      toast.error("Update failed");
    }
  };

  /* =========================
     DELETE (Optimistic)
  ========================= */
  const remove = async (id) => {
    const backup = notes;
    setNotes((prev) => prev.filter((n) => n.id !== id));

    try {
      await deleteNote(token, id);
      toast.success("Note deleted");
    } catch {
      setNotes(backup);
      toast.error("Delete failed");
    }
  };

  /* =========================
     PIN / UNPIN
  ========================= */
  const pin = async (id) => {
    try {
      const updated = await togglePin(token, id);
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? updated : n))
      );
    } catch {
      toast.error("Pin action failed");
    }
  };

  /* =========================
     FILTER + SEARCH
  ========================= */
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();

      result = result.filter((n) => {
        if (filterBy === "title")
          return n.title.toLowerCase().includes(q);

        if (filterBy === "content")
          return n.content.toLowerCase().includes(q);

        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
        );
      });
    }

    if (filterBy === "created_desc") {
      result.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    if (filterBy === "created_asc") {
      result.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }

    return result;
  }, [notes, debouncedQuery, filterBy]);

  const pinned = filteredNotes.filter((n) => n.pinned);
  const others = filteredNotes.filter((n) => !n.pinned);

  /* =========================
     RENDER
  ========================= */
  return (
    <div>
      {/* Search + Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes..."
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
          }}
        />

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowFilter((v) => !v)}
            style={{
              padding: 10,
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            ⏳
          </button>

          {showFilter && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 44,
                background: "#fff",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                zIndex: 50,
                width: 180,
              }}
            >
              {[
                ["all", "All fields"],
                ["title", "Title only"],
                ["content", "Content only"],
                ["created_desc", "Newest first"],
                ["created_asc", "Oldest first"],
              ].map(([k, label]) => (
                <div
                  key={k}
                  onClick={() => {
                    setFilterBy(k);
                    setShowFilter(false);
                  }}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    background: filterBy === k ? "#f1f5f9" : "",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: 16,
          marginBottom: 24,
          background: "#fafafa",
        }}
      >
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />
        <textarea
          placeholder="Write your note..."
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />
        <div style={{ textAlign: "right" }}>
          <button
            onClick={addNote}
            disabled={!title || !content}
            style={{
              padding: "8px 14px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: 6,
              opacity: !title || !content ? 0.5 : 1,
            }}
          >
            Add note
          </button>
        </div>
      </div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <>
          <h4 style={{ marginBottom: 8 }}>📌 Pinned</h4>
          {pinned.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              onUpdate={update}
              onDelete={remove}
              onPin={pin}
            />
          ))}
          <hr style={{ margin: "24px 0" }} />
        </>
      )}

      {/* Others */}
      {others.map((n) => (
        <NoteCard
          key={n.id}
          note={n}
          onUpdate={update}
          onDelete={remove}
          onPin={pin}
        />
      ))}

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 24,
        }}
      >
        <button
          disabled={page === 0}
          onClick={() => loadNotes(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => loadNotes(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

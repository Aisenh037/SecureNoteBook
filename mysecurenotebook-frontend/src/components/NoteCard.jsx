import { useState } from "react";
import toast from "react-hot-toast";
import { FaThumbtack } from "react-icons/fa";


export default function NoteCard({ note, onUpdate, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const save = async () => {
  const old = { ...note };

  onUpdate(note.id, { title, content });

  setEditing(false);

  try {
    await onUpdate(note.id, { title, content });
    toast.success("Note updated");
  } catch {
    onUpdate(note.id, old);
    toast.error("Update failed");
  }
};


  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "16px",
      }}
    >
      {edit ? (
        <>
          <input
            className="w-full mb-2 px-2 py-1 border rounded text-sm"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className="w-full mb-3 px-2 py-1 border rounded text-sm"
            rows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
          />

          <div className="flex gap-4 text-sm">
            <button onClick={save} style={{ color: "#2563eb" }}>
              Save
            </button>
            <button onClick={() => setEdit(false)} style={{ color: "#64748b" }}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h4 className="font-medium">{note.title}</h4>
          <p className="text-sm mt-1 text-slate-600">{note.content}</p>

          <p className="text-xs mt-2 text-slate-400">
            Updated {new Date(note.updatedAt).toLocaleString()}
          </p>

          <div className="flex gap-4 mt-3 text-sm">
            <button onClick={() => setEdit(true)} style={{ color: "#2563eb" }}>
              Edit
            </button>
            <button onClick={() => onDelete(note.id)} style={{ color: "#dc2626" }}>
              Delete
            </button>
          </div>

          <div className="flex justify-between items-start">
  <h4 className="font-medium">
    {note.title}
  </h4>

  <button
    onClick={() => onUpdate(note.id, { pinned: !note.pinned })}
    className={`text-sm ${
      note.pinned ? "text-blue-600" : "text-slate-400"
    }`}
  >
    <FaThumbtack />
  </button>
</div>

        </>
      )}
    </div>
  );
}

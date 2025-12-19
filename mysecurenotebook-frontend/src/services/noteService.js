const API = "http://localhost:8082/api/notes";

export async function fetchNotes(token, page = 0, size = 6) {
  const res = await fetch(
    `${API}?page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load notes");
  }

  const data = await res.json();

  // Normalize response
  return {
    content: Array.isArray(data.content) ? data.content : [],
    last: Boolean(data.last),
    totalElements: data.totalElements ?? 0,
    totalPages: data.totalPages ?? 0,
  };
}


export async function createNote(token, payload) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
}

export async function updateNote(token, id, payload) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

export async function deleteNote(token, id) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete note");
}

export async function togglePin(token, id) {
  const res = await fetch(`${API}/${id}/pin`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to toggle pin");
  return res.json();
}


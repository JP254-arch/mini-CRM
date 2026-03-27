import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: "new" | "contacted" | "converted";
}

interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch lead
  const fetchLead = async () => {
    try {
      const res = await API.get(`/leads/${id}`);
      setLead(res.data);
    } catch {
      toast.error("Failed to load lead");
    }
  };

  // 🔹 Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await API.get(`/leads/${id}/notes`);
      setNotes(res.data);
    } catch {
      toast.error("Failed to load notes");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchLead(), fetchNotes()]);
      setLoading(false);
    };

    loadData();
  }, [id]);

  // 🔹 Add note
  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    try {
      await API.post(`/leads/${id}/notes`, {
        content: newNote
      });

      setNewNote("");
      fetchNotes();
      toast.success("Note added");
    } catch {
      toast.error("Failed to add note");
    }
  };

  // 🔹 Delete lead
  const handleDelete = async () => {
    if (!window.confirm("Delete this lead?")) return;

    try {
      await API.delete(`/leads/${id}`);
      toast.success("Lead deleted successfully");
      navigate("/leads");
    } catch {
      toast.error("Failed to delete lead");
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;
  if (!lead) return <p style={{ padding: "20px" }}>Lead not found</p>;

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto"
      }}
    >
      {/* 🔹 Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <h2>{lead.name}</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate(`/leads/${id}/edit`)}>
            Edit
          </button>

          <button
            onClick={handleDelete}
            style={{ background: "#dc3545", color: "#fff" }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* 🔹 Lead Info Card */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #eee",
          borderRadius: "10px",
          marginBottom: "20px",
          background: "#fff"
        }}
      >
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone || "N/A"}</p>
        <p><strong>Status:</strong> {lead.status}</p>
      </div>

      {/* 🔹 Notes Section */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #eee",
          borderRadius: "10px",
          background: "#fff"
        }}
      >
        <h3>Notes</h3>

        {/* Add note */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px"
          }}
        >
          <input
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />

          <button onClick={handleAddNote}>
            Add
          </button>
        </div>

        {/* Notes list */}
        {notes.length === 0 ? (
          <p>No notes yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {notes.map((note) => (
              <div
                key={note._id}
                style={{
                  padding: "10px",
                  border: "1px solid #eee",
                  borderRadius: "6px",
                  background: "#fafafa"
                }}
              >
                <p>{note.content}</p>
                <small style={{ color: "#666" }}>
                  {new Date(note.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
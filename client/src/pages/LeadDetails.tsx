import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

export default function LeadDetails() {
  const { id } = useParams();
  const [lead, setLead] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");

  const fetchLead = async () => {
    const res = await API.get("/leads");
    const found = res.data.find((l: any) => l._id === id);
    setLead(found);
  };

  const fetchNotes = async () => {
    const res = await API.get(`/leads/${id}/notes`);
    setNotes(res.data);
  };

  useEffect(() => {
    fetchLead();
    fetchNotes();
  }, []);

  const addNote = async () => {
    if (!newNote) return;

    await API.post(`/leads/${id}/notes`, {
      content: newNote
    });

    setNewNote("");
    fetchNotes();
  };

  if (!lead) return <p>Loading...</p>;

  return (
    <div>
      <h2>{lead.name}</h2>
      <p>Email: {lead.email}</p>
      <p>Status: {lead.status}</p>

      <h3>Notes</h3>

      <input
        placeholder="Add note..."
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
      />
      <button onClick={addNote}>Add</button>

      <ul>
        {notes.map((note) => (
          <li key={note._id}>{note.content}</li>
        ))}
      </ul>
    </div>
  );
}
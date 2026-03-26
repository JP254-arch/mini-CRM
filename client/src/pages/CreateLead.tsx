import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateLead() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "website"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      alert("Name and Email are required");
      return;
    }

    try {
      setLoading(true);
      await API.post("/leads", form);
      navigate("/leads");
    } catch (error) {
      console.error(error);
      alert("Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Create Lead</h2>

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
      />

      <input
        name="source"
        placeholder="Source (website, referral...)"
        value={form.source}
        onChange={handleChange}
      />

      <br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create Lead"}
      </button>

      <button onClick={() => navigate("/leads")}>
        Cancel
      </button>
    </div>
  );
}
import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateLead() {
  const navigate = useNavigate();
  const { id } = useParams(); // 👈 detect edit mode

  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "website"
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // 🔹 Load existing lead if editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchLead = async () => {
      try {
        setFetching(true);
        const res = await API.get(`/leads/${id}`);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          source: res.data.source || "website"
        });
      } catch {
        toast.error("Failed to load lead");
      } finally {
        setFetching(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // 🔹 Validation
    if (!form.name || !form.email) {
      toast.error("Name and Email are required");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await API.put(`/leads/${id}`, form);
        toast.success("Lead updated successfully");
      } else {
        await API.post("/leads", form);
        toast.success("New lead added successfully");
      }

      setTimeout(() => navigate("/leads"), 800);
    } catch {
      toast.error(
        isEdit ? "Failed to update lead" : "Failed to create lead"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5"
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "25px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          {isEdit ? "Edit Lead" : "Create Lead"}
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="source"
          placeholder="Source (website, referral...)"
          value={form.source}
          onChange={handleChange}
          style={inputStyle}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            background: loading ? "#999" : "#007bff",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update Lead"
            : "Create Lead"}
        </button>

        <button
          onClick={() => navigate("/leads")}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// 🔹 Reusable input style
const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};
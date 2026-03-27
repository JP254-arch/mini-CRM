import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Lead {
  _id: string;
  name: string;
  email: string;
  source: string;
  status: "new" | "contacted" | "converted";
  createdAt?: string;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ Bulk select
  const [selected, setSelected] = useState<string[]>([]);

  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (error) {
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await API.put(`/leads/${id}`, { status });

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === id
            ? { ...lead, status: status as Lead["status"] }
            : lead
        )
      );

      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ✅ Select toggle
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  // ✅ Delete selected
  const deleteSelected = async () => {
    if (selected.length === 0) {
      toast.error("No leads selected");
      return;
    }

    try {
      await Promise.all(selected.map((id) => API.delete(`/leads/${id}`)));
      toast.success("Selected leads deleted");
      setSelected([]);
      fetchLeads();
    } catch {
      toast.error("Failed to delete leads");
    }
  };

  // 🔍 Filtering
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.source.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 📊 Progress stats
  const now = new Date();

  const weekly = leads.filter(
    (l) =>
      l.createdAt &&
      new Date(l.createdAt) >
        new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  const monthly = leads.filter(
    (l) =>
      l.createdAt &&
      new Date(l.createdAt) >
        new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  const yearly = leads.filter(
    (l) =>
      l.createdAt &&
      new Date(l.createdAt) >
        new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  ).length;

  if (loading) return <p style={{ padding: "20px" }}>Loading leads...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Leads</h2>

      {/* 📊 Stats */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div>📅 Weekly: {weekly}</div>
        <div>📆 Monthly: {monthly}</div>
        <div>📊 Yearly: {yearly}</div>
      </div>

      {/* 🔹 Action Bar */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "15px",
          flexWrap: "wrap"
        }}
      >
        <button onClick={() => navigate("/leads/new")}>
          + Add Lead
        </button>

        <button onClick={deleteSelected}>
          🗑 Delete Selected
        </button>

        {/* 🔍 Search */}
        <input
          placeholder="Search by name, email, source..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            minWidth: "200px"
          }}
        />

        {/* 🎯 Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px" }}
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      {/* 📋 Table */}
      {filteredLeads.length === 0 ? (
        <p>No matching leads.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff"
          }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Source</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => (
              <tr
                key={lead._id}
                onClick={() => navigate(`/leads/${lead._id}`)}
                style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}
              >
                {/* ✅ Checkbox */}
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.includes(lead._id)}
                    onChange={() => toggleSelect(lead._id)}
                  />
                </td>

                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.source}</td>

                <td onClick={(e) => e.stopPropagation()}>
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateStatus(lead._id, e.target.value)
                    }
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
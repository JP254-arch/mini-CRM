import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Lead {
  _id: string;
  name: string;
  email: string;
  source: string;
  status: "new" | "contacted" | "converted";
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔍 NEW STATES
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
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

      // Optimistic update
      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === id
            ? { ...lead, status: status as Lead["status"] }
            : lead
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // 🔍 LIVE FILTER LOGIC
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.source.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <p style={{ padding: "20px" }}>Loading leads...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Leads</h2>

      {/* 🔹 ACTION BAR */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button onClick={() => navigate("/leads/new")}>
          + Add Lead
        </button>

        {/* 🔍 Search */}
        <input
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 🎯 Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      {filteredLeads.length === 0 ? (
        <p>No matching leads.</p>
      ) : (
        <table
          border={1}
          cellPadding={10}
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
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
                style={{ cursor: "pointer" }}
              >
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
import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    API.get("/leads").then((res) => setLeads(res.data));
  }, []);

  const total = leads.length;
  const converted = leads.filter(l => l.status === "converted").length;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Leads: {total}</p>
      <p>Converted: {converted}</p>
    </div>
  );
}
import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

interface Lead {
  _id: string;
  status: "new" | "contacted" | "converted";
  createdAt: string;
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    API.get("/leads").then((res) => setLeads(res.data));
  }, []);

  //  Metrics
  const total = leads.length;
  const converted = leads.filter(l => l.status === "converted").length;
  const contacted = leads.filter(l => l.status === "contacted").length;
  const newLeads = leads.filter(l => l.status === "new").length;

  const conversionRate = total
    ? ((converted / total) * 100).toFixed(1)
    : 0;

  const lossRate = total
    ? (100 - Number(conversionRate)).toFixed(1)
    : 0;

  // Group by date (simple trend)
  const grouped = leads.reduce((acc: any, lead) => {
    const date = new Date(lead.createdAt).toLocaleDateString();

    if (!acc[date]) {
      acc[date] = { date, count: 0 };
    }

    acc[date].count += 1;
    return acc;
  }, {});

  const chartData = Object.values(grouped);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {/*  Metrics Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div>
          <h4>Total Leads</h4>
          <p>{total}</p>
        </div>

        <div>
          <h4>Converted</h4>
          <p>{converted}</p>
        </div>

        <div>
          <h4>Conversion Rate</h4>
          <p>{conversionRate}%</p>
        </div>

        <div>
          <h4>Loss Rate</h4>
          <p>{lossRate}%</p>
        </div>
      </div>

      {/*  Chart */}
      <h3>Lead Growth Over Time</h3>
      <LineChart width={600} height={300} data={chartData}>
        <CartesianGrid />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" />
      </LineChart>

      {/* Status Table */}
      <h3 style={{ marginTop: "30px" }}>Lead Breakdown</h3>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New</td>
            <td>{newLeads}</td>
          </tr>
          <tr>
            <td>Contacted</td>
            <td>{contacted}</td>
          </tr>
          <tr>
            <td>Converted</td>
            <td>{converted}</td>
          </tr>
        </tbody>
      </table>

      {/* Simple Insight */}
      <div style={{ marginTop: "20px" }}>
        <h3>Performance Insight</h3>
        {Number(conversionRate) > 50 ? (
          <p>✅ Strong performance — high conversion rate</p>
        ) : Number(conversionRate) > 20 ? (
          <p>⚠️ Average performance — room for improvement</p>
        ) : (
          <p>❌ Low conversion — review your leads process</p>
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API}/api/admin/metrics`, {
      headers: {
        "x-admin-token": ADMIN_TOKEN!,
      },
    })
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold">SciSeek Admin</h1>

      <div>Total Questions: {data.total_questions}</div>
      <div>Successful Answers: {data.successful_answers}</div>
      <div>Paywall Hits: {data.paywall_hits}</div>
      <div>Waitlist Signups: {data.waitlist_signups}</div>
      <div>Conversion Rate: {data.conversion_rate}</div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

export default function AdminReport() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API}/api/admin/report`, {
      headers: {
        "x-admin-token": ADMIN_TOKEN!,
      },
    })
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">7-Day Report</h1>

      <div>
        <h2 className="font-semibold mb-2">Daily Activity</h2>
        {data.daily_activity.map((d: any, i: number) => (
          <div key={i}>
            {d.day} — {d.event}: {d.count}
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-semibold mb-2">Top Features</h2>
        {data.top_features.map((f: any, i: number) => (
          <div key={i}>
            {f.feature}: {f.count}
          </div>
        ))}
      </div>
    </div>
  );
}

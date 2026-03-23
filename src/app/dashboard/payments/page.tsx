"use client";

import { useEffect, useState } from "react";
import { buildApiUrl } from "@/lib/api";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch(buildApiUrl("/api/subscription/payments"), {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setPayments);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Purchase History
      </h2>

      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p: any) => (
            <tr key={p.id}>
              <td>₹{p.amount}</td>
              <td>{p.payment_status}</td>
              <td>
                {new Date(p.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

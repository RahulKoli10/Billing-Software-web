"use client";

import { useEffect, useState } from "react";
import { buildApiUrl } from "@/lib/api";

type PaymentHistoryItem = {
  id: number;
  amount: number;
  payment_status: string | null;
  payment_date: string | null;
};

export default function PaymentHistory() {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);

  useEffect(() => {
    fetch(buildApiUrl("/api/subscription/history"), {
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
          {payments.map((p) => (
            <tr key={p.id}>
              <td>₹{p.amount}</td>
              <td>{p.payment_status}</td>
              <td>
                {p.payment_date
                  ? new Date(p.payment_date).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

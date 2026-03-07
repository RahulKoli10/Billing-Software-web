"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type SoftwareItem = {
  id: number;
  file_name: string;
  version: string;
  platform: string;
  file_size: string;
  release_date: string;
  download_url: string;
};

export default function AdminUploadSoftware() {
  const [file, setFile] = useState<File | null>(null);
  const [platform, setPlatform] = useState("windows");
  const [version, setVersion] = useState("");
  const [softwares, setSoftwares] = useState<SoftwareItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH SOFTWARE ================= */
  const fetchSoftwares = async () => {
    try {
      const res = await fetch(`${API_URL}/api/downloads`, {
        credentials: "include",
      });
      const data = await res.json();
      setSoftwares(data);
    } catch (err) {
      console.error("Failed to fetch softwares", err);
    }
  };

  useEffect(() => {
    fetchSoftwares();
  }, []);

  /* ================= UPLOAD ================= */
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    if (!version) return alert("Please enter version");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("platform", platform);
    formData.append("version", version);

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/downloads/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!res.ok) {
        alert("Upload failed");
        return;
      }

      alert("Software uploaded successfully!");
      setFile(null);
      setVersion("");
      fetchSoftwares();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this software?")) return;

    try {
      setLoading(true);

      await fetch(`${API_URL}/api/downloads/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      fetchSoftwares();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 bg-gray-50 min-h-screen space-y-10">
      <h1 className="text-3xl font-bold">Software Management</h1>

      {/* ================= UPLOAD CARD ================= */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">
          Upload New Software
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="border px-4 py-2 rounded-md"
          >
            <option value="windows">Windows</option>
            <option value="mac">Mac</option>
          </select>

          <input
            type="text"
            placeholder="Version (e.g. 1.0.0)"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />

          <input
            type="file"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
            className="border px-4 py-2 rounded-md"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Uploading..." : "Upload Software"}
        </button>
      </div>

      {/* ================= SOFTWARE LIST ================= */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">File</th>
              <th className="p-4">Platform</th>
              <th className="p-4">Version</th>
              <th className="p-4">Size</th>
              <th className="p-4">Release Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {softwares.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4 font-medium">
                  {item.file_name}
                </td>

                <td className="p-4 capitalize">
                  {item.platform}
                </td>

                <td className="p-4">
                  {item.version}
                </td>

                <td className="p-4">
                  {item.file_size}
                </td>

                <td className="p-4">
                  {new Date(
                    item.release_date
                  ).toLocaleDateString()}
                </td>

                <td className="p-4 text-right space-x-4">
                  <a
                    href={`${API_URL}${item.download_url}`}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!softwares.length && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-500"
                >
                  No software uploaded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

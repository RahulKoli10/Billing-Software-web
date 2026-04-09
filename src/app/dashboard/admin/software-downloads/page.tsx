"use client";

import { useEffect, useState, useMemo } from "react";
import { buildApiUrl } from "@/lib/api";
import { Card, Badge, Button } from "@/components/ui/atoms";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  Upload,
  Download,
  Trash2
} from "lucide-react";

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
  const [externalUrl, setExternalUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [softwares, setSoftwares] = useState<SoftwareItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  /*   FETCH SOFTWARE   */
  const fetchSoftwares = async () => {
    try {
      const res = await fetch(buildApiUrl("/api/downloads"), {
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

  /*   UPLOAD   */
  const handleUpload = async () => {
    if (!version) {
      toast.error("Please enter version");
      return;
    }
    if (!file && !externalUrl.trim()) {
      toast.error("Please select a file or enter an external URL");
      return;
    }

    const formData = new FormData();
    formData.append("platform", platform);
    formData.append("version", version);

    if (file) {
      formData.append("file", file);
    }

    if (externalUrl.trim()) {
      formData.append("externalUrl", externalUrl.trim());
      formData.append("fileName", fileName.trim());
      formData.append("fileSize", fileSize.trim());
    }

    try {
      setLoading(true);

      const res = await fetch(
        buildApiUrl("/api/downloads/upload"),
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!res.ok) {
        toast.error("Upload failed");
        return;
      }

      toast.success("Software uploaded", {
        description: "The download list has been updated.",
      });
      setFile(null);
      setVersion("");
      setExternalUrl("");
      setFileName("");
      setFileSize("");
      fetchSoftwares();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /*   DELETE   */
  const performDelete = async (id: number) => {
    try {
      setLoading(true);

      const res = await fetch(buildApiUrl(`/api/downloads/${id}`), {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      fetchSoftwares();
      toast.warning("Software deleted", {
        description: "The download was removed successfully.",
      });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    toast.warning("Delete this software?", {
      description: "This asset will be removed from the repository.",
      action: {
        label: "Delete",
        onClick: () => {
          void performDelete(id);
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
      duration: 8000,
    });
  };

  const filteredSoftware = useMemo(() => {
    return softwares.filter((s) => 
      s.file_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.version?.toLowerCase().includes(search.toLowerCase())
    );
  }, [softwares, search]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold font-headline text-gray-900 tracking-tighter sm:text-3xl">Software Repository</h2>
          <p className="text-gray-500 font-medium">Manage distribution and metadata of software assets.</p>
        </div>
        <div className="flex gap-3 self-start sm:self-auto">
          {/* <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Protocols
          </Button> */}
          <Button size="sm" className="flex items-center gap-2" onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}>
            <Plus className="w-4 h-4" />
            Upload New Asset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card id="upload-section" className="p-8 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50/50 hover:border-blue-300 hover:bg-blue-50/20 transition-all">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-bold text-lg mb-1 font-headline">Distribute New Implementation Node</h4>
            <p className="text-sm text-gray-500 mb-6 font-body text-center max-w-sm">Provide a binary payload or an external release URL to instantiate a new software archetype.</p>
            
            <div className="grid w-full max-w-2xl grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm sm:p-6 md:grid-cols-2">
              <div className="space-y-1 relative">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Target Framework</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full border-b-2 border-gray-100 px-0 py-2 bg-transparent text-sm font-semibold focus:border-blue-600 outline-none transition-colors"
                >
                  <option value="windows">Windows Protocol</option>
                  <option value="mac">macOS Core</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Semantic Version</label>
                <input
                  type="text"
                  placeholder="e.g. 1.0.0-rc1"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full border-b-2 border-gray-100 px-0 py-2 bg-transparent text-sm font-semibold focus:border-blue-600 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Local Artifact (Binary)</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full border-b-2 border-gray-100 px-0 py-1.5 bg-transparent text-xs font-semibold focus:border-blue-600 outline-none transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Remote Manifest URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="w-full border-b-2 border-gray-100 px-0 py-2 bg-transparent text-sm font-semibold focus:border-blue-600 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Namespace Designation</label>
                <input
                  type="text"
                  placeholder="Display name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full border-b-2 border-gray-100 px-0 py-2 bg-transparent text-sm font-semibold focus:border-blue-600 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Storage Footprint</label>
                <input
                  type="text"
                  placeholder="e.g. 45.2 MB"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="w-full border-b-2 border-gray-100 px-0 py-2 bg-transparent text-sm font-semibold focus:border-blue-600 outline-none transition-colors"
                />
              </div>

              <div className="mt-4 flex justify-stretch border-t border-gray-100 pt-4 md:col-span-2 md:justify-end">
                <Button 
                  onClick={handleUpload} 
                  disabled={loading}
                  className="w-full md:w-auto"
                >
                  {loading ? "Deploying Artifact..." : "Deploy to Repository"}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="flex flex-col gap-4 border-b border-gray-100 bg-white p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
              <h3 className="font-bold font-headline text-lg">Asset Inventory</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search repository..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-600/20 lg:w-64" 
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-195 w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">ID</th>
                    <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Asset metadata</th>
                    <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Type</th>
                    <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Status</th>
                    <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Size</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredSoftware.map((asset) => (
                    <tr key={asset.id} className="group hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-5 font-mono text-xs font-bold text-blue-600">S-{asset.id}</td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-gray-900">{asset.file_name || "Unnamed Release"}</p>
                        <p className="text-[10px] font-medium text-gray-500">Version {asset.version}</p>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-gray-600 capitalize">{asset.platform}</td>
                      <td className="px-6 py-5">
                        <Badge variant="primary">Stable</Badge>
                      </td>
                      <td className="px-6 py-5 text-xs font-bold text-gray-500">{asset.file_size}</td>
                      <td className="px-6 py-5 text-right">
                         <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <a 
                            href={buildApiUrl(asset.download_url)} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 hover:bg-gray-200 rounded-lg transition-all text-gray-500 hover:text-blue-600"
                            title="Download Binary"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button 
                            onClick={() => handleDelete(asset.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-all text-gray-500 hover:text-red-600"
                            title="Desynchronize Node"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSoftware.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">No assets registered in repository.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* <div className="space-y-6">
          <Card title="Storage Infrastructure" subtitle="Health of distribution nodes">
            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                  <span className="flex items-center gap-1.5"><Database className="w-3 h-3" /> Relational DB Node</span>
                  <span className="text-gray-900">78%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: '78%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                  <span className="flex items-center gap-1.5"><Database className="w-3 h-3" /> Grid Network 04</span>
                  <span className="text-gray-900">24%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: '24%' }} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-50/50 border-blue-100">
            <h4 className="font-bold font-headline text-lg text-blue-800 mb-2 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              CLI Interface Usage
            </h4>
            <p className="text-sm text-blue-900/70 font-medium mb-4">You can distribute binaries programmatically via network architect CLI tools.</p>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-[11px] text-gray-300 shadow-inner">
              <span className="text-blue-400">bbill</span> distribute <span className="opacity-60">--asset</span> horizon-core-v2
            </div>
          </Card>
        </div> */}
      </div>
    </div>
  );
}

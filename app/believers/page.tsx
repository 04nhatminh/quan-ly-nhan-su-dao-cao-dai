"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Believer {
  id: string;
  holyName?: string;
  fullName: string;
  dateOfBirth: string;
  phone?: string;
  email?: string;
  address?: string;
  rank?: {
    id: string;
    name: string;
    level: number;
  };
  createdAt: string;
}

export default function BelieversPage() {
  const [believers, setBelievers] = useState<Believer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRank, setFilterRank] = useState("");
  const [ranks, setRanks] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBelievers();
    fetchRanks();
  }, []);

  const fetchBelievers = async () => {
    try {
      const response = await fetch("/api/believers");
      const data = await response.json();
      setBelievers(data.data || []);
    } catch (error) {
      console.error("Error fetching believers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRanks = async () => {
    try {
      const response = await fetch("/api/ranks");
      const data = await response.json();
      setRanks(data.ranks || data);
    } catch (error) {
      console.error("Error fetching ranks:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tín đồ này?")) return;

    try {
      const response = await fetch(`/api/believers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBelievers(believers.filter((b) => b.id !== id));
        alert("Đã xóa tín đồ thành công!");
      } else {
        alert("Có lỗi xảy ra khi xóa tín đồ!");
      }
    } catch (error) {
      console.error("Error deleting believer:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/believers/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `believers-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting believers:", error);
      alert("Có lỗi xảy ra khi xuất dữ liệu!");
    }
  };

  const filteredBelievers = believers.filter((believer) => {
    const matchesSearch =
      (believer.holyName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (believer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (believer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (believer.phone?.includes(searchTerm) ?? false);

    const matchesRank = !filterRank || believer.rank?.id === filterRank;

    return matchesSearch && matchesRank;
  });

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-medium text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Danh Sách Tín Đồ</h1>
          <p className="text-gray-600">
            Quản lý thông tin tín đồ Cao Đài
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, thánh danh, email, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <select
            value={filterRank}
            onChange={(e) => setFilterRank(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
          >
            <option value="">Tất cả phẩm vị</option>
            {ranks.map((rank) => (
              <option key={rank.id} value={rank.id}>
                {rank.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-white border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-all duration-200 font-medium"
          >
            Xuất CSV
          </button>
          <Link
            href="/believers/new"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
          >
            + Thêm Tín Đồ
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="text-gray-600">
            Hiển thị <span className="font-bold text-black">{filteredBelievers.length}</span> / {believers.length} tín đồ
          </span>
        </div>

        {/* Table */}
        {filteredBelievers.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-5xl mb-4">👤</div>
            <p className="text-xl text-gray-600">
              {searchTerm || filterRank
                ? "Không tìm thấy tín đồ nào"
                : "Chưa có tín đồ nào"}
            </p>
            {!searchTerm && !filterRank && (
              <Link
                href="/believers/new"
                className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                Thêm tín đồ đầu tiên
              </Link>
            )}
          </div>
        ) : (
          <div className="border-2 border-black rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="px-6 py-4 text-left font-bold">Thánh Danh</th>
                    <th className="px-6 py-4 text-left font-bold">Họ Tên</th>
                    <th className="px-6 py-4 text-left font-bold">Phẩm Vị</th>
                    <th className="px-6 py-4 text-left font-bold">Ngày Sinh</th>
                    <th className="px-6 py-4 text-left font-bold">Liên Hệ</th>
                    <th className="px-6 py-4 text-center font-bold">Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBelievers.map((believer, index) => (
                    <tr
                      key={believer.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-black">
                        {believer.holyName || believer.fullName}
                      </td>
                      <td className="px-6 py-4">{believer.fullName}</td>
                      <td className="px-6 py-4">
                        {believer.rank ? (
                          <span className="px-3 py-1 bg-black text-white text-sm rounded-full">
                            {believer.rank.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600" suppressHydrationWarning>
                        {new Date(believer.dateOfBirth).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-gray-600">
                          {believer.phone && <div>📞 {believer.phone}</div>}
                          {believer.email && <div>📧 {believer.email}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <Link
                            href={`/believers/${believer.id}`}
                            className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors"
                          >
                            Xem
                          </Link>
                          <button
                            onClick={() => handleDelete(believer.id)}
                            className="px-4 py-2 bg-white border-2 border-black text-black text-sm rounded hover:bg-black hover:text-white transition-all duration-200"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

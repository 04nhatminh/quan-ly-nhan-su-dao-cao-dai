"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Believer {
  id: string;
  fullName: string;
  dateOfBirth: string;
  xaDao?: string;
  hoDao?: string;
  phone?: string;
  email?: string;
  address?: string;
  gender?: string;
  ngayNhapMon?: string;
  ngayTamThanh?: string;
  traiKy?: string;
  tuChan?: string;
  fatherName?: string;
  motherName?: string;
  ngayQuyLieu?: string;
  note?: string;
  rankAssignments?: Array<{
    id: string;
    rank: {
      id: string;
      displayName: string;
      code: string;
      group: string;
    };
    decisionDate?: string;
  }>;
  createdAt: string;
}

export default function BelieversPage() {
  const [believers, setBelievers] = useState<Believer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRank, setFilterRank] = useState("");
  const [ranks, setRanks] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setMounted(true);
    fetchBelievers();
    fetchRanks();
  }, [sortBy, sortOrder]);

  const fetchBelievers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);
      
      const response = await fetch(`/api/believers?${params.toString()}`);
      const data = await response.json();
      setBelievers(data.data || []);
    } catch (error) {
      console.error("Error fetching believers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return " ↕";
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  const fetchRanks = async () => {
    try {
      const response = await fetch("/api/ranks");
      const data = await response.json();
      const allRanks = data.ranks || [];
      setRanks(allRanks);
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
      (believer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (believer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (believer.phone?.includes(searchTerm) ?? false) ||
      (believer.hoDao?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (believer.xaDao?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesRank = !filterRank || believer.rankAssignments?.[0]?.rank?.id === filterRank;

    return matchesSearch && matchesRank;
  });

  if (!mounted) {
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
              placeholder="Tìm kiếm theo tên"
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
                {rank.displayName}
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
          <div className="border-2 border-black rounded-lg overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
                <div className="text-center">
                  <div className="inline-block">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-2"></div>
                    <p className="text-gray-600 font-medium">Đang tải...</p>
                  </div>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black text-white">
                    <th 
                      onClick={() => handleSort("fullName")}
                      className="px-6 py-4 text-left font-bold cursor-pointer hover:bg-gray-900 transition-colors"
                    >
                      Họ Tên{getSortIcon("fullName")}
                    </th>
                    <th className="px-6 py-4 text-left font-bold">
                      Phẩm Vị
                    </th>
                    <th 
                      onClick={() => handleSort("dateOfBirth")}
                      className="px-6 py-4 text-left font-bold cursor-pointer hover:bg-gray-900 transition-colors"
                    >
                      Ngày Sinh{getSortIcon("dateOfBirth")}
                    </th>
                    <th 
                      onClick={() => handleSort("gender")}
                      className="px-6 py-4 text-left font-bold cursor-pointer hover:bg-gray-900 transition-colors"
                    >
                      Giới Tính{getSortIcon("gender")}
                    </th>
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
                        {believer.fullName}
                      </td>
                      <td className="px-6 py-4">
                        {believer.rankAssignments && believer.rankAssignments.length > 0 ? (
                          <span className="px-3 py-1 bg-black text-white text-sm rounded-full">
                            {believer.rankAssignments[0].rank.displayName}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600" suppressHydrationWarning>
                        {believer.dateOfBirth ? new Date(believer.dateOfBirth).toLocaleDateString("vi-VN") : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {believer.gender === 'MALE' && <span>Nam</span>}
                        {believer.gender === 'FEMALE' && <span>Nữ</span>}
                        {believer.gender === 'OTHER' && <span>Khác</span>}
                        {!believer.gender && <span className="text-gray-400">-</span>}
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

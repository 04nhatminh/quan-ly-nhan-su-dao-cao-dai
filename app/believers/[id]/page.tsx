"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  updatedAt: string;
}

export default function BelieverDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [believer, setBeliever] = useState<Believer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Believer>>({});
  const [ranks, setRanks] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (params.id) {
      fetchBeliever();
      fetchRanks();
    }
  }, [params.id]);

  const fetchBeliever = async () => {
    try {
      const response = await fetch(`/api/believers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setBeliever(data);
        setEditData(data);
      } else {
        alert("Không tìm thấy tín đồ!");
        router.push("/believers");
      }
    } catch (error) {
      console.error("Error fetching believer:", error);
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

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa tín đồ này?")) return;

    try {
      const response = await fetch(`/api/believers/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Đã xóa tín đồ thành công!");
        router.push("/believers");
      } else {
        alert("Có lỗi xảy ra khi xóa tín đồ!");
      }
    } catch (error) {
      console.error("Error deleting believer:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/believers/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updated = await response.json();
        setBeliever(updated);
        setIsEditing(false);
        alert("Cập nhật thành công!");
      } else {
        alert("Có lỗi xảy ra khi cập nhật!");
      }
    } catch (error) {
      console.error("Error updating believer:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-medium text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (!believer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-medium text-gray-600">
          Không tìm thấy tín đồ
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/believers"
            className="inline-flex items-center text-gray-600 hover:text-black mb-4 transition-colors"
          >
            ← Quay lại danh sách
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">
                {believer.holyName || believer.fullName}
              </h1>
              <p className="text-xl text-gray-600">{believer.fullName}</p>
            </div>
            {!isEditing && (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
                >
                  Chỉnh Sửa
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-white border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-all duration-200 font-medium"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="border-2 border-black rounded-lg overflow-hidden">
          {isEditing ? (
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-bold text-black mb-6">
                Chỉnh Sửa Thông Tin
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Họ Tên *
                  </label>
                  <input
                    type="text"
                    value={editData.fullName || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, fullName: e.target.value, holyName: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Ngày Sinh *
                  </label>
                  <input
                    type="date"
                    value={
                      editData.dateOfBirth
                        ? new Date(editData.dateOfBirth).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditData({ ...editData, dateOfBirth: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Phẩm Vị
                  </label>
                  <select
                    value={(editData.rank as any)?.id || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, rank: { id: e.target.value, name: ranks.find(r => r.id === e.target.value)?.name || "", level: ranks.find(r => r.id === e.target.value)?.level || 0 } })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="">Chọn phẩm vị</option>
                    {ranks.map((rank) => (
                      <option key={rank.id} value={rank.id}>
                        {rank.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    value={editData.phone || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editData.email || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Địa Chỉ
                </label>
                <textarea
                  value={editData.address || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdate}
                  className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
                >
                  Lưu Thay Đổi
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData(believer);
                  }}
                  className="px-8 py-3 bg-white border-2 border-gray-300 text-black rounded-lg hover:border-black transition-all duration-200 font-medium"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-black mb-6">
                Thông Tin Chi Tiết
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Thánh Danh
                    </div>
                    <div className="text-xl text-black">{believer.holyName || believer.fullName}</div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Họ Tên
                    </div>
                    <div className="text-xl text-black">{believer.fullName}</div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Ngày Sinh
                    </div>
                    <div className="text-xl text-black" suppressHydrationWarning>
                      {new Date(believer.dateOfBirth).toLocaleDateString("vi-VN")}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Phẩm Vị
                    </div>
                    {believer.rank ? (
                      <div className="inline-block px-4 py-2 bg-black text-white rounded-lg">
                        {believer.rank.name}
                      </div>
                    ) : (
                      <div className="text-xl text-gray-400">Chưa có phẩm vị</div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Số Điện Thoại
                    </div>
                    <div className="text-xl text-black">
                      {believer.phone || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Email
                    </div>
                    <div className="text-xl text-black">
                      {believer.email || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Địa Chỉ
                    </div>
                    <div className="text-xl text-black">
                      {believer.address || "-"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div suppressHydrationWarning>
                    <span className="font-bold">Ngày tạo:</span>{" "}
                    {new Date(believer.createdAt).toLocaleString("vi-VN")}
                  </div>
                  <div suppressHydrationWarning>
                    <span className="font-bold">Cập nhật:</span>{" "}
                    {new Date(believer.updatedAt).toLocaleString("vi-VN")}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

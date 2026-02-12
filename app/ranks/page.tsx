"use client";

import { useEffect, useState } from "react";

interface Rank {
  id: string;
  name: string;
  level: number;
  description?: string;
  _count?: {
    believers: number;
  };
}

export default function RanksPage() {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    level: 1,
    description: "",
  });

  useEffect(() => {
    setMounted(true);
    fetchRanks();
  }, []);

  const fetchRanks = async () => {
    try {
      const response = await fetch("/api/ranks");
      const data = await response.json();
      setRanks((data.ranks || data).sort((a: Rank, b: Rank) => a.level - b.level));
    } catch (error) {
      console.error("Error fetching ranks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên phẩm vị!");
      return;
    }

    try {
      const url = editingId ? `/api/ranks/${editingId}` : "/api/ranks";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchRanks();
        resetForm();
        alert(editingId ? "Cập nhật thành công!" : "Thêm phẩm vị thành công!");
      } else {
        const error = await response.json();
        alert(error.error || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Error saving rank:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const handleEdit = (rank: Rank) => {
    setEditingId(rank.id);
    setFormData({
      name: rank.name,
      level: rank.level,
      description: rank.description || "",
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string, name: string, believersCount: number) => {
    if (believersCount > 0) {
      alert(
        `Không thể xóa phẩm vị "${name}" vì còn ${believersCount} tín đồ đang sử dụng!`
      );
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa phẩm vị "${name}"?`)) return;

    try {
      const response = await fetch(`/api/ranks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchRanks();
        alert("Xóa phẩm vị thành công!");
      } else {
        const error = await response.json();
        alert(error.error || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Error deleting rank:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", level: 1, description: "" });
    setIsAdding(false);
    setEditingId(null);
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-medium text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Quản Lý Phẩm Vị</h1>
          <p className="text-gray-600">
            Quản lý hệ thống phẩm vị Cao Đài
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ranks List */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">
                Danh Sách Phẩm Vị ({ranks.length})
              </h2>
              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
                >
                  + Thêm Phẩm Vị
                </button>
              )}
            </div>

            {ranks.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-5xl mb-4">⭐</div>
                <p className="text-xl text-gray-600 mb-4">Chưa có phẩm vị nào</p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
                >
                  Thêm phẩm vị đầu tiên
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {ranks.map((rank) => (
                  <div
                    key={rank.id}
                    className="border-2 border-black rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="px-3 py-1 bg-black text-white text-sm font-bold rounded">
                            Cấp {rank.level}
                          </div>
                          <h3 className="text-2xl font-bold text-black">
                            {rank.name}
                          </h3>
                        </div>
                        {rank.description && (
                          <p className="text-gray-600 mb-3">{rank.description}</p>
                        )}
                        <div className="text-sm text-gray-500">
                          <span className="font-bold text-black">
                            {rank._count?.believers || 0}
                          </span>{" "}
                          tín đồ
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(rank)}
                          className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(
                              rank.id,
                              rank.name,
                              rank._count?.believers || 0
                            )
                          }
                          className="px-4 py-2 bg-white border-2 border-black text-black text-sm rounded hover:bg-black hover:text-white transition-all duration-200"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add/Edit Form */}
          <div className="lg:col-span-1">
            {isAdding && (
              <div className="sticky top-24">
                <div className="border-2 border-black rounded-lg p-6">
                  <h3 className="text-xl font-bold text-black mb-6">
                    {editingId ? "Chỉnh Sửa Phẩm Vị" : "Thêm Phẩm Vị Mới"}
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Tên Phẩm Vị *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                        placeholder="Vd: Giáo Sư"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Cấp Độ *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.level}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            level: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Mô Tả
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                        placeholder="Mô tả về phẩm vị..."
                      />
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
                      >
                        {editingId ? "Cập Nhật" : "Thêm Phẩm Vị"}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="w-full px-6 py-3 bg-white border-2 border-gray-300 text-black rounded-lg hover:border-black transition-all duration-200 font-medium"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-black">Lưu ý:</span> Không thể
                    xóa phẩm vị đang được sử dụng bởi tín đồ.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

interface Rank {
  id: string;
  code: string;
  displayName: string;
  group: "CUU_TRUNG_DAI" | "PHUOC_THIEN" | "HIEP_THIEN_DAI";
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type RankGroup = "CUU_TRUNG_DAI" | "PHUOC_THIEN" | "HIEP_THIEN_DAI";

interface RanksData {
  ranks: Rank[];
  grouped: Record<RankGroup, Rank[]>;
}

const groupLabels: Record<RankGroup, string> = {
  CUU_TRUNG_DAI: "Cửu Trùng Đài",
  PHUOC_THIEN: "Phước Thiện",
  HIEP_THIEN_DAI: "Hiệp Thiện Đài",
};

export default function RanksPage() {
  const [groupedRanks, setGroupedRanks] = useState<Record<RankGroup, Rank[]>>({
    CUU_TRUNG_DAI: [],
    PHUOC_THIEN: [],
    HIEP_THIEN_DAI: [],
  });
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<RankGroup>("CUU_TRUNG_DAI");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    group: "CUU_TRUNG_DAI" as RankGroup,
  });

  useEffect(() => {
    setMounted(true);
    fetchRanks();
  }, []);

  const fetchRanks = async () => {
    try {
      const response = await fetch("/api/ranks");
      const data: RanksData = await response.json();
      setGroupedRanks(data.grouped);
    } catch (error) {
      console.error("Error fetching ranks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.displayName.trim()) {
      alert("Vui lòng nhập tên phẩm vị!");
      return;
    }

    try {
      const url = editingId ? `/api/ranks/${editingId}` : "/api/ranks";
      const method = editingId ? "PATCH" : "POST";

      const body = editingId
        ? {
            displayName: formData.displayName,
          }
        : {
            displayName: formData.displayName,
            group: formData.group,
            code: formData.displayName.toLowerCase().replace(/\s+/g, "_"),
          };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
      displayName: rank.displayName,
      group: rank.group,
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string, displayName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa phẩm vị "${displayName}"?`)) return;

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
    setFormData({
      displayName: "",
      group: "CUU_TRUNG_DAI",
    });
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
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black mb-4">
                Danh Sách Phẩm Vị Theo Nhóm
              </h2>

              {/* Group Tabs */}
              <div className="flex gap-2 border-b-2 border-black">
                {(Object.keys(groupLabels) as RankGroup[]).map((group) => (
                  <button
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className={`px-4 py-3 font-bold transition-all ${
                      selectedGroup === group
                        ? "text-black border-b-4 border-black -mb-2"
                        : "text-gray-600 hover:text-black hover:cursor-pointer"
                    }`}
                  >
                    {groupLabels[group]}
                    <span className="ml-2 text-sm">({groupedRanks[group]?.length || 0})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Display Selected Group Ranks */}
            {groupedRanks[selectedGroup]?.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-5xl mb-4">⭐</div>
                <p className="text-xl text-gray-600 mb-4">Chưa có phẩm vị nào trong nhóm này</p>
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, group: selectedGroup }));
                    setIsAdding(true);
                  }}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
                >
                  Thêm phẩm vị
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {groupedRanks[selectedGroup]?.map((rank) => (
                  <div
                    key={rank.id}
                    className="border-2 border-black rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-black">
                          {rank.displayName}
                        </h3>
                        <div className="text-sm text-gray-500 mt-2">
                          Mã: <span className="font-mono">{rank.code}</span>
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
                          onClick={() => handleDelete(rank.id, rank.displayName)}
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
                    {!editingId && (
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          Nhóm Phẩm Vị *
                        </label>
                        <select
                          value={formData.group}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              group: e.target.value as RankGroup,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                        >
                          {(Object.keys(groupLabels) as RankGroup[]).map((group) => (
                            <option key={group} value={group}>
                              {groupLabels[group]}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Tên Phẩm Vị *
                      </label>
                      <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) =>
                          setFormData({ ...formData, displayName: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                        placeholder="Vd: Giáo Sư"
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

            {!isAdding && (
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, group: selectedGroup }));
                  setIsAdding(true);
                }}
                className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                + Thêm Phẩm Vị
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

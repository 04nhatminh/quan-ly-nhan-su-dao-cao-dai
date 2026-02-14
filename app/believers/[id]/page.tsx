"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface RankAssignmentForm {
  id: string;
  rankId: string;
  decisionNumber: string;
  decisionDate: string;
}

interface Believer {
  id: string;
  holyName?: string;
  fullName: string;
  fullNameNormalized?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  xaDao?: string;
  hoDao?: string;
  ngayNhapMon?: string;
  ngayTamThanh?: string;
  traiKy?: string;
  tuChan?: string;
  fatherName?: string;
  motherName?: string;
  ngayQuyLieu?: string;
  note?: string;
  rank?: {
    id: string;
    name: string;
    level: number;
  };
  rankAssignments?: Array<{
    id: string;
    rank: {
      id: string;
      displayName: string;
      code: string;
      group: string;
    };
    decisionNumber?: string;
    decisionDate?: string;
    decisionNote?: string;
    decisionFileUrl?: string;
    createdAt: string;
  }>;
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
  const [editRankAssignments, setEditRankAssignments] = useState<RankAssignmentForm[]>([]);
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
        // Initialize rank assignments from believer data
        if (data.rankAssignments && data.rankAssignments.length > 0) {
          const rankAssignmentsData = data.rankAssignments.map((ra: any) => ({
            id: ra.id,
            rankId: ra.rank.id,
            decisionNumber: ra.decisionNumber || "",
            decisionDate: ra.decisionDate ? new Date(ra.decisionDate).toISOString().split('T')[0] : "",
          }));
          setEditRankAssignments(rankAssignmentsData);
        }
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

  const addRankAssignment = () => {
    const newId = Date.now().toString();
    setEditRankAssignments([
      ...editRankAssignments,
      { id: newId, rankId: "", decisionNumber: "", decisionDate: "" },
    ]);
  };

  const removeRankAssignment = (id: string) => {
    setEditRankAssignments(editRankAssignments.filter(r => r.id !== id));
  };

  const updateRankAssignment = (
    id: string,
    field: keyof RankAssignmentForm,
    value: string
  ) => {
    setEditRankAssignments(
      editRankAssignments.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      )
    );
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
      // Prepare rank assignments data
      const rankAssignmentsData = editRankAssignments
        .filter(r => r.rankId)
        .map(r => ({
          id: r.id,
          rankId: r.rankId,
          decisionNumber: r.decisionNumber || "",
          decisionDate: r.decisionDate || null,
        }));

      const updateData = {
        ...editData,
        rankAssignments: rankAssignmentsData,
      };

      const response = await fetch(`/api/believers/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
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
                {believer.fullName}
              </h1>
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
                      setEditData({ ...editData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Ngày Sinh
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
                    Giới Tính
                  </label>
                  <select
                    value={editData.gender || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, gender: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Xã Đạo
                  </label>
                  <input
                    type="text"
                    value={editData.xaDao || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, xaDao: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Họ Đạo
                  </label>
                  <input
                    type="text"
                    value={editData.hoDao || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, hoDao: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Ngày Nhập Môn
                  </label>
                  <input
                    type="date"
                    value={
                      editData.ngayNhapMon
                        ? new Date(editData.ngayNhapMon).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditData({ ...editData, ngayNhapMon: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Ngày Tắm Thánh
                  </label>
                  <input
                    type="date"
                    value={
                      editData.ngayTamThanh
                        ? new Date(editData.ngayTamThanh).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditData({ ...editData, ngayTamThanh: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Trai Kỳ
                  </label>
                  <select
                    value={editData.traiKy || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, traiKy: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="">Chọn trai kỳ</option>
                    <option value="SIX_DAYS">6 ngày</option>
                    <option value="TEN_DAYS">10 ngày</option>
                    <option value="SIXTEEN_DAYS">16 ngày</option>
                    <option value="FULL">Trường</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Tu Chân
                  </label>
                  <select
                    value={editData.tuChan || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, tuChan: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="">Chọn tu chân</option>
                    <option value="LINH">Linh</option>
                    <option value="TRUONG">Trưởng</option>
                    <option value="TAM">Tâm</option>
                    <option value="TBHC">Tam bảo huyền châu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Tên Cha
                  </label>
                  <input
                    type="text"
                    value={editData.fatherName || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, fatherName: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Tên Mẹ
                  </label>
                  <input
                    type="text"
                    value={editData.motherName || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, motherName: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Ngày Quy Liễu
                  </label>
                  <input
                    type="date"
                    value={
                      editData.ngayQuyLieu
                        ? new Date(editData.ngayQuyLieu).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditData({ ...editData, ngayQuyLieu: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
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

              {/* Phẩm Vị Đạt Được */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-black">Phẩm Vị Đạt Được</h3>
                  <button
                    type="button"
                    onClick={addRankAssignment}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    + Thêm Phẩm Vị
                  </button>
                </div>

                {editRankAssignments.length === 0 ? (
                  <p className="text-gray-600 italic mb-6">Chưa có phẩm vị nào. Nhấn "Thêm Phẩm Vị" để thêm.</p>
                ) : (
                  <div className="space-y-4 mb-6">
                    {editRankAssignments.map((assignment, index) => (
                      <div key={assignment.id} className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-800">Phẩm Vị #{index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeRankAssignment(assignment.id)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                          >
                            Xóa
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-black mb-2">
                              Phẩm Vị <span className="text-red-600">*</span>
                            </label>
                            <select
                              value={assignment.rankId}
                              onChange={(e) => updateRankAssignment(assignment.id, "rankId", e.target.value)}
                              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                                !assignment.rankId
                                  ? "border-gray-300 focus:border-black"
                                  : "border-green-500 focus:border-green-600"
                              }`}
                            >
                              <option value="">Chọn phẩm vị</option>
                              {ranks.map((rank) => (
                                <option key={rank.id} value={rank.id}>
                                  {rank.displayName}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-black mb-2">
                              Quyết Định Số
                            </label>
                            <input
                              type="text"
                              value={assignment.decisionNumber}
                              onChange={(e) => updateRankAssignment(assignment.id, "decisionNumber", e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                              placeholder="Vd: 123/QĐ"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-black mb-2">
                              Ngày Quyết Định
                            </label>
                            <input
                              type="date"
                              value={assignment.decisionDate}
                              onChange={(e) => updateRankAssignment(assignment.id, "decisionDate", e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Ghi Chú
                </label>
                <textarea
                  value={editData.note || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, note: e.target.value })
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
                    // Reset rank assignments
                    if (believer?.rankAssignments && believer.rankAssignments.length > 0) {
                      const rankAssignmentsData = believer.rankAssignments.map((ra: any) => ({
                        id: ra.id,
                        rankId: ra.rank.id,
                        decisionNumber: ra.decisionNumber || "",
                        decisionDate: ra.decisionDate ? new Date(ra.decisionDate).toISOString().split('T')[0] : "",
                      }));
                      setEditRankAssignments(rankAssignmentsData);
                    } else {
                      setEditRankAssignments([]);
                    }
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
                      Họ Tên
                    </div>
                    <div className="text-xl text-black">{believer.fullName}</div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Ngày Sinh
                    </div>
                    <div className="text-xl text-black" suppressHydrationWarning>
                      {believer.dateOfBirth
                        ? new Date(believer.dateOfBirth).toLocaleDateString("vi-VN")
                        : "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Giới Tính
                    </div>
                    <div className="text-xl text-black">
                      {believer.gender === "MALE"
                        ? "Nam"
                        : believer.gender === "FEMALE"
                        ? "Nữ"
                        : believer.gender === "OTHER"
                        ? "Khác"
                        : "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Xã Đạo
                    </div>
                    <div className="text-xl text-black">{believer.xaDao || "-"}</div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Họ Đạo
                    </div>
                    <div className="text-xl text-black">{believer.hoDao || "-"}</div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Ngày Nhập Môn
                    </div>
                    <div className="text-xl text-black" suppressHydrationWarning>
                      {believer.ngayNhapMon
                        ? new Date(believer.ngayNhapMon).toLocaleDateString("vi-VN")
                        : "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Ngày Tắm Thánh
                    </div>
                    <div className="text-xl text-black" suppressHydrationWarning>
                      {believer.ngayTamThanh
                        ? new Date(believer.ngayTamThanh).toLocaleDateString("vi-VN")
                        : "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Trai Kỳ
                    </div>
                    <div className="text-xl text-black">
                      {believer.traiKy === "SIX_DAYS"
                        ? "6 ngày"
                        : believer.traiKy === "TEN_DAYS"
                        ? "10 ngày"
                        : believer.traiKy === "SIXTEEN_DAYS"
                        ? "16 ngày"
                        : believer.traiKy === "FULL"
                        ? "Trường"
                        : believer.traiKy || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Tu Chân
                    </div>
                    <div className="text-xl text-black">
                      {believer.tuChan === "LINH"
                        ? "Linh"
                        : believer.tuChan === "TRUONG"
                        ? "Trưởng"
                        : believer.tuChan === "TAM"
                        ? "Tâm"
                        : believer.tuChan === "TBHC"
                        ? "Tam bảo huyền châu"
                        : believer.tuChan || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Tên Cha
                    </div>
                    <div className="text-xl text-black">{believer.fatherName || "-"}</div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Tên Mẹ
                    </div>
                    <div className="text-xl text-black">{believer.motherName || "-"}</div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Ngày Quy Liễu
                    </div>
                    <div className="text-xl text-black" suppressHydrationWarning>
                      {believer.ngayQuyLieu
                        ? new Date(believer.ngayQuyLieu).toLocaleDateString("vi-VN")
                        : "-"}
                    </div>
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

                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Ghi Chú
                    </div>
                    <div className="text-xl text-black whitespace-pre-wrap">
                      {believer.note || "-"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lịch sử phẩm vị */}
              {believer.rankAssignments && believer.rankAssignments.length > 0 && (
                <div className="mt-8 pt-8 border-t-2 border-gray-200">
                  <h3 className="text-xl font-bold text-black mb-4">Lịch Sử Phẩm Vị</h3>
                  <div className="space-y-4">
                    {believer.rankAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="p-4 border-2 border-gray-200 rounded-lg"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">
                              Phẩm Vị
                            </div>
                            <div className="text-lg font-semibold text-black">
                              {assignment.rank.displayName}
                            </div>
                          </div>
                          <div suppressHydrationWarning>
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">
                              Ngày Quyết Định
                            </div>
                            <div className="text-lg text-black">
                              {assignment.decisionDate
                                ? new Date(assignment.decisionDate).toLocaleDateString("vi-VN")
                                : "-"}
                            </div>
                          </div>
                          {assignment.decisionNumber && (
                            <div>
                              <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">
                                Quyết Định Số
                              </div>
                              <div className="text-lg text-black">{assignment.decisionNumber}</div>
                            </div>
                          )}
                          {assignment.decisionNote && (
                            <div>
                              <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">
                                Ghi Chú
                              </div>
                              <div className="text-lg text-black">{assignment.decisionNote}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

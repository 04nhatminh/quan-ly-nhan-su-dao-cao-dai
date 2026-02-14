"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RankAssignmentForm {
  id: string;
  rankId: string;
  decisionNumber: string;
  decisionDate: string;
}

export default function NewBelieverPage() {
  const router = useRouter();
  const [ranks, setRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    xaDao: "",
    hoDao: "",
    ngayNhapMon: "",
    ngayTamThanh: "",
    traiKy: "",
    tuChan: "",
    fatherName: "",
    motherName: "",
    ngayQuyLieu: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });
  const [rankAssignments, setRankAssignments] = useState<RankAssignmentForm[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchRanks();
  }, []);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    if (!formData.hoDao.trim()) {
      newErrors.hoDao = "Vui lòng nhập họ đạo";
    }

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Phone validation
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    // Check at least one rank assignment
    if (rankAssignments.length === 0 || !rankAssignments.some(r => r.rankId.trim())) {
      newErrors.rankAssignments = "Vui lòng chọn ít nhất một phẩm vị";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const dupCheck = await fetch("/api/believers/duplicate-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          hoDao: formData.hoDao,
          xaDao: formData.xaDao,
          fatherName: formData.fatherName,
          motherName: formData.motherName,
        }),
      });

      const dupResult = await dupCheck.json();

      if (dupResult.candidates && dupResult.candidates.length > 0) {
        const candidatesList = dupResult.candidates
          .map((c: any) => `- ${c.fullName} (${c.reason}, độ tương đồng: ${Math.round(c.similarity * 100)}%)`)
          .join("\n");
        
        if (
          !confirm(
            `Cảnh báo: Tìm thấy những tín đồ tương tự:\n${candidatesList}\n\nBạn có chắc muốn tiếp tục thêm?`
          )
        ) {
          setLoading(false);
          return;
        }
      }

      // Prepare rank assignments data
      const rankAssignmentsData = rankAssignments
        .filter(r => r.rankId)
        .map(r => ({
          rankId: r.rankId,
          decisionNumber: r.decisionNumber || "",
          decisionDate: r.decisionDate ? r.decisionDate : null,
        }));

      const apiData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth,
        ngayNhapMon: formData.ngayNhapMon ? formData.ngayNhapMon : null,
        ngayTamThanh: formData.ngayTamThanh ? formData.ngayTamThanh : null,
        ngayQuyLieu: formData.ngayQuyLieu ? formData.ngayQuyLieu : null,
        rankAssignments: rankAssignmentsData,
      };

      const response = await fetch("/api/believers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Thêm tín đồ thành công!");
        router.push(`/believers/${result.id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Có lỗi xảy ra khi thêm tín đồ!");
      }
    } catch (error) {
      console.error("Error creating believer:", error);
      alert("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const addRankAssignment = () => {
    const newId = Date.now().toString();
    setRankAssignments([
      ...rankAssignments,
      { id: newId, rankId: "", decisionNumber: "", decisionDate: "" },
    ]);
  };

  const removeRankAssignment = (id: string) => {
    setRankAssignments(rankAssignments.filter(r => r.id !== id));
  };

  const updateRankAssignment = (
    id: string,
    field: keyof RankAssignmentForm,
    value: string
  ) => {
    setRankAssignments(
      rankAssignments.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      )
    );
    // Clear error for this field
    if (errors[`rankAssignments.${rankAssignments.findIndex(r => r.id === id)}.${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`rankAssignments.${rankAssignments.findIndex(r => r.id === id)}.${field}`];
      setErrors(newErrors);
    }
  };

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
          <h1 className="text-4xl font-bold text-black mb-2">
            Thêm Tín Đồ Mới
          </h1>
          <p className="text-gray-600">Nhập thông tin tín đồ vào form bên dưới</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="border-2 border-black rounded-lg p-8 space-y-8">
            {/* Thông tin cơ bản */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Thông Tin Cơ Bản</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Họ Tên <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.fullName
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-black"
                    }`}
                    placeholder="Nhập họ tên đầy đủ"
                  />
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Ngày Sinh
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleDateChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.dateOfBirth
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-black"
                    }`}
                    placeholder="dd/mm/yyyy"
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Giới Tính <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.gender
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-black"
                    }`}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Địa bàn */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Nơi Sinh Hoạt</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Xã Đạo
                  </label>
                  <input
                    type="text"
                    name="xaDao"
                    value={formData.xaDao}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="Vd: Xã Đạo Hưng Mỹ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Họ Đạo <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="hoDao"
                    value={formData.hoDao}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.hoDao
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-black"
                    }`}
                    placeholder="Vd: Họ Đạo Từ Vân"
                  />
                  {errors.hoDao && (
                    <p className="mt-2 text-sm text-red-600">{errors.hoDao}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mốc Đạo */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Mốc Thời Gian</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Ngày Nhập Môn
                  </label>
                  <input
                    type="date"
                    name="ngayNhapMon"
                    value={formData.ngayNhapMon}
                    onChange={handleDateChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Ngày Tắm Thánh
                  </label>
                  <input
                    type="date"
                    name="ngayTamThanh"
                    value={formData.ngayTamThanh}
                    onChange={handleDateChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Ngày Quy Liễu
                  </label>
                  <input
                    type="date"
                    name="ngayQuyLieu"
                    value={formData.ngayQuyLieu}
                    onChange={handleDateChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="dd/mm/yyyy"
                  />
                </div>
              </div>
            </div>

            {/* Tu tập */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Tu Tập</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Trai Kỳ
                  </label>
                  <select
                    name="traiKy"
                    value={formData.traiKy}
                    onChange={handleChange}
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
                    name="tuChan"
                    value={formData.tuChan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="">Chọn tu chân</option>
                    <option value="LINH">Linh châu</option>
                    <option value="TRUONG">Trưởng châu</option>
                    <option value="TAM">Tâm châu</option>
                    <option value="TBHC">Tam Bảo Huyền Châu</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Gia đình */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Gia Đình</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Tên Cha
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="Nhập tên cha"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Tên Mẹ
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="Nhập tên mẹ"
                  />
                </div>
              </div>
            </div>

            {/* Liên hệ */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Liên Hệ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.phone
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-black"
                    }`}
                    placeholder="0123456789"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.email
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-black"
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-bold text-black mb-2">
                  Địa Chỉ
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  placeholder="Nhập địa chỉ đầy đủ"
                />
              </div>
            </div>

            {/* Phẩm Vị Đạt Được */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">Phẩm Vị Đạt Được <span className="text-red-600">*</span></h2>
                <button
                  type="button"
                  onClick={addRankAssignment}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  + Thêm Phẩm Vị
                </button>
              </div>

              {errors.rankAssignments && (
                <p className="mb-4 text-sm text-red-600 font-medium">{errors.rankAssignments}</p>
              )}

              {rankAssignments.length === 0 ? (
                <p className="text-gray-600 italic mb-6">Chưa có phẩm vị nào. Nhấn "Thêm Phẩm Vị" để thêm.</p>
              ) : (
                <div className="space-y-4 mb-6">
                  {rankAssignments.map((assignment, index) => (
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
                            type="text"
                            value={assignment.decisionDate}
                            onChange={(e) => updateRankAssignment(assignment.id, "decisionDate", e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                            placeholder="dd/mm/yyyy"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Ghi Chú
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                placeholder="Nhập ghi chú nếu có"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-6 border-t-2 border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Thêm Tín Đồ"}
              </button>
              <Link
                href="/believers"
                className="px-8 py-3 bg-white border-2 border-gray-300 text-black rounded-lg hover:border-black transition-all duration-200 font-medium inline-flex items-center"
              >
                Hủy
              </Link>
            </div>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600">
            <span className="font-bold text-black">Lưu ý:</span> Các trường có dấu{" "}
            <span className="text-red-600">*</span> là bắt buộc. Hệ thống sẽ kiểm
            tra trùng lặp tín đồ trước khi thêm mới.
          </p>
        </div>
      </div>
    </div>
  );
}

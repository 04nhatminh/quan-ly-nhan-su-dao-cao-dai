"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    rankId: "",
    note: "",
  });
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

  const convertDateForAPI = (ddmmyyyy: string) => {
    if (!ddmmyyyy) return "";
    const parts = ddmmyyyy.split("/");
    if (parts.length !== 3) return "";
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const validateDate = (ddmmyyyy: string) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(ddmmyyyy)) {
      return false;
    }
    const [day, month, year] = ddmmyyyy.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
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

    if (!formData.rankId) {
      newErrors.rankId = "Vui lòng chọn phẩm vị";
    }

    // Validate ngày sinh nếu có nhập
    if (formData.dateOfBirth && !validateDate(formData.dateOfBirth)) {
      newErrors.dateOfBirth = "Ngày sinh không hợp lệ (định dạng: dd/mm/yyyy)";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
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
          dateOfBirth: convertDateForAPI(formData.dateOfBirth),
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

      const apiData = {
        ...formData,
        dateOfBirth: convertDateForAPI(formData.dateOfBirth),
        ngayNhapMon: formData.ngayNhapMon ? convertDateForAPI(formData.ngayNhapMon) : null,
        ngayTamThanh: formData.ngayTamThanh ? convertDateForAPI(formData.ngayTamThanh) : null,
        ngayQuyLieu: formData.ngayQuyLieu ? convertDateForAPI(formData.ngayQuyLieu) : null,
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
                    type="text"
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

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Phẩm Vị <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="rankId"
                    value={formData.rankId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.rankId
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-black"
                    }`}
                  >
                    <option value="">Chọn phẩm vị</option>
                    {ranks.map((rank) => (
                      <option key={rank.id} value={rank.id}>
                        {rank.displayName}
                      </option>
                    ))}
                  </select>
                  {errors.rankId && (
                    <p className="mt-2 text-sm text-red-600">{errors.rankId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Địa bàn */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Địa Bàn</h2>
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
              <h2 className="text-2xl font-bold text-black mb-6">Mốc Đạo</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Ngày Nhập Môn
                  </label>
                  <input
                    type="text"
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
                    type="text"
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
                    type="text"
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

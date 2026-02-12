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
    phone: "",
    email: "",
    address: "",
    rankId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchRanks();
  }, []);

  const fetchRanks = async () => {
    try {
      const response = await fetch("/api/ranks");
      const data = await response.json();
      setRanks(data.ranks || data);
    } catch (error) {
      console.error("Error fetching ranks:", error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Vui lòng chọn ngày sinh";
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
      // Check for duplicates
      const dupCheck = await fetch("/api/believers/duplicate-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
        }),
      });

      const dupResult = await dupCheck.json();

      if (dupResult.exists) {
        if (
          !confirm(
            `Đã tồn tại tín đồ có thông tin tương tự:\n- Họ tên: ${dupResult.believer.fullName}\n\nBạn có chắc muốn tiếp tục thêm?`
          )
        ) {
          setLoading(false);
          return;
        }
      }

      // Create believer
      const response = await fetch("/api/believers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-8">
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
          <div className="border-2 border-black rounded-lg p-8">
            <div className="space-y-6">
              {/* Holy Name & Full Name */}
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
              </div>

              {/* Date of Birth & Rank */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Ngày Sinh <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.dateOfBirth
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-black"
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Phẩm Vị
                  </label>
                  <select
                    name="rankId"
                    value={formData.rankId}
                    onChange={handleChange}
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
              </div>

              {/* Phone & Email */}
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

              {/* Address */}
              <div>
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

            {/* Submit Buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t-2 border-gray-200">
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

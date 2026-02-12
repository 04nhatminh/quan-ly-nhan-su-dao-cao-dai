'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DuplicateCandidate {
  id: string;
  fullName: string;
  dateOfBirth: string | null;
  hoDao: string | null;
  xaDao: string | null;
  reason: string;
  similarity: number;
}

export default function NewBelieverPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    xaDao: '',
    hoDao: '',
    ngayNhapMon: '',
    ngayTamThanh: '',
    traiKy: '',
    tuChan: '',
    fatherName: '',
    motherName: '',
    ngayCungCuu: '',
    note: '',
  });

  // Check for duplicates when key fields change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.fullName.length >= 3) {
        checkDuplicates();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.fullName, formData.dateOfBirth]);

  const checkDuplicates = async () => {
    setCheckingDuplicates(true);
    try {
      const response = await fetch('/api/believers/duplicate-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth || null,
          hoDao: formData.hoDao || null,
          xaDao: formData.xaDao || null,
          fatherName: formData.fatherName || null,
          motherName: formData.motherName || null,
        }),
      });
      
      const data = await response.json();
      setDuplicates(data.candidates || []);
      setShowDuplicateWarning(data.candidates?.length > 0);
    } catch (error) {
      console.error('Error checking duplicates:', error);
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showDuplicateWarning && duplicates.length > 0) {
      const confirmed = confirm(
        `Tìm thấy ${duplicates.length} tín đồ có thể trùng lặp. Bạn có chắc chắn muốn tiếp tục tạo mới?`
      );
      if (!confirmed) return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/believers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          xaDao: formData.xaDao || null,
          hoDao: formData.hoDao || null,
          ngayNhapMon: formData.ngayNhapMon || null,
          ngayTamThanh: formData.ngayTamThanh || null,
          traiKy: formData.traiKy || null,
          tuChan: formData.tuChan || null,
          fatherName: formData.fatherName || null,
          motherName: formData.motherName || null,
          ngayCungCuu: formData.ngayCungCuu || null,
          note: formData.note || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Không thể tạo tín đồ');
      }

      const believer = await response.json();
      alert('Tạo tín đồ thành công!');
      router.push(`/believers/${believer.id}`);
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <Link href="/believers" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium mb-4 transition">
          <span>←</span>
          <span>Quay lại danh sách</span>
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Thêm Tín Đồ Mới
        </h1>
        <p className="text-gray-600">Đăng ký thông tin tín đồ mới vào hệ thống</p>
      </div>

      {/* Duplicate Warning */}
      {showDuplicateWarning && duplicates.length > 0 && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-900 mb-3">
            Phát hiện {duplicates.length} tín đồ có thể trùng lặp
          </h3>
          <div className="mt-3">
            <ul className="space-y-2">
              {duplicates.map((dup) => (
                <li key={dup.id} className="flex items-start gap-2 p-3 bg-white rounded-lg">
                  <div>
                    <Link 
                      href={`/believers/${dup.id}`}
                      target="_blank"
                      className="font-semibold text-yellow-900 hover:text-yellow-700 hover:underline"
                    >
                      {dup.fullName}
                    </Link>
                    <span className="text-yellow-700"> - {dup.reason}</span>
                    {dup.hoDao && <span className="text-gray-600"> ({dup.hoDao})</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setShowDuplicateWarning(false)}
            className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-semibold transition"
          >
            Tôi hiểu, vẫn tiếp tục tạo mới
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
        {/* Thông tin cơ bản */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
            Thông tin cơ bản
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="input-field"
                placeholder="Nguyễn Văn A"
              />
              {checkingDuplicates && (
                <p className="mt-2 text-xs text-purple-600 font-medium">
                  Đang kiểm tra trùng lặp...
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Chọn giới tính</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
          </div>
        </div>

        {/* Thuộc địa bàn */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
            Thuộc địa bàn
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xã Đạo
              </label>
              <input
                type="text"
                name="xaDao"
                value={formData.xaDao}
                onChange={handleChange}
                className="input-field"
                placeholder="Xã Đạo Tân Hội"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ Đạo
              </label>
              <input
                type="text"
                name="hoDao"
                value={formData.hoDao}
                onChange={handleChange}
                className="input-field"
                placeholder="Họ Đạo Thái Bình"
              />
            </div>
          </div>
        </div>

        {/* Mốc đạo */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
            Mốc đạo
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày nhập môn
              </label>
              <input
                type="date"
                name="ngayNhapMon"
                value={formData.ngayNhapMon}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày Tam Thanh
              </label>
              <input
                type="date"
                name="ngayTamThanh"
                value={formData.ngayTamThanh}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Tu tập */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
            Tu tập
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trai Kỳ
              </label>
              <select
                name="traiKy"
                value={formData.traiKy}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Chọn trai kỳ</option>
                <option value="SIX_DAYS">6 ngày</option>
                <option value="TEN_DAYS">10 ngày</option>
                <option value="SIXTEEN_DAYS">16 ngày</option>
                <option value="FULL">Trường</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tu Chấn
              </label>
              <select
                name="tuChan"
                value={formData.tuChan}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Chọn tu chấn</option>
                <option value="LINH">Linh</option>
                <option value="TAM">Tâm</option>
                <option value="TAM_THOI">Tạm</option>
              </select>
            </div>
          </div>
        </div>

        {/* Gia đình & hậu sự */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
            Gia đình & Hậu sự
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên cha
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên mẹ
              </label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày cúng cửu
              </label>
              <input
                type="date"
                name="ngayCungCuu"
                value={formData.ngayCungCuu}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Ghi chú */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
            Ghi chú
          </h2>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={4}
            className="input-field"
            placeholder="Thông tin bổ sung..."
          />
        </div>

        {/* Submit buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Link
            href="/believers"
            className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Đang tạo...' : 'Tạo Tín Đồ'}
          </button>
        </div>
      </form>
    </div>
  );
}

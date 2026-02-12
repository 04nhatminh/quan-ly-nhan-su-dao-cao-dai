'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate, getGenderLabel, getTraiKyLabel, getTuChanLabel } from '@/lib/utils';

interface Believer {
  id: string;
  fullName: string;
  dateOfBirth: string | null;
  gender: string | null;
  xaDao: string | null;
  hoDao: string | null;
  traiKy: string | null;
  tuChan: string | null;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function BelieversListPage() {
  const [believers, setBelievers] = useState<Believer[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [traiKy, setTraiKy] = useState('');
  const [tuChan, setTuChan] = useState('');
  const [hoDao, setHoDao] = useState('');
  const [xaDao, setXaDao] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchBelievers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        sortBy,
        sortOrder,
      });
      
      if (search) params.append('search', search);
      if (gender) params.append('gender', gender);
      if (traiKy) params.append('traiKy', traiKy);
      if (tuChan) params.append('tuChan', tuChan);
      if (hoDao) params.append('hoDao', hoDao);
      if (xaDao) params.append('xaDao', xaDao);
      
      const response = await fetch(`/api/believers?${params}`);
      const data = await response.json();
      
      setBelievers(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching believers:', error);
      alert('Không thể tải danh sách tín đồ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBelievers();
  }, [pagination.page, sortBy, sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchBelievers();
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (gender) params.append('gender', gender);
    if (traiKy) params.append('traiKy', traiKy);
    if (tuChan) params.append('tuChan', tuChan);
    if (hoDao) params.append('hoDao', hoDao);
    if (xaDao) params.append('xaDao', xaDao);
    
    window.open(`/api/believers/export?${params}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="card-elevated p-8 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">Danh sách Tín Đồ</h1>
            <p className="text-gray-600">Quản lý và tìm kiếm thông tin tín đồ</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="btn-secondary flex items-center gap-2"
            >
              <span className="text-xl">📥</span>
              <span>Xuất CSV</span>
            </button>
            <Link
              href="/believers/new"
              className="btn-primary flex items-center gap-2"
            >
              <span className="text-xl">➕</span>
              <span>Thêm Tín Đồ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-elevated p-8 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🔍</span>
          <h2 className="text-xl font-bold text-gray-900">Bộ lọc tìm kiếm</h2>
        </div>
        <form onSubmit={handleSearch}>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm theo tên
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nhập họ tên..."
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ Đạo
              </label>
              <input
                type="text"
                value={hoDao}
                onChange={(e) => setHoDao(e.target.value)}
                placeholder="Nhập họ đạo..."
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xã Đạo
              </label>
              <input
                type="text"
                value={xaDao}
                onChange={(e) => setXaDao(e.target.value)}
                placeholder="Nhập xã đạo..."
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="input-field"
              >
                <option value="">Tất cả</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trai Kỳ
              </label>
              <select
                value={traiKy}
                onChange={(e) => setTraiKy(e.target.value)}
                className="input-field"
              >
                <option value="">Tất cả</option>
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
                value={tuChan}
                onChange={(e) => setTuChan(e.target.value)}
                className="input-field"
              >
                <option value="">Tất cả</option>
                <option value="LINH">Linh</option>
                <option value="TAM">Tâm</option>
                <option value="TAM_THOI">Tạm</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="btn-primary"
            >
              🔍 Tìm kiếm
            </button>
            
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="createdAt">Ngày tạo</option>
                <option value="fullName">Họ tên</option>
                <option value="dateOfBirth">Ngày sinh</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="card-elevated p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : believers.length === 0 ? (
        <div className="card-elevated p-16 text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500 text-lg">Không tìm thấy tín đồ nào</p>
        </div>
      ) : (
        <>
          <div className="card-elevated overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Họ và tên</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Ngày sinh</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Giới tính</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Họ Đạo</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Xã Đạo</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Trai Kỳ</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Tu Chấn</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {believers.map((believer) => (
                    <tr key={believer.id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {believer.fullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {believer.dateOfBirth ? formatDate(believer.dateOfBirth) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {believer.gender ? getGenderLabel(believer.gender as any) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {believer.hoDao || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {believer.xaDao || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {believer.traiKy ? getTraiKyLabel(believer.traiKy as any) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {believer.tuChan ? getTuChanLabel(believer.tuChan as any) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/believers/${believer.id}`}
                          className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-semibold hover:gap-2 transition-all"
                        >
                          <span>Chi tiết</span>
                          <span>→</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 card-elevated p-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <p className="text-sm font-semibold text-gray-700">
                Hiển thị {believers.length} trên tổng {pagination.total} tín đồ
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-5 py-2.5 border-2 border-purple-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 hover:border-purple-300 transition-all font-semibold text-gray-700"
              >
                ← Trước
              </button>
              <span className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="px-5 py-2.5 border-2 border-purple-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 hover:border-purple-300 transition-all font-semibold text-gray-700"
              >
                Sau →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

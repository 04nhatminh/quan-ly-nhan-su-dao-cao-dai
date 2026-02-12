'use client';

import { useState, useEffect } from 'react';
import { getRankGroupLabel } from '@/lib/utils';

interface Rank {
  id: string;
  group: string;
  code: string;
  displayName: string;
  order: number;
  isActive: boolean;
}

interface GroupedRanks {
  CUU_TRUNG_DAI: Rank[];
  PHUOC_THIEN: Rank[];
  HIEP_THIEN_DAI: Rank[];
}

export default function RanksPage() {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [grouped, setGrouped] = useState<GroupedRanks | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  // Form state for creating new rank
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    group: '',
    code: '',
    displayName: '',
    order: 1,
  });

  const fetchRanks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (showInactive) params.append('includeInactive', 'true');
      
      const response = await fetch(`/api/ranks?${params}`);
      const data = await response.json();
      
      setRanks(data.ranks);
      setGrouped(data.grouped);
    } catch (error) {
      console.error('Error fetching ranks:', error);
      alert('Không thể tải danh sách phẩm vị');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanks();
  }, [showInactive]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/ranks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Không thể tạo phẩm vị');
      }

      alert('Tạo phẩm vị thành công!');
      setShowForm(false);
      setFormData({ group: '', code: '', displayName: '', order: 1 });
      fetchRanks();
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleToggleActive = async (rankId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/ranks/${rankId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật');
      }

      fetchRanks();
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">Quản lý Phẩm Vị</h1>
            <p className="text-gray-600">Quản lý danh mục phẩm vị và cơ cấu tổ chức</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg font-semibold hover:shadow-md transition"
          >
            {showForm ? 'Đóng' : 'Thêm Phẩm Vị'}
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Thêm Phẩm Vị Mới</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhóm phẩm vị <span className="text-red-600">*</span>
                </label>
                <select
                  required
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  className="input-field"
                >
                  <option value="">Chọn nhóm</option>
                  <option value="CUU_TRUNG_DAI">Cửu Trùng Đài</option>
                  <option value="PHUOC_THIEN">Phước Thiện</option>
                  <option value="HIEP_THIEN_DAI">Hiệp Thiên Đài</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã phẩm vị <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="VD: GIAO_SU"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên hiển thị <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="VD: Giáo Sư"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thứ tự <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-md transition"
              >
                Tạo Phẩm Vị
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Show/Hide Inactive Toggle */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm font-medium text-gray-700">Hiển thị phẩm vị đã vô hiệu hóa</span>
        </label>
      </div>

      {/* Ranks List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600"></div>
          <p className="mt-3 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cửu Trùng Đài */}
          {grouped?.CUU_TRUNG_DAI && grouped.CUU_TRUNG_DAI.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {getRankGroupLabel('CUU_TRUNG_DAI')}
              </h2>
              <div className="space-y-2">
                {grouped.CUU_TRUNG_DAI.map((rank) => (
                  <div
                    key={rank.id}
                    className={`flex justify-between items-center p-3 rounded-lg border ${
                      rank.isActive ? 'bg-white' : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm w-6">{rank.order}</span>
                        <div>
                          <p className="font-medium text-gray-900">{rank.displayName}</p>
                          <p className="text-xs text-gray-500">{rank.code}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleActive(rank.id, rank.isActive)}
                      className={`px-3 py-1 text-xs rounded ${
                        rank.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {rank.isActive ? 'Hoạt động' : 'Đã vô hiệu'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phước Thiện */}
          {grouped?.PHUOC_THIEN && grouped.PHUOC_THIEN.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {getRankGroupLabel('PHUOC_THIEN')}
              </h2>
              <div className="space-y-2">
                {grouped.PHUOC_THIEN.map((rank) => (
                  <div
                    key={rank.id}
                    className={`flex justify-between items-center p-4 rounded-lg border transition ${
                      rank.isActive ? 'bg-gradient-to-r from-green-50 to-teal-50 border-green-200' : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-green-600 w-6">{rank.order}</span>
                        <div>
                          <p className="font-bold text-gray-900">{rank.displayName}</p>
                          <p className="text-xs text-gray-500 font-mono">{rank.code}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleActive(rank.id, rank.isActive)}
                      className={`px-3 py-1 text-xs font-semibold rounded transition ${
                        rank.isActive
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                      }`}
                    >
                      {rank.isActive ? 'Hoạt động' : 'Đã vô hiệu'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hiệp Thiên Đài */}
          {grouped?.HIEP_THIEN_DAI && grouped.HIEP_THIEN_DAI.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {getRankGroupLabel('HIEP_THIEN_DAI')}
              </h2>
              <div className="space-y-2">
                {grouped.HIEP_THIEN_DAI.map((rank) => (
                  <div
                    key={rank.id}
                    className={`flex justify-between items-center p-4 rounded-lg border transition ${
                      rank.isActive ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200' : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-orange-600 w-6">{rank.order}</span>
                        <div>
                          <p className="font-bold text-gray-900">{rank.displayName}</p>
                          <p className="text-xs text-gray-500 font-mono">{rank.code}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleActive(rank.id, rank.isActive)}
                      className={`px-3 py-1 text-xs font-semibold rounded transition ${
                        rank.isActive
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                      }`}
                    >
                      {rank.isActive ? 'Hoạt động' : 'Đã vô hiệu'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

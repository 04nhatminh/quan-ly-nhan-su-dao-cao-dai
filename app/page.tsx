import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-block">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-6 animate-pulse">
            Hệ thống Quản lý Tín Đồ Cao Đài
          </h1>
        </div>
        <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto">
          Quản lý thông tin tín đồ, phẩm vị và các hoạt động tu tập một cách hiện đại và hiệu quả
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {/* Card 1: Danh sách */}
        <Link 
          href="/believers"
          className="card-elevated p-8 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              📋
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Danh sách Tín Đồ
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Xem, tìm kiếm và lọc danh sách tín đồ với giao diện trực quan
            </p>
            <div className="mt-6 inline-flex items-center text-purple-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              Xem danh sách
              <span className="transform group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </Link>

        {/* Card 2: Thêm mới */}
        <Link 
          href="/believers/new"
          className="card-elevated p-8 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              ➕
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Thêm Tín Đồ
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Đăng ký thông tin tín đồ mới với kiểm tra trùng lặp thông minh
            </p>
            <div className="mt-6 inline-flex items-center text-green-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              Thêm mới
              <span className="transform group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </Link>

        {/* Card 3: Phẩm vị */}
        <Link 
          href="/ranks"
          className="card-elevated p-8 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              🏅
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Quản lý Phẩm Vị
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Quản lý danh mục phẩm vị và cơ cấu tổ chức đạo
            </p>
            <div className="mt-6 inline-flex items-center text-orange-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              Quản lý
              <span className="transform group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Features Section */}
      <div className="card-elevated p-10 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center gap-3 mb-8">
          <div className="text-4xl">✨</div>
          <h3 className="text-3xl font-bold text-gray-900">
            Tính năng nổi bật
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm hover:bg-white/80 transition-all">
            <div className="text-3xl">💾</div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Quản lý đầy đủ thông tin</h4>
              <p className="text-gray-600 text-sm">Cơ bản, địa bàn, mốc đạo, tu tập, gia đình</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm hover:bg-white/80 transition-all">
            <div className="text-3xl">⚠️</div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Cảnh báo trùng lặp</h4>
              <p className="text-gray-600 text-sm">Phát hiện thông minh khi nhập dữ liệu mới</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm hover:bg-white/80 transition-all">
            <div className="text-3xl">🔍</div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Tìm kiếm mạnh mẽ</h4>
              <p className="text-gray-600 text-sm">Lọc và sắp xếp linh hoạt theo nhiều tiêu chí</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm hover:bg-white/80 transition-all">
            <div className="text-3xl">📊</div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Xuất báo cáo</h4>
              <p className="text-gray-600 text-sm">Xuất danh sách ra file CSV dễ dàng</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm hover:bg-white/80 transition-all">
            <div className="text-3xl">📜</div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Lịch sử phong cấp</h4>
              <p className="text-gray-600 text-sm">Theo dõi quá trình phong phẩm vị</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm hover:bg-white/80 transition-all">
            <div className="text-3xl">🎨</div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Giao diện hiện đại</h4>
              <p className="text-gray-600 text-sm">Thiết kế đẹp mắt, dễ sử dụng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

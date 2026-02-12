import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";

export default function Home() {
  const features = [
    {
      title: "Danh sách Tín Đồ",
      description: "Xem, tìm kiếm và lọc danh sách tín đồ với giao diện trực quan",
      href: "/believers",
      color: "from-blue-500 to-purple-500",
    },
    {
      title: "Thêm Tín Đồ",
      description: "Đăng ký thông tin tín đồ mới với kiểm tra trùng lặp thông minh",
      href: "/believers/new",
      color: "from-green-500 to-teal-500",
    },
    {
      title: "Quản lý Phẩm Vị",
      description: "Quản lý danh mục phẩm vị và cơ cấu tổ chức đạo",
      href: "/ranks",
      color: "from-orange-500 to-pink-500",
    },
  ];

  const capabilities = [
    {
      title: "Quản lý đầy đủ thông tin",
      description: "Cơ bản, địa bàn, mốc đạo, tu tập, gia đình",
    },
    {
      title: "Cảnh báo trùng lặp",
      description: "Phát hiện thông minh khi nhập dữ liệu mới",
    },
    {
      title: "Tìm kiếm mạnh mẽ",
      description: "Lọc và sắp xếp linh hoạt theo nhiều tiêu chí",
    },
    {
      title: "Xuất báo cáo",
      description: "Xuất danh sách ra file CSV dễ dàng",
    },
    {
      title: "Lịch sử phong cấp",
      description: "Theo dõi quá trình phong phẩm vị",
    },
    {
      title: "Giao diện hiện đại",
      description: "Thiết kế đẹp mắt, dễ sử dụng",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Hệ thống Quản lý Tín Đồ Cao Đài
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Quản lý thông tin tín đồ, phẩm vị và các hoạt động tu tập một cách hiện đại và hiệu quả
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => (
          <Card key={feature.href} href={feature.href} hover className="group">
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}></div>
              <CardTitle className="mb-3">{feature.title}</CardTitle>
              <p className="text-gray-600 mb-4 text-sm">{feature.description}</p>
              <span className="text-purple-600 font-semibold inline-flex items-center text-sm">
                Xem chi tiết
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Capabilities Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tính năng nổi bật</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

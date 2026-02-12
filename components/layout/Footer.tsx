export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Hệ thống Quản lý Tín Đồ Cao Đài
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Được xây dựng để phục vụ cộng đồng Cao Đài
          </p>
        </div>
      </div>
    </footer>
  );
}

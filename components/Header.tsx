"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/believers") {
      return pathname === "/believers";
    }
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <div className="text-2xl font-bold text-white tracking-tight transition-all duration-200 hover:tracking-wide">
              CAO ĐÀI
            </div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
              Quản Lý Tín Đồ
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex gap-2">
            <Link
              href="/believers"
              className={`px-6 py-2.5 font-medium transition-all duration-200 border-2 rounded-lg ${
                isActive("/believers")
                  ? "bg-white text-black border-white"
                  : "text-white border-gray-600 hover:border-white hover:bg-white hover:text-black"
              }`}
            >
              Tín Đồ
            </Link>
            <Link
              href="/believers/new"
              className={`px-6 py-2.5 font-medium transition-all duration-200 border-2 rounded-lg ${
                isActive("/believers/new")
                  ? "bg-white text-black border-white"
                  : "text-white border-gray-600 hover:border-white hover:bg-white hover:text-black"
              }`}
            >
              Thêm Tín Đồ
            </Link>
            <Link
              href="/ranks"
              className={`px-6 py-2.5 font-medium transition-all duration-200 border-2 rounded-lg ${
                isActive("/ranks")
                  ? "bg-white text-black border-white"
                  : "text-white border-gray-600 hover:border-white hover:bg-white hover:text-black"
              }`}
            >
              Phẩm Vị
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Quản lý Tín Đồ Cao Đài",
  description: "Hệ thống quản lý nhân sự (tín đồ) cho Tôn giáo Cao Đài",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <div className="min-h-screen">
          {/* Header / Navigation */}
          <header className="backdrop-blur-md bg-white/80 border-b border-white/20 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
              <nav className="flex items-center justify-between h-20">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                    🏛️
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Quản lý Tín Đồ Cao Đài
                    </div>
                    <div className="text-xs text-gray-600">Hệ thống quản lý nhân sự</div>
                  </div>
                </Link>
                <div className="flex gap-2">
                  <Link 
                    href="/believers" 
                    className="px-5 py-2.5 text-gray-700 hover:text-purple-600 font-medium rounded-xl hover:bg-white/60 transition-all duration-200 flex items-center gap-2"
                  >
                    <span className="text-xl">📋</span>
                    <span>Danh sách</span>
                  </Link>
                  <Link 
                    href="/believers/new" 
                    className="px-5 py-2.5 text-gray-700 hover:text-purple-600 font-medium rounded-xl hover:bg-white/60 transition-all duration-200 flex items-center gap-2"
                  >
                    <span className="text-xl">➕</span>
                    <span>Thêm mới</span>
                  </Link>
                  <Link 
                    href="/ranks" 
                    className="px-5 py-2.5 text-gray-700 hover:text-purple-600 font-medium rounded-xl hover:bg-white/60 transition-all duration-200 flex items-center gap-2"
                  >
                    <span className="text-xl">🏅</span>
                    <span>Phẩm vị</span>
                  </Link>
                </div>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-12">
            {children}
          </main>

          {/* Footer */}
          <footer className="backdrop-blur-md bg-white/60 border-t border-white/20 mt-16">
            <div className="container mx-auto px-4 py-8 text-center">
              <div className="text-gray-700 font-medium mb-2">
                © {new Date().getFullYear()} Hệ thống Quản lý Tín Đồ Cao Đài
              </div>
              <div className="text-sm text-gray-600">
                Được xây dựng với ❤️ để phục vụ cộng đồng Cao Đài
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

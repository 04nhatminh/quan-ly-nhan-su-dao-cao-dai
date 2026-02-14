"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [stats, setStats] = useState({
    believers: 0,
    ranks: 0,
  });

  useEffect(() => {
    // Fetch statistics
    Promise.all([
      fetch("/api/believers").then((res) => res.json()),
      fetch("/api/ranks").then((res) => res.json()),
    ])
      .then(([believers, ranks]) => {
        setStats({
          believers: believers.length || 0,
          ranks: ranks.length || 0,
        });
      })
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-bold text-black tracking-tight">
              Hệ Thống Quản Lý
            </h1>
            <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
              Ứng dụng quản lý tín đồ Cao Đài
            </p>
            <div className="flex gap-4 justify-center pt-6">
              <Link
                href="/believers"
                className="px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Xem Danh Sách Tín Đồ
              </Link>
              <Link
                href="/believers/new"
                className="px-8 py-4 bg-white text-black font-medium rounded-lg border-2 border-black hover:bg-black hover:text-white transition-all duration-200"
              >
                Thêm Tín Đồ Mới
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border-2 border-black rounded-lg hover:shadow-xl transition-shadow duration-200">
              <div className="text-5xl font-bold text-black mb-2">
                {stats.believers}
              </div>
              <div className="text-xl text-gray-600 uppercase tracking-wide">
                Tín Đồ
              </div>
              <Link
                href="/believers"
                className="inline-block mt-4 text-black hover:underline font-medium"
              >
                Xem chi tiết →
              </Link>
            </div>
            <div className="p-8 border-2 border-black rounded-lg hover:shadow-xl transition-shadow duration-200">
              <div className="text-5xl font-bold text-black mb-2">
                {stats.ranks}
              </div>
              <div className="text-xl text-gray-600 uppercase tracking-wide">
                Phẩm Vị
              </div>
              <Link
                href="/ranks"
                className="inline-block mt-4 text-black hover:underline font-medium"
              >
                Xem chi tiết →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-black mb-12 text-center">
            Tính Năng Chính
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-300 rounded-lg hover:border-black transition-colors duration-200">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-black mb-2">
                Quản Lý Tín Đồ
              </h3>
              <p className="text-gray-600">
                Theo dõi thông tin chi tiết của từng tín đồ, bao gồm thánh danh,
                phẩm vị, và thông tin liên hệ.
              </p>
            </div>
            <div className="p-6 border border-gray-300 rounded-lg hover:border-black transition-colors duration-200">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-black mb-2">
                Quản Lý Phẩm Vị
              </h3>
              <p className="text-gray-600">
                Quản lý hệ thống phẩm vị với đầy đủ thông tin về từng cấp bậc
                và thứ bậc.
              </p>
            </div>
            <div className="p-6 border border-gray-300 rounded-lg hover:border-black transition-colors duration-200">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-black mb-2">
                Báo Cáo & Thống Kê
              </h3>
              <p className="text-gray-600">
                Xuất báo cáo và xem thống kê chi tiết về tín đồ và phân bổ phẩm
                trật.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
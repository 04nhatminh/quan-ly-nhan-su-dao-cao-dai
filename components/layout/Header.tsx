'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/believers', label: 'Danh sách Tín Đồ' },
    { href: '/believers/new', label: 'Thêm Tín Đồ' },
    { href: '/ranks', label: 'Phẩm Vị' },
  ];
  
  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Quản lý Tín Đồ Cao Đài
            </div>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDate, getGenderLabel, getTraiKyLabel, getTuChanLabel, getRankGroupLabel } from '@/lib/utils';
import prisma from '@/lib/prisma';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

interface Props {
  params: { id: string };
}

export default async function BelieverDetailPage({ params }: Props) {
  const believer = await prisma.believer.findUnique({
    where: { id: params.id },
    include: {
      rankAssignments: {
        include: {
          rank: true,
        },
        orderBy: {
          decisionDate: 'desc',
        },
      },
    },
  });

  if (!believer) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/believers" className="text-blue-600 hover:text-blue-800">
          ← Quay lại danh sách
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {believer.fullName}
        </h1>
        <p className="text-sm text-gray-500">
          Mã số: {believer.id}
        </p>
      </div>

      {/* Thông tin cơ bản */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
          Thông tin cơ bản
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Ngày sinh:</span>
            <p className="font-medium">{formatDate(believer.dateOfBirth) || '-'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Giới tính:</span>
            <p className="font-medium">{getGenderLabel(believer.gender) || '-'}</p>
          </div>
        </div>
      </div>

      {/* Thuộc địa bàn */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
          Thuộc địa bàn
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Xã Đạo:</span>
            <p className="font-medium">{believer.xaDao || '-'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Họ Đạo:</span>
            <p className="font-medium">{believer.hoDao || '-'}</p>
          </div>
        </div>
      </div>

      {/* Mốc đạo */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
          Mốc đạo
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Ngày nhập môn:</span>
            <p className="font-medium">{formatDate(believer.ngayNhapMon) || '-'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Ngày Tam Thanh:</span>
            <p className="font-medium">{formatDate(believer.ngayTamThanh) || '-'}</p>
          </div>
        </div>
      </div>

      {/* Tu tập */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
          Tu tập
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Trai Kỳ:</span>
            <p className="font-medium">{getTraiKyLabel(believer.traiKy) || '-'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Tu Chấn:</span>
            <p className="font-medium">{getTuChanLabel(believer.tuChan) || '-'}</p>
          </div>
        </div>
      </div>

      {/* Gia đình & hậu sự */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
          Gia đình & Hậu sự
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-gray-600">Tên cha:</span>
            <p className="font-medium">{believer.fatherName || '-'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Tên mẹ:</span>
            <p className="font-medium">{believer.motherName || '-'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Ngày cúng cửu:</span>
            <p className="font-medium">{formatDate(believer.ngayCungCuu) || '-'}</p>
          </div>
        </div>
      </div>

      {/* Lịch sử phẩm vị */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
          Lịch sử Phẩm Vị
        </h2>
        {believer.rankAssignments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Chưa có phẩm vị nào</p>
        ) : (
          <div className="space-y-4">
            {believer.rankAssignments.map((assignment) => (
              <div 
                key={assignment.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {assignment.rank.displayName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getRankGroupLabel(assignment.rank.group as any)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Quyết định số:</p>
                    <p className="font-medium">{assignment.decisionNumber}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-2 text-sm mt-3">
                  <div>
                    <span className="text-gray-600">Ngày quyết định:</span>
                    <span className="ml-2 font-medium">
                      {formatDate(assignment.decisionDate) || '-'}
                    </span>
                  </div>
                  {assignment.decisionNote && (
                    <div>
                      <span className="text-gray-600">Ghi chú:</span>
                      <span className="ml-2">{assignment.decisionNote}</span>
                    </div>
                  )}
                  {assignment.decisionFileUrl && (
                    <div className="md:col-span-2">
                      <a 
                        href={assignment.decisionFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        📎 Xem file quyết định
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ghi chú */}
      {believer.note && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
            Ghi chú
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">{believer.note}</p>
        </div>
      )}

      {/* Meta info */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
          <div>
            <span>Ngày tạo:</span>
            <span className="ml-2 font-medium">
              {formatDate(believer.createdAt)}
            </span>
          </div>
          <div>
            <span>Cập nhật cuối:</span>
            <span className="ml-2 font-medium">
              {formatDate(believer.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

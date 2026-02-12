import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { normalizeVietnameseString } from '@/lib/normalize';
import { Gender, TraiKy, TuChan } from '@prisma/client';
import { format } from 'date-fns';

/**
 * GET /api/believers/export
 * Export danh sách tín đồ ra CSV
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Search
    const search = searchParams.get('search') || '';
    
    // Filters (same as list API)
    const gender = searchParams.get('gender') as Gender | null;
    const traiKy = searchParams.get('traiKy') as TraiKy | null;
    const tuChan = searchParams.get('tuChan') as TuChan | null;
    const hoDao = searchParams.get('hoDao') || '';
    const xaDao = searchParams.get('xaDao') || '';
    
    // Build where clause
    const where: any = {};
    
    if (search) {
      const normalizedSearch = normalizeVietnameseString(search);
      where.fullNameNormalized = {
        contains: normalizedSearch,
      };
    }
    
    if (gender) where.gender = gender;
    if (traiKy) where.traiKy = traiKy;
    if (tuChan) where.tuChan = tuChan;
    if (hoDao) where.hoDao = { contains: hoDao };
    if (xaDao) where.xaDao = { contains: xaDao };
    
    // Fetch all matching believers
    const believers = await prisma.believer.findMany({
      where,
      orderBy: {
        fullName: 'asc',
      },
    });
    
    // Helper functions for labels
    const getGenderLabel = (g: Gender | null) => {
      if (!g) return '';
      return { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' }[g];
    };
    
    const getTraiKyLabel = (tk: TraiKy | null) => {
      if (!tk) return '';
      return { SIX_DAYS: '6 ngày', TEN_DAYS: '10 ngày', SIXTEEN_DAYS: '16 ngày', FULL: 'Trường' }[tk];
    };
    
    const getTuChanLabel = (tc: TuChan | null) => {
      if (!tc) return '';
      return { LINH: 'Linh', TAM: 'Tâm', TAM_THOI: 'Tạm' }[tc];
    };
    
    const formatDate = (date: Date | null) => {
      if (!date) return '';
      return format(date, 'dd/MM/yyyy');
    };
    
    // Build CSV
    const headers = [
      'Họ và tên',
      'Ngày sinh',
      'Giới tính',
      'Xã Đạo',
      'Họ Đạo',
      'Ngày nhập môn',
      'Ngày Tam Thanh',
      'Trai Kỳ',
      'Tu Chấn',
      'Tên cha',
      'Tên mẹ',
      'Ngày cúng cửu',
      'Ghi chú',
    ];
    
    const rows = believers.map((b: { fullName: any; dateOfBirth: Date | null; gender: Gender | null; xaDao: any; hoDao: any; ngayNhapMon: Date | null; ngayTamThanh: Date | null; traiKy: TraiKy | null; tuChan: TuChan | null; fatherName: any; motherName: any; ngayCungCuu: Date | null; note: any; }) => [
      b.fullName,
      formatDate(b.dateOfBirth),
      getGenderLabel(b.gender),
      b.xaDao || '',
      b.hoDao || '',
      formatDate(b.ngayNhapMon),
      formatDate(b.ngayTamThanh),
      getTraiKyLabel(b.traiKy),
      getTuChanLabel(b.tuChan),
      b.fatherName || '',
      b.motherName || '',
      formatDate(b.ngayCungCuu),
      b.note || '',
    ]);
    
    // Convert to CSV format
    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => 
        row.map((cell: any) => {
          // Escape cells containing comma, quotes, or newlines
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(',')
      ),
    ].join('\n');
    
    // Add BOM for UTF-8 encoding (helps Excel recognize UTF-8)
    const bom = '\uFEFF';
    const csvWithBom = bom + csvContent;
    
    // Return CSV file
    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="danh-sach-tin-do-${format(new Date(), 'yyyy-MM-dd')}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting believers:', error);
    return NextResponse.json(
      { error: 'Không thể xuất file CSV' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { RankGroup } from '@prisma/client';

const createRankSchema = z.object({
  group: z.enum(['CUU_TRUNG_DAI', 'PHUOC_THIEN', 'HIEP_THIEN_DAI']),
  code: z.string().min(1, 'Mã phẩm vị là bắt buộc'),
  displayName: z.string().min(1, 'Tên hiển thị là bắt buộc'),
  order: z.number().int().positive(),
});

/**
 * GET /api/ranks
 * Lấy danh sách phẩm vị
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    const where: any = {};
    if (!includeInactive) {
      where.isActive = true;
    }
    
    const ranks = await prisma.rank.findMany({
      where,
      orderBy: [
        { group: 'asc' },
        { order: 'asc' },
      ],
    });
    
    // Group by RankGroup
    const grouped = ranks.reduce((acc: { [x: string]: any[]; }, rank: { group: string | number; }) => {
      if (!acc[rank.group]) {
        acc[rank.group] = [];
      }
      acc[rank.group].push(rank);
      return acc;
    }, {} as Record<RankGroup, typeof ranks>);
    
    return NextResponse.json({
      ranks,
      grouped,
    });
  } catch (error) {
    console.error('Error fetching ranks:', error);
    return NextResponse.json(
      { error: 'Không thể tải danh sách phẩm vị' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ranks
 * Tạo mới phẩm vị
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createRankSchema.parse(body);
    
    // Check if code already exists
    const existing = await prisma.rank.findUnique({
      where: { code: validated.code },
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'Mã phẩm vị đã tồn tại' },
        { status: 400 }
      );
    }
    
    const rank = await prisma.rank.create({
      data: validated,
    });
    
    return NextResponse.json(rank, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Error creating rank:', error);
    return NextResponse.json(
      { error: 'Không thể tạo mới phẩm vị' },
      { status: 500 }
    );
  }
}

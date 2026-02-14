import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const updateRankSchema = z.object({
  displayName: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

/**
 * GET /api/ranks/[id]
 * Lấy chi tiết một phẩm vị
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rank = await prisma.rank.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            believer: true,
          },
          orderBy: {
            decisionDate: 'desc',
          },
        },
      },
    });
    
    if (!rank) {
      return NextResponse.json(
        { error: 'Không tìm thấy phẩm vị' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(rank);
  } catch (error) {
    console.error('Error fetching rank:', error);
    return NextResponse.json(
      { error: 'Không thể tải thông tin phẩm vị' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ranks/[id]
 * Cập nhật phẩm vị
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateRankSchema.parse(body);
    
    const rank = await prisma.rank.update({
      where: { id },
      data: validated,
    });
    
    return NextResponse.json(rank);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Error updating rank:', error);
    return NextResponse.json(
      { error: 'Không thể cập nhật phẩm vị' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ranks/[id]
 * Xóa phẩm vị
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if rank is in use
    const assignments = await prisma.rankAssignment.count({
      where: { rankId: id },
    });
    
    if (assignments > 0) {
      return NextResponse.json(
        { error: 'Không thể xóa phẩm vị đang được sử dụng' },
        { status: 400 }
      );
    }
    
    await prisma.rank.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting rank:', error);
    return NextResponse.json(
      { error: 'Không thể xóa phẩm vị' },
      { status: 500 }
    );
  }
}


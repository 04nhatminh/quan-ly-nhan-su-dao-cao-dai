import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const updateRankSchema = z.object({
  displayName: z.string().min(1).optional(),
  order: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

/**
 * PATCH /api/ranks/[id]
 * Cập nhật phẩm vị
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateRankSchema.parse(body);
    
    const rank = await prisma.rank.update({
      where: { id: params.id },
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

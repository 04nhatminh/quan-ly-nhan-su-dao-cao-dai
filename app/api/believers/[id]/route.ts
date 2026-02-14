import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/believers/[id]
 * Lấy chi tiết một tín đồ
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const believer = await prisma.believer.findUnique({
      where: { id },
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
      return NextResponse.json(
        { error: 'Không tìm thấy tín đồ' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(believer);
  } catch (error) {
    console.error('Error fetching believer:', error);
    return NextResponse.json(
      { error: 'Không thể tải thông tin tín đồ' },
      { status: 500 }
    );
  }
}

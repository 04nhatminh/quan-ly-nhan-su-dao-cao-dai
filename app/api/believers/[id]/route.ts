import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { normalizeVietnameseString } from '@/lib/normalize';

// Validation schema cho cập nhật Believer
const updateBelieverSchema = z.object({
  fullName: z.string().min(1).optional(),
  holyName: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  xaDao: z.string().optional().nullable(),
  hoDao: z.string().optional().nullable(),
  ngayNhapMon: z.string().optional().nullable(),
  ngayTamThanh: z.string().optional().nullable(),
  traiKy: z
    .string()
    .transform(val => val === '' ? null : val)
    .refine(val => val === null || ['SIX_DAYS', 'TEN_DAYS', 'SIXTEEN_DAYS', 'FULL'].includes(val), 'Giá trị không hợp lệ')
    .optional()
    .nullable(),
  tuChan: z
    .string()
    .transform(val => val === '' ? null : val)
    .refine(val => val === null || ['LINH', 'TRUONG', 'TAM', 'TBHC'].includes(val), 'Giá trị không hợp lệ')
    .optional()
    .nullable(),
  fatherName: z.string().optional().nullable(),
  motherName: z.string().optional().nullable(),
  ngayQuyLieu: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  rankAssignments: z.array(
    z.object({
      id: z.string(),
      rankId: z.string().min(1, 'Phẩm vị là bắt buộc'),
      decisionNumber: z.string().optional().nullable(),
      decisionDate: z.string().optional().nullable(),
    })
  ).optional(),
});

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

/**
 * PUT /api/believers/[id]
 * Cập nhật thông tin tín đồ
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Kiểm tra tín đồ tồn tại
    const existingBeliever = await prisma.believer.findUnique({
      where: { id },
    });

    if (!existingBeliever) {
      return NextResponse.json(
        { error: 'Không tìm thấy tín đồ' },
        { status: 404 }
      );
    }

    // Validate dữ liệu
    const validated = updateBelieverSchema.parse(body);

    // Chuẩn bị dữ liệu để cập nhật
    const data: any = {};

    if (validated.fullName !== undefined) {
      data.fullName = validated.fullName;
      data.fullNameNormalized = normalizeVietnameseString(validated.fullName);
    }

    if (validated.holyName !== undefined) data.holyName = validated.holyName;
    if (validated.gender !== undefined) data.gender = validated.gender;
    if (validated.phone !== undefined) data.phone = validated.phone;
    if (validated.email !== undefined) data.email = validated.email;
    if (validated.address !== undefined) data.address = validated.address;
    if (validated.xaDao !== undefined) data.xaDao = validated.xaDao;
    if (validated.hoDao !== undefined) data.hoDao = validated.hoDao;
    if (validated.tuChan !== undefined) data.tuChan = validated.tuChan;
    if (validated.fatherName !== undefined) data.fatherName = validated.fatherName;
    if (validated.motherName !== undefined) data.motherName = validated.motherName;
    if (validated.note !== undefined) data.note = validated.note;

    // Chuyển đổi chuỗi ngày thành Date objects
    if (validated.dateOfBirth !== undefined) {
      data.dateOfBirth = validated.dateOfBirth ? new Date(validated.dateOfBirth) : null;
    }
    if (validated.ngayNhapMon !== undefined) {
      data.ngayNhapMon = validated.ngayNhapMon ? new Date(validated.ngayNhapMon) : null;
    }
    if (validated.ngayTamThanh !== undefined) {
      data.ngayTamThanh = validated.ngayTamThanh ? new Date(validated.ngayTamThanh) : null;
    }
    if (validated.ngayQuyLieu !== undefined) {
      data.ngayQuyLieu = validated.ngayQuyLieu ? new Date(validated.ngayQuyLieu) : null;
    }
    if (validated.traiKy !== undefined) data.traiKy = validated.traiKy;

    // Cập nhật tín đồ
    const updatedBeliever = await prisma.believer.update({
      where: { id },
      data,
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

    // Handle rankAssignments if provided
    if (validated.rankAssignments && validated.rankAssignments.length > 0) {
      // Get existing rank assignments
      const existingRankAssignments = await prisma.rankAssignment.findMany({
        where: { believerId: id },
      });

      const existingIds = new Set(existingRankAssignments.map(r => r.id));
      const providedIds = new Set(validated.rankAssignments.map(r => r.id));

      // Delete rank assignments that are no longer in the list
      const toDelete = existingRankAssignments.filter(r => !providedIds.has(r.id));
      for (const ra of toDelete) {
        await prisma.rankAssignment.delete({
          where: { id: ra.id },
        });
      }

      // Update or create rank assignments
      for (const rankAssignment of validated.rankAssignments) {
        if (existingIds.has(rankAssignment.id)) {
          // Update existing
          await prisma.rankAssignment.update({
            where: { id: rankAssignment.id },
            data: {
              rankId: rankAssignment.rankId,
              decisionNumber: rankAssignment.decisionNumber || '',
              decisionDate: rankAssignment.decisionDate ? new Date(rankAssignment.decisionDate) : null,
            },
          });
        } else {
          // Create new (id is generated by client, but we'll create with new database id)
          await prisma.rankAssignment.create({
            data: {
              believerId: id,
              rankId: rankAssignment.rankId,
              decisionNumber: rankAssignment.decisionNumber || '',
              decisionDate: rankAssignment.decisionDate ? new Date(rankAssignment.decisionDate) : null,
            },
          });
        }
      }
    }

    // Fetch believer again to get updated rankAssignments
    return NextResponse.json(
      await prisma.believer.findUnique({
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
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating believer:', error);
    return NextResponse.json(
      { error: 'Không thể cập nhật thông tin tín đồ' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/believers/[id]
 * Xóa một tín đồ
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Kiểm tra tín đồ tồn tại
    const believer = await prisma.believer.findUnique({
      where: { id },
    });

    if (!believer) {
      return NextResponse.json(
        { error: 'Không tìm thấy tín đồ' },
        { status: 404 }
      );
    }

    // Xóa tín đồ (sera xóa cascade rankAssignments nếu được cấu hình trong schema)
    await prisma.believer.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Đã xóa tín đồ thành công' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting believer:', error);
    return NextResponse.json(
      { error: 'Không thể xóa tín đồ' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { normalizeVietnameseString } from '@/lib/normalize';
import { Gender, TraiKy, TuChan } from '@prisma/client';

// Validation schema cho tạo mới Believer
const createBelieverSchema = z.object({
  fullName: z.string().min(1, 'Họ tên là bắt buộc'),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional().nullable(),
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
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  rankAssignments: z.array(
    z.object({
      rankId: z.string().min(1, 'Phẩm vị là bắt buộc'),
      decisionNumber: z.string().optional().nullable(),
      decisionDate: z.string().optional().nullable(),
    })
  ).optional().default([]),
});

/**
 * GET /api/believers
 * Lấy danh sách tín đồ với filter, search, sort, pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const skip = (page - 1) * pageSize;
    
    // Search
    const search = searchParams.get('search') || '';
    
    // Filters
    const gender = searchParams.get('gender') as Gender | null;
    const traiKy = searchParams.get('traiKy') as TraiKy | null;
    const tuChan = searchParams.get('tuChan') as TuChan | null;
    const hoDao = searchParams.get('hoDao') || '';
    const xaDao = searchParams.get('xaDao') || '';
    
    // Sort
    let sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    
    // Các trường hợp lệ để sort
    const validSortFields = ['fullName', 'dateOfBirth', 'gender', 'createdAt', 'updatedAt'];
    if (!validSortFields.includes(sortBy)) {
      sortBy = 'createdAt';
    }
    
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
    
    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;
    
    // Execute query
    const [believers, total] = await Promise.all([
      prisma.believer.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          rankAssignments: {
            include: {
              rank: true,
            },
            orderBy: {
              decisionDate: 'desc',
            },
            take: 1,
          },
        },
      }),
      prisma.believer.count({ where }),
    ]);
    
    return NextResponse.json({
      data: believers,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching believers:', error);
    return NextResponse.json(
      { error: 'Không thể tải danh sách tín đồ' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/believers
 * Tạo mới tín đồ
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate
    const validated = createBelieverSchema.parse(body);
    
    // Prepare data
    const data: any = {
      fullName: validated.fullName,
      fullNameNormalized: normalizeVietnameseString(validated.fullName),
    };
    
    // Convert date strings to Date objects
    if (validated.dateOfBirth) data.dateOfBirth = new Date(validated.dateOfBirth);
    if (validated.ngayNhapMon) data.ngayNhapMon = new Date(validated.ngayNhapMon);
    if (validated.ngayTamThanh) data.ngayTamThanh = new Date(validated.ngayTamThanh);
    if (validated.ngayQuyLieu) data.ngayQuyLieu = new Date(validated.ngayQuyLieu);
    
    // Copy other fields
    if (validated.gender) data.gender = validated.gender;
    if (validated.xaDao) data.xaDao = validated.xaDao;
    if (validated.hoDao) data.hoDao = validated.hoDao;
    if (validated.traiKy) data.traiKy = validated.traiKy;
    if (validated.tuChan) data.tuChan = validated.tuChan;
    if (validated.fatherName) data.fatherName = validated.fatherName;
    if (validated.motherName) data.motherName = validated.motherName;
    if (validated.note) data.note = validated.note;
    if (validated.phone) data.phone = validated.phone;
    if (validated.email) data.email = validated.email;
    if (validated.address) data.address = validated.address;
    
    // Create believer
    const believer = await prisma.believer.create({
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

    // Create RankAssignments if provided
    if (validated.rankAssignments && validated.rankAssignments.length > 0) {
      for (const rankAssignment of validated.rankAssignments) {
        await prisma.rankAssignment.create({
          data: {
            believerId: believer.id,
            rankId: rankAssignment.rankId,
            decisionDate: rankAssignment.decisionDate ? new Date(rankAssignment.decisionDate) : null,
            decisionNumber: rankAssignment.decisionNumber || '',
          },
        });
      }

      // Fetch believer again to get updated rankAssignments
      return NextResponse.json(
        await prisma.believer.findUnique({
          where: { id: believer.id },
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
        }),
        { status: 201 }
      );
    }
    
    return NextResponse.json(believer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Error creating believer:', error);
    return NextResponse.json(
      { error: 'Không thể tạo mới tín đồ' },
      { status: 500 }
    );
  }
}

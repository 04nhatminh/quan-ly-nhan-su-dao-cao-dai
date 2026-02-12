import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { normalizeVietnameseString, calculateStringSimilarity } from '@/lib/normalize';

interface DuplicateCandidate {
  id: string;
  fullName: string;
  dateOfBirth: Date | null;
  hoDao: string | null;
  xaDao: string | null;
  reason: string;
  similarity: number;
}

/**
 * POST /api/believers/duplicate-check
 * Kiểm tra trùng lặp khi nhập tín đồ mới
 * 
 * Body: { fullName, dateOfBirth?, hoDao?, xaDao?, fatherName?, motherName? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, dateOfBirth, hoDao, xaDao, fatherName, motherName } = body;
    
    if (!fullName) {
      return NextResponse.json({ candidates: [] });
    }
    
    const normalizedName = normalizeVietnameseString(fullName);
    const candidates: DuplicateCandidate[] = [];
    
    // Tìm những người có tên giống hoặc gần giống
    const potentialDuplicates = await prisma.believer.findMany({
      where: {
        fullNameNormalized: {
          contains: normalizedName.split(' ')[0], // Tìm theo họ
        },
      },
      select: {
        id: true,
        fullName: true,
        fullNameNormalized: true,
        dateOfBirth: true,
        hoDao: true,
        xaDao: true,
        fatherName: true,
        motherName: true,
      },
    });
    
    for (const person of potentialDuplicates) {
      const similarity = calculateStringSimilarity(fullName, person.fullName);
      let reason = '';
      let score = 0;
      
      // Mức 1: Tên trùng hoàn toàn
      if (similarity >= 0.95) {
        reason = 'Trùng họ tên';
        score = 100;
        
        // Mức 2: Tên + ngày sinh trùng
        if (dateOfBirth && person.dateOfBirth) {
          const inputDate = new Date(dateOfBirth);
          if (inputDate.getTime() === person.dateOfBirth.getTime()) {
            reason = 'Trùng họ tên và ngày sinh';
            score = 200;
          }
        }
        
        // Mức 3: Tên + ngày sinh + địa bàn
        if (score === 200 && hoDao && person.hoDao && hoDao === person.hoDao) {
          reason = 'Trùng họ tên, ngày sinh và họ đạo';
          score = 300;
        }
      }
      // Mức 4: Tên gần giống + các yếu tố khác
      else if (similarity >= 0.8) {
        reason = `Họ tên gần giống (${Math.round(similarity * 100)}%)`;
        score = 50;
        
        // Có cùng ngày sinh
        if (dateOfBirth && person.dateOfBirth) {
          const inputDate = new Date(dateOfBirth);
          if (inputDate.getTime() === person.dateOfBirth.getTime()) {
            reason += ', cùng ngày sinh';
            score += 50;
          }
        }
        
        // Có cùng địa bàn
        if (hoDao && person.hoDao && hoDao === person.hoDao) {
          reason += ', cùng họ đạo';
          score += 30;
        }
        
        // Có cùng cha/mẹ
        if (fatherName && person.fatherName) {
          const fatherSimilarity = calculateStringSimilarity(fatherName, person.fatherName);
          if (fatherSimilarity >= 0.9) {
            reason += ', cùng tên cha';
            score += 40;
          }
        }
      }
      
      // Chỉ thêm vào candidates nếu có lý do nghi ngờ trùng
      if (score >= 50) {
        candidates.push({
          id: person.id,
          fullName: person.fullName,
          dateOfBirth: person.dateOfBirth,
          hoDao: person.hoDao,
          xaDao: person.xaDao,
          reason,
          similarity: score,
        });
      }
    }
    
    // Sắp xếp theo độ tương đồng giảm dần
    candidates.sort((a, b) => b.similarity - a.similarity);
    
    return NextResponse.json({
      candidates: candidates.slice(0, 5), // Chỉ trả về tối đa 5 candidates
    });
  } catch (error) {
    console.error('Error checking duplicates:', error);
    return NextResponse.json(
      { error: 'Không thể kiểm tra trùng lặp' },
      { status: 500 }
    );
  }
}

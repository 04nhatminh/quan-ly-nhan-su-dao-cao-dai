import { PrismaClient, RankGroup } from '@prisma/client';

const prisma = new PrismaClient();

// Danh sách phẩm vị theo yêu cầu
const defaultRanks = [
  // CUU_TRUNG_DAI (Cửu Trùng Đài)
  { group: RankGroup.CUU_TRUNG_DAI, code: 'TIN_DO', displayName: 'Tín Đồ' },
  { group: RankGroup.CUU_TRUNG_DAI, code: 'CHANH_TRI_SU', displayName: 'Chánh Trị Sự' },
  { group: RankGroup.CUU_TRUNG_DAI, code: 'PHO_TRI_SU', displayName: 'Phó Trị Sự' },
  { group: RankGroup.CUU_TRUNG_DAI, code: 'THONG_SU', displayName: 'Thông Sự' },
  { group: RankGroup.CUU_TRUNG_DAI, code: 'LE_SANH', displayName: 'Lễ Sanh' },
  { group: RankGroup.CUU_TRUNG_DAI, code: 'QUYEN_GIAO_HUU', displayName: 'Quyền Giáo Hữu' },
  { group: RankGroup.CUU_TRUNG_DAI, code: 'GIAO_HUU', displayName: 'Giáo Hữu' },
  
  // PHUOC_THIEN (Phước Thiện)
  { group: RankGroup.PHUOC_THIEN, code: 'DU_THIEN', displayName: 'Dự Thiện' },
  { group: RankGroup.PHUOC_THIEN, code: 'THINH_THIEN', displayName: 'Thính Thiện' },
  { group: RankGroup.PHUOC_THIEN, code: 'HANH_THIEN', displayName: 'Hành Thiện' },
  
  // HIEP_THIEN_DAI (Hiệp Thiên Đài)
  { group: RankGroup.HIEP_THIEN_DAI, code: 'TUNG_SI_QUAN', displayName: 'Tùng Sĩ Quân' },
  { group: RankGroup.HIEP_THIEN_DAI, code: 'LUAT_SU', displayName: 'Luật Sự' },
];

async function main() {
  console.log('Starting seed...');
  
  // Seed Ranks
  console.log('Creating ranks...');
  for (const rank of defaultRanks) {
    await prisma.rank.upsert({
      where: { code: rank.code },
      update: {},
      create: rank,
    });
  }
  console.log('Ranks created successfully');
  
  // Optional: Seed some sample believers for testing
  console.log('Creating sample believers...');
  
  const sampleBelievers = [
    {
      fullName: 'Nguyễn Văn A',
      fullNameNormalized: 'nguyen van a',
      dateOfBirth: new Date('1980-01-15'),
      gender: 'MALE',
      xaDao: 'Xã Đạo Tân Hội',
      hoDao: 'Họ Đạo Thái Bình',
      ngayNhapMon: new Date('2000-05-20'),
      traiKy: 'TEN_DAYS',
      tuChan: 'LINH',
      fatherName: 'Nguyễn Văn B',
      motherName: 'Trần Thị C',
    },
    {
      fullName: 'Trần Thị D',
      fullNameNormalized: 'tran thi d',
      dateOfBirth: new Date('1985-03-10'),
      gender: 'FEMALE',
      xaDao: 'Xã Đạo Tân Hội',
      hoDao: 'Họ Đạo Thái Bình',
      ngayNhapMon: new Date('2005-08-15'),
      ngayTamThanh: new Date('2008-10-10'),
      traiKy: 'SIXTEEN_DAYS',
      tuChan: 'TAM',
      fatherName: 'Trần Văn E',
      motherName: 'Lê Thị F',
    },
  ];
  
  for (const believer of sampleBelievers) {
    await prisma.believer.create({
      data: believer as any,
    });
  }
  
  console.log('Sample believers created successfully');
  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

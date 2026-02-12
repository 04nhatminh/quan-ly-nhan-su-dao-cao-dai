# Hệ Thống Quản Lý Tín Đồ Cao Đài

Ứng dụng web quản lý thông tin nhân sự (tín đồ) cho Tôn giáo Cao Đài tại Việt Nam.

## 🎯 Tính năng chính

- ✅ **Quản lý tín đồ**: CRUD đầy đủ với các thông tin: cơ bản, địa bàn, mốc đạo, tu tập, gia đình
- ✅ **Cảnh báo trùng lặp**: Phát hiện thông minh khi nhập tín đồ mới (trùng tên, ngày sinh, địa bàn)
- ✅ **Tìm kiếm & Lọc**: Search theo tên, filter theo nhiều tiêu chí, sort linh hoạt
- ✅ **Xuất CSV**: Export danh sách ra file CSV với encoding UTF-8
- ✅ **Quản lý Phẩm Vị**: CRUD danh mục phẩm vị theo 3 nhóm (Cửu Trùng Đài, Phước Thiện, Hiệp Thiên Đài)
- ✅ **Lịch sử phong/cấp**: Theo dõi lịch sử phẩm vị của từng tín đồ

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: MongoDB Atlas
- **ORM**: Prisma
- **UI**: Tailwind CSS
- **Validation**: Zod
- **Deployment**: Vercel

## 📋 Yêu cầu

- Node.js 18+
- MongoDB Atlas account (hoặc MongoDB local)
- npm/yarn/pnpm

## 🚀 Cài đặt & Chạy Local

### 1. Clone và cài đặt dependencies

```bash
# Clone repository (nếu từ git)
git clone <repository-url>
cd quan-ly-nhan-su-dao-Cao-Dai

# Cài đặt dependencies
npm install
```

### 2. Cấu hình Database

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Sửa file `.env` và thêm MongoDB connection string:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/cao-dai-db?retryWrites=true&w=majority"
```

**Lấy MongoDB Atlas connection string:**

1. Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo cluster mới (hoặc dùng cluster có sẵn)
3. Click "Connect" → "Connect your application"
4. Copy connection string và thay `<username>`, `<password>`, `<database>`

### 3. Setup Database Schema

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data (phẩm vị + sample data)
npm run db:seed
```

### 4. Chạy Development Server

```bash
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000)

## 📁 Cấu trúc thư mục

```
quan-ly-nhan-su-dao-Cao-Dai/
├── app/
│   ├── api/                    # API Routes
│   │   ├── believers/          # Believers endpoints
│   │   │   ├── route.ts        # GET list, POST create
│   │   │   ├── [id]/route.ts   # GET detail
│   │   │   ├── duplicate-check/route.ts
│   │   │   └── export/route.ts # CSV export
│   │   └── ranks/              # Ranks endpoints
│   │       ├── route.ts        # GET list, POST create
│   │       └── [id]/route.ts   # PATCH update
│   ├── believers/              # Believers pages
│   │   ├── page.tsx            # List page
│   │   ├── new/page.tsx        # Create page
│   │   └── [id]/page.tsx       # Detail page
│   ├── ranks/page.tsx          # Ranks management
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── lib/
│   ├── prisma.ts               # Prisma client
│   ├── normalize.ts            # Vietnamese string normalization
│   └── utils.ts                # Utility functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data
├── .env                        # Environment variables (DO NOT commit)
├── .env.example                # Environment template
└── package.json
```

## 🗄️ Database Schema

### Models

1. **Believer** (Tín đồ)
   - Thông tin cơ bản: fullName, dateOfBirth, gender
   - Địa bàn: xaDao, hoDao
   - Mốc đạo: ngayNhapMon, ngayTamThanh
   - Tu tập: traiKy, tuChan
   - Gia đình: fatherName, motherName, ngayCungCuu

2. **Rank** (Phẩm vị)
   - group: CUU_TRUNG_DAI, PHUOC_THIEN, HIEP_THIEN_DAI
   - code: unique identifier
   - displayName, order, isActive

3. **RankAssignment** (Lịch sử phong/cấp)
   - believerId, rankId
   - decisionNumber, decisionDate, decisionNote, decisionFileUrl

## 🔍 API Endpoints

### Believers

- `GET /api/believers` - Lấy danh sách (với filter, search, sort, pagination)
- `POST /api/believers` - Tạo mới tín đồ
- `GET /api/believers/[id]` - Chi tiết tín đồ
- `POST /api/believers/duplicate-check` - Kiểm tra trùng lặp
- `GET /api/believers/export` - Xuất CSV

### Ranks

- `GET /api/ranks` - Lấy danh sách phẩm vị
- `POST /api/ranks` - Tạo mới phẩm vị
- `PATCH /api/ranks/[id]` - Cập nhật phẩm vị

## 🌐 Deploy lên Vercel

### 1. Push code lên Git

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-git-repo>
git push -u origin main
```

### 2. Deploy trên Vercel

1. Truy cập [Vercel](https://vercel.com)
2. Click "New Project"
3. Import Git repository
4. Thêm Environment Variables:
   ```
   DATABASE_URL=<your-mongodb-atlas-connection-string>
   ```
5. Click "Deploy"

### 3. Kiểm tra

Sau khi deploy xong, Vercel sẽ cung cấp URL. Truy cập để kiểm tra:
- Trang chủ
- Danh sách tín đồ
- Thêm tín đồ mới
- Export CSV

## 📝 Scripts

```bash
# Development
npm run dev              # Chạy dev server

# Database
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema to DB
npm run db:seed          # Seed data

# Production
npm run build            # Build production
npm run start            # Start production server
```

## 🎨 UI/UX

- **Ngôn ngữ**: Tiếng Việt
- **Design**: Clean, minimal với Tailwind CSS
- **Responsive**: Hỗ trợ desktop và mobile
- **Icons**: Unicode emoji (no dependencies)

## 🔐 Bảo mật

⚠️ **Lưu ý**: Phiên bản hiện tại **CHƯA CÓ** authentication/authorization. 

Để triển khai production, cần thêm:
- Authentication (NextAuth.js, Clerk, hoặc Auth0)
- Authorization (role-based access control)
- Input sanitization
- Rate limiting

## 📊 Tính năng nổi bật

### 1. Cảnh báo trùng lặp thông minh

Khi nhập tín đồ mới, hệ thống tự động kiểm tra và cảnh báo nếu có người trùng:

- **Mức 1**: Trùng họ tên (case-insensitive, bỏ dấu)
- **Mức 2**: Trùng họ tên + ngày sinh
- **Mức 3**: Trùng họ tên + ngày sinh + địa bàn
- **Mức 4**: Tên gần giống (fuzzy match) + các yếu tố khác

Người dùng vẫn có thể chọn "Vẫn tạo mới" nếu chắc chắn không trùng.

### 2. Export CSV

- Export theo filter/search hiện tại
- UTF-8 encoding với BOM (mở đúng trong Excel)
- Tên file tự động theo ngày export

### 3. Quản lý Phẩm Vị

- Danh mục phẩm vị theo 3 nhóm
- Soft delete (isActive flag)
- Theo dõi lịch sử phong/cấp của từng tín đồ

## 🐛 Troubleshooting

### Lỗi kết nối MongoDB

```
Error: P1001: Can't reach database server
```

**Giải pháp**:
1. Kiểm tra `DATABASE_URL` trong `.env`
2. Kiểm tra Network Access trong MongoDB Atlas (whitelist IP)
3. Kiểm tra Database Access (username/password)

### Lỗi Prisma Client

```
Error: @prisma/client did not initialize yet
```

**Giải pháp**:
```bash
npx prisma generate
```

### Build error trên Vercel

**Giải pháp**:
1. Kiểm tra `DATABASE_URL` đã được set trong Vercel Environment Variables
2. Kiểm tra Next.js version compatibility
3. Check build logs để xem lỗi cụ thể

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra [Issues](link-to-issues) trên GitHub
2. Tạo issue mới với thông tin chi tiết
3. Liên hệ team phát triển

## 📝 License

MIT License - Sử dụng tự do cho mục đích phi lợi nhuận.

## 🙏 Acknowledgments

Được phát triển cho Tôn giáo Cao Đài Việt Nam.

---

**Phiên bản**: 1.0.0  
**Cập nhật**: 2026-02

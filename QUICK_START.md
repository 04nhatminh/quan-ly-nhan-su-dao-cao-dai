# 🚀 QUICK START GUIDE

Hướng dẫn nhanh để chạy dự án trong 5 phút.

## ⚡ TL;DR

```bash
# 1. Cài đặt
npm install

# 2. Setup môi trường
cp .env.example .env
# Sửa DATABASE_URL trong .env

# 3. Setup database
npx prisma generate
npx prisma db push
npm run db:seed

# 4. Chạy
npm run dev
```

Truy cập: http://localhost:3000

## 📝 Chi tiết từng bước

### Bước 1: Cài đặt dependencies

```bash
npm install
```

Hoặc dùng yarn/pnpm:
```bash
yarn install
# hoặc
pnpm install
```

### Bước 2: Setup MongoDB

**Option A: MongoDB Atlas (Khuyến nghị - Free)**

1. Tạo tài khoản tại https://www.mongodb.com/cloud/atlas
2. Tạo cluster miễn phí (M0)
3. Lấy connection string
4. Paste vào `.env`:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/cao-dai-db?retryWrites=true&w=majority"
```

**Option B: MongoDB Local**

```bash
# Cài MongoDB local
# Windows: https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Connection string cho local:
DATABASE_URL="mongodb://localhost:27017/cao-dai-db"
```

### Bước 3: Setup Database Schema

```bash
# Generate Prisma Client
npx prisma generate

# Tạo database schema
npx prisma db push

# Seed dữ liệu mẫu (phẩm vị + 2 tín đồ)
npm run db:seed
```

### Bước 4: Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt: http://localhost:3000

## 🎯 Các trang chính

- **Home**: http://localhost:3000/
- **Danh sách Tín Đồ**: http://localhost:3000/believers
- **Thêm Tín Đồ**: http://localhost:3000/believers/new
- **Quản lý Phẩm Vị**: http://localhost:3000/ranks

## 🧪 Test thử

### 1. Xem danh sách tín đồ có sẵn

- Vào `/believers`
- Sẽ thấy 2 tín đồ mẫu đã được seed

### 2. Thêm tín đồ mới

- Vào `/believers/new`
- Nhập họ tên: "Nguyễn Văn A"
- Nhập ngày sinh
- Submit → Sẽ báo cảnh báo trùng (vì đã có trong seed)
- Đổi tên khác và thử lại

### 3. Export CSV

- Vào `/believers`
- Click nút "📥 Xuất CSV"
- File CSV sẽ được download

### 4. Quản lý phẩm vị

- Vào `/ranks`
- Xem 11 phẩm vị đã được seed theo 3 nhóm
- Thử thêm phẩm vị mới

## 🔧 Troubleshooting

### ❌ Lỗi: "Can't reach database server"

**Nguyên nhân**: Không kết nối được MongoDB

**Giải pháp**:
1. Check `DATABASE_URL` trong `.env`
2. Nếu dùng Atlas: Check Network Access (whitelist 0.0.0.0/0)
3. Nếu dùng local: Đảm bảo MongoDB đang chạy

### ❌ Lỗi: "@prisma/client not found"

**Giải pháp**:
```bash
npx prisma generate
```

### ❌ Lỗi: "Port 3000 already in use"

**Giải pháp**:
```bash
# Chạy trên port khác
npm run dev -- -p 3001
```

### ❌ Seed không chạy

**Giải pháp**:
```bash
# Chạy trực tiếp
npx tsx prisma/seed.ts
```

## 📊 Prisma Studio (Optional)

Xem database qua GUI:

```bash
npx prisma studio
```

Mở: http://localhost:5555

## 🚀 Deploy lên Vercel

```bash
# 1. Push lên GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Deploy trên Vercel
# - Import repository
# - Add env variable: DATABASE_URL
# - Deploy!
```

Chi tiết: Xem [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📚 Next Steps

Sau khi chạy được, đọc thêm:

1. [README.md](./README.md) - Tài liệu đầy đủ
2. [DEPLOYMENT.md](./DEPLOYMENT.md) - Hướng dẫn deploy chi tiết
3. Prisma schema: [prisma/schema.prisma](./prisma/schema.prisma)
4. API routes: [app/api/](./app/api/)

## 💡 Tips

### Xem logs

```bash
# Dev server logs
npm run dev

# Prisma logs
# Edit lib/prisma.ts và uncomment:
log: ['query', 'error', 'warn']
```

### Reset database

```bash
# Xóa tất cả data và tạo lại
npx prisma db push --force-reset
npm run db:seed
```

### Update schema

```bash
# 1. Sửa prisma/schema.prisma
# 2. Push changes
npx prisma db push
# 3. Regenerate client
npx prisma generate
```

## ❓ Cần giúp đỡ?

- 📖 Đọc [README.md](./README.md)
- 🐛 Tạo issue trên GitHub
- 💬 Liên hệ team

---

**Happy Coding! 🎉**

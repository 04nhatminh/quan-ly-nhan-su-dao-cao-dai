# HƯỚNG DẪN DEPLOY CHI TIẾT

## 🎯 Tổng quan

Hướng dẫn này cung cấp các bước chi tiết để deploy ứng dụng lên Vercel với MongoDB Atlas.

## 📋 Chuẩn bị

### 1. MongoDB Atlas Setup

#### Bước 1: Tạo Cluster

1. Truy cập https://www.mongodb.com/cloud/atlas
2. Login hoặc đăng ký tài khoản mới (miễn phí)
3. Tạo một cluster mới:
   - Chọn **Free Tier** (M0)
   - Chọn region gần Việt Nam nhất (ví dụ: Singapore)
   - Cluster Name: `cao-dai-cluster`

#### Bước 2: Cấu hình Database Access

1. Vào **Database Access** (sidebar trái)
2. Click **Add New Database User**
3. Chọn **Password** authentication
4. Nhập:
   - Username: `caodai-admin`
   - Password: Tạo mật khẩu mạnh (lưu lại để dùng sau)
   - Database User Privileges: **Read and write to any database**
5. Click **Add User**

#### Bước 3: Cấu hình Network Access

1. Vào **Network Access** (sidebar trái)
2. Click **Add IP Address**
3. Chọn **Allow Access from Anywhere** (0.0.0.0/0)
   - ⚠️ Cảnh báo: Cho production thực tế, nên whitelist IP cụ thể
4. Click **Confirm**

#### Bước 4: Lấy Connection String

1. Vào **Database** (sidebar trái)
2. Click **Connect** trên cluster của bạn
3. Chọn **Connect your application**
4. Copy connection string, dạng:
   ```
   mongodb+srv://caodai-admin:<password>@cao-dai-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Thay `<password>` bằng mật khẩu thực của user

### 2. Vercel Setup

#### Bước 1: Đẩy code lên GitHub

```bash
# Khởi tạo git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit: Hệ thống quản lý tín đồ Cao Đài"

# Thêm remote repository (tạo repo mới trên GitHub trước)
git remote add origin https://github.com/your-username/quan-ly-tin-do-cao-dai.git

# Push lên GitHub
git push -u origin main
```

#### Bước 2: Import vào Vercel

1. Truy cập https://vercel.com
2. Login với GitHub
3. Click **Add New Project**
4. Import repository `quan-ly-tin-do-cao-dai`

#### Bước 3: Configure Project

1. **Framework Preset**: Next.js (tự động detect)
2. **Root Directory**: `./` (giữ mặc định)
3. **Build Command**: `next build` (mặc định)
4. **Output Directory**: `.next` (mặc định)

#### Bước 4: Add Environment Variables

Click **Environment Variables** và thêm:

```
Name: DATABASE_URL
Value: mongodb+srv://caodai-admin:<password>@cao-dai-cluster.xxxxx.mongodb.net/cao-dai-db?retryWrites=true&w=majority
```

⚠️ **Lưu ý**: Thay `<password>` bằng mật khẩu thực

#### Bước 5: Deploy

1. Click **Deploy**
2. Đợi 2-3 phút để build
3. Sau khi deploy xong, click vào URL để kiểm tra

## 🔧 Post-Deployment Setup

### 1. Seed Database (Lần đầu tiên)

Có 2 cách:

#### Cách 1: Seed từ Local (Khuyến nghị)

```bash
# Trong terminal local
# Tạo file .env.production.local
echo 'DATABASE_URL="mongodb+srv://..."' > .env.production.local

# Chạy seed
npx prisma db push
npm run db:seed
```

#### Cách 2: Seed qua Vercel CLI

```bash
# Cài Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run seed command
vercel env pull .env.vercel
npx prisma db push
npm run db:seed
```

### 2. Kiểm tra Deployment

Truy cập các trang sau trên domain Vercel của bạn:

1. **Home**: `https://your-app.vercel.app/`
2. **Danh sách tín đồ**: `https://your-app.vercel.app/believers`
3. **Thêm tín đồ**: `https://your-app.vercel.app/believers/new`
4. **Quản lý phẩm vị**: `https://your-app.vercel.app/ranks`

### 3. Test các tính năng

- ✅ Tạo tín đồ mới
- ✅ Kiểm tra cảnh báo trùng lặp
- ✅ Tìm kiếm & lọc
- ✅ Export CSV
- ✅ Xem chi tiết tín đồ
- ✅ Quản lý phẩm vị

## 🔄 Continuous Deployment

Sau khi setup xong, mọi commit mới push lên `main` branch sẽ tự động trigger một deployment mới trên Vercel.

```bash
# Làm thay đổi
git add .
git commit -m "Update feature X"
git push origin main

# Vercel sẽ tự động deploy
```

## 🌐 Custom Domain (Tùy chọn)

### 1. Mua Domain

Mua domain từ các nhà cung cấp:
- GoDaddy
- Namecheap
- Google Domains
- etc.

### 2. Add Domain trong Vercel

1. Vào Project Settings → Domains
2. Add domain của bạn (ví dụ: `quanly.caodai.vn`)
3. Cấu hình DNS theo hướng dẫn của Vercel

### 3. Cấu hình DNS

Add các record sau vào DNS provider:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## 📊 Monitoring & Maintenance

### 1. Vercel Analytics

- Vào **Analytics** tab để xem traffic, performance
- Free tier có giới hạn số lượng visits

### 2. MongoDB Atlas Monitoring

- Vào **Metrics** để xem database performance
- Setup alerts cho storage usage

### 3. Error Tracking

- Xem Vercel deployment logs
- Check MongoDB Atlas logs nếu có lỗi database

## 🔐 Security Checklist

Trước khi đưa vào production:

- [ ] Thay đổi MongoDB user/password mạnh hơn
- [ ] Whitelist chỉ IP của Vercel (nếu có thể)
- [ ] Add authentication (NextAuth.js, Clerk)
- [ ] Setup rate limiting
- [ ] Enable HTTPS (Vercel tự động)
- [ ] Review và sanitize user inputs

## 🐛 Common Issues

### Issue 1: Build Failed

**Error**: `Module not found: Can't resolve '@/lib/...'`

**Solution**:
```bash
# Check tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue 2: Database Connection Failed

**Error**: `P1001: Can't reach database server`

**Solutions**:
1. Kiểm tra `DATABASE_URL` trong Vercel Environment Variables
2. Kiểm tra Network Access trong MongoDB Atlas
3. Đảm bảo `0.0.0.0/0` đã được whitelist

### Issue 3: Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**: Vercel tự động chạy `prisma generate` trong build. Nếu lỗi:
1. Check `package.json` có script `postinstall`:
   ```json
   "postinstall": "prisma generate"
   ```
2. Redeploy

## 📈 Performance Optimization

### 1. Enable Edge Functions (Optional)

Trong route files:
```typescript
export const runtime = 'edge';
```

### 2. Add Caching

```typescript
export const revalidate = 60; // Revalidate sau 60 giây
```

### 3. Optimize Images

Dùng `next/image` cho tất cả images:
```tsx
import Image from 'next/image';
```

## 🎓 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Prisma Documentation](https://www.prisma.io/docs)

## 📞 Support

Gặp vấn đề? Liên hệ:
- Email: support@example.com
- GitHub Issues: [repository]/issues

---

**Happy Deploying! 🚀**

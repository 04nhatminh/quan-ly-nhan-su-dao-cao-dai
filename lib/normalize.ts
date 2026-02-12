/**
 * Chuẩn hoá chuỗi tiếng Việt để so sánh và tìm kiếm
 * - Loại bỏ dấu tiếng Việt
 * - Chuyển thành chữ thường
 * - Trim và collapse spaces
 */
export function normalizeVietnameseString(str: string): string {
  if (!str) return '';
  
  // Chuyển thành chữ thường
  let normalized = str.toLowerCase();
  
  // Trim và collapse multiple spaces
  normalized = normalized.trim().replace(/\s+/g, ' ');
  
  // Loại bỏ dấu tiếng Việt
  // Sử dụng Unicode Normalization Form D (NFD) để tách dấu
  normalized = normalized.normalize('NFD');
  
  // Loại bỏ các ký tự dấu (combining marks)
  // \u0300-\u036f: combining diacritical marks
  normalized = normalized.replace(/[\u0300-\u036f]/g, '');
  
  // Xử lý các ký tự đặc biệt tiếng Việt không thể tách bằng NFD
  const vietnameseMap: { [key: string]: string } = {
    'đ': 'd',
    'Đ': 'd',
  };
  
  for (const [key, value] of Object.entries(vietnameseMap)) {
    normalized = normalized.replace(new RegExp(key, 'g'), value);
  }
  
  return normalized;
}

/**
 * Tính độ tương đồng giữa 2 chuỗi (Levenshtein distance simplified)
 * Trả về giá trị từ 0 đến 1 (1 là giống nhất)
 */
export function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = normalizeVietnameseString(str1);
  const s2 = normalizeVietnameseString(str2);
  
  if (s1 === s2) return 1;
  if (!s1 || !s2) return 0;
  
  // Simple similarity based on common substrings
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1;
  
  const editDistance = levenshteinDistance(s1, s2);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Levenshtein distance algorithm
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Test examples
if (require.main === module) {
  console.log(normalizeVietnameseString('Nguyễn Văn Hùng')); // nguyen van hung
  console.log(normalizeVietnameseString('Trần Thị Đẹp'));     // tran thi dep
  console.log(calculateStringSimilarity('Nguyễn Văn A', 'Nguyen Van A')); // 1
  console.log(calculateStringSimilarity('Nguyễn Văn A', 'Nguyễn Văn B')); // ~0.9
}

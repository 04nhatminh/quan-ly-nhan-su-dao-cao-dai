import { Gender, TraiKy, TuChan, RankGroup } from '@prisma/client';
import { format } from 'date-fns';

// Simple utility without clsx 
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Format date to Vietnamese format
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd/MM/yyyy');
}

/**
 * Get label for Gender enum
 */
export function getGenderLabel(gender: Gender | null | undefined): string {
  if (!gender) return '';
  const labels: Record<Gender, string> = {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    OTHER: 'Khác',
  };
  return labels[gender];
}

/**
 * Get label for TraiKy enum
 */
export function getTraiKyLabel(traiKy: TraiKy | null | undefined): string {
  if (!traiKy) return '';
  const labels: Record<TraiKy, string> = {
    SIX_DAYS: '6 ngày',
    TEN_DAYS: '10 ngày',
    SIXTEEN_DAYS: '16 ngày',
    FULL: 'Trường',
  };
  return labels[traiKy];
}

/**
 * Get label for TuChan enum
 */
export function getTuChanLabel(tuChan: TuChan | null | undefined): string {
  if (!tuChan) return '';
  const labels: Record<TuChan, string> = {
    LINH: 'Linh châu',
    TRUONG: 'Trưởng châu',
    TAM: 'Tâm châu',
    TBHC: 'Tạm Bảo Huyền Châu',
  } as const;
  return labels[tuChan];
}

/**
 * Get label for RankGroup enum
 */
export function getRankGroupLabel(group: RankGroup): string {
  const labels: Record<RankGroup, string> = {
    CUU_TRUNG_DAI: 'Cửu Trùng Đài',
    PHUOC_THIEN: 'Phước Thiện',
    HIEP_THIEN_DAI: 'Hiệp Thiên Đài',
  };
  return labels[group];
}

/**
 * Get all TraiKy options
 */
export function getTraiKyOptions() {
  return [
    { value: 'SIX_DAYS', label: '6 ngày' },
    { value: 'TEN_DAYS', label: '10 ngày' },
    { value: 'SIXTEEN_DAYS', label: '16 ngày' },
    { value: 'FULL', label: 'Trường' },
  ];
}

/**
 * Get all TuChan options
 */
export function getTuChanOptions() {
  return [
    { value: 'LINH' as const, label: 'Linh châu' },
    { value: 'TRUONG' as const, label: 'Trưởng châu' },
    { value: 'TAM' as const, label: 'Tâm châu' },
    { value: 'TBHC' as const, label: 'Tạm Bảo Huyền Châu' },
  ];
}

/**
 * Get all Gender options
 */
export function getGenderOptions() {
  return [
    { value: 'MALE', label: 'Nam' },
    { value: 'FEMALE', label: 'Nữ' },
    { value: 'OTHER', label: 'Khác' },
  ];
}

/**
 * Get all RankGroup options
 */
export function getRankGroupOptions() {
  return [
    { value: 'CUU_TRUNG_DAI', label: 'Cửu Trùng Đài' },
    { value: 'PHUOC_THIEN', label: 'Phước Thiện' },
    { value: 'HIEP_THIEN_DAI', label: 'Hiệp Thiên Đài' },
  ];
}

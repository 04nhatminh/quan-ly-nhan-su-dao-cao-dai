import React from 'react';
import Link from 'next/link';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  href?: string;
}

export function Card({ children, className = '', hover = false, href }: CardProps) {
  const baseStyles = 'bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300';
  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';
  const classes = `${baseStyles} ${hoverStyles} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  
  return <div className={classes}>{children}</div>;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>{children}</div>;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return <h3 className={`text-xl font-bold text-gray-900 ${className}`}>{children}</h3>;
}

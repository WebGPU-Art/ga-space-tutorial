import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GA / SPACE — 从四元数看空间',
  description: '一份以互动实验理解四元数、旋转与几何代数的中文教程。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN"><body>{children}</body></html>
  );
}

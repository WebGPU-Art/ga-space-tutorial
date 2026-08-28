import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GA / SPACE — 互动数学与几何代数教材',
  description: '从数学史、四元数与空间直觉出发，通过互动实验学习几何代数、变换、时空与计算。',
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

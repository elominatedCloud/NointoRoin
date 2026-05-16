import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "시니어 AI 일자리 도우미",
  description: "말로 묻고 말로 듣는 중장년·고령층 일자리 안내 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

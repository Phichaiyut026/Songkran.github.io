import type { Metadata } from "next";
import "./globals.css";
import { Sarabun } from "next/font/google";

export const metadata: Metadata = {
  title: "สงกรานต์ (Songkran Festival)",
  description: "เทศกาลสงกรานต์ ประเพณีปีใหม่ไทย",
  generator: "v0.dev",
};

// ใช้ฟอนต์ Sarabun แทน Inter เพราะรองรับภาษาไทย
const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* ถ้าคุณยังต้องการใช้ Dancing Script สำหรับบางส่วน สามารถเก็บไว้ได้ */}
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={sarabun.className}>{children}</body>
    </html>
  );
}
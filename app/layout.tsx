import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MenuFi | قائمة الطعام الرقمية",
  description: "اطلب طعامك المفضل بسهولة",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className="antialiased font-sans bg-gray-50 dark:bg-dark-900">
        {children}
      </body>
    </html>
  );
}

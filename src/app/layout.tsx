import type { Metadata, Viewport } from "next";
import { Cairo, Readex_Pro } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  variable: "--font-readex-pro",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1E2225",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "الشويحي للأثاث والتصميم الراقي | Shewimy",
  description:
    "مؤسسة الشويحي للتصميم الداخلي والأثاث الفاخر والأعمال الخشبية المعمارية. أصالة، جودة، وحرفية تدوم عبر الأجيال.",
  keywords: ["أثاث", "الشويحي", "تصميم داخلي", "خشب طبيعي", "ديكور راقي", "Shewimy"],
  authors: [{ name: "Shewimy Woodworks & Interiors" }],
  openGraph: {
    title: "الشويحي للأثاث والتصميم الراقي | Shewimy",
    description: "تصاميم استثنائية من الخشب الطبيعي وحلول ديكور داخلي فاخرة.",
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${readexPro.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col font-cairo bg-alabaster text-charcoal antialiased selection:bg-bronze selection:text-white">
        {children}
      </body>
    </html>
  );
}

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
  themeColor: "#070b0e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "مطابخ الشويمي | تصاميم معمارية فاخرة ومطابخ خشبية",
  description:
    "مطابخ فاخرة تُصنع بحرفية استثنائية لمنزلك العصري. خبرة ٢٤ عاماً وضمان ١٥ سنة حقيقي مع تصنيع بماكينات إيطالية وخامات أوروبية 100%.",
  keywords: [
    "مطابخ الشويمي",
    "مطابخ مودرن",
    "دريسينج روم",
    "خشب طبيعي",
    "تصميم مطابخ 3D",
    "المنصورة",
    "المحلة",
    "سمنود",
  ],
  authors: [{ name: "Al Shewimy Kitchens" }],
  openGraph: {
    title: "مطابخ الشويمي | Al Shewimy Kitchens",
    description: "مطابخ فاخرة تُصنع بحرفية استثنائية لمنزلك العصري.",
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
      <body className="min-h-screen flex flex-col font-cairo bg-surface text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
        {children}
      </body>
    </html>
  );
}

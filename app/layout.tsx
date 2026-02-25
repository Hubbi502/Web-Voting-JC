import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pemilihan Ketua Japanese Club 2026/2027",
  description: "Website voting pemilihan Ketua Japanese Club periode 2026/2027. Pilih pemimpin terbaik untuk komunitas Jepang kita!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

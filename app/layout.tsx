import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mesa Viva | Menu digital",
  description: "MVP de menu digital interactivo para restaurantes modernos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

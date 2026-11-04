import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApexLink | Telemetría para Assetto Corsa en Tiempo Real",
  description:
    "Telemetría en tiempo real y análisis de vueltas para Assetto Corsa: pantalla para volante, muro de boxes a 60 Hz y comparación de curvas desde el navegador.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased bg-black text-white min-h-screen selection:bg-[#e22718] selection:text-white">
        {children}
      </body>
    </html>
  );
}

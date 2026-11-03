import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApexLink | Ingeniería de Telemetría & Pitwall FAPPE 2026",
  description: "Plataforma SaaS de análisis de telemetría, pitwall en tiempo real y perfil de pilotos para Assetto Corsa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased bg-black text-white min-h-screen selection:bg-[#0066b1] selection:text-white">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApexLink | Ecosistema de Telemetría SimRacing & Live Pitwall",
  description:
    "Ecosistema integral de telemetría para simracing: instrumental digital de cabina, Live Pitwall a 60 Hz en boxes, laboratorio analítico 2D y plataforma SaaS de competición para Assetto Corsa.",
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

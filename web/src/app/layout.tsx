import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApexLink | Instrumental de Cabina y Telemetría SimRacing",
  description:
    "Convertí tu smartphone en la pantalla de tu volante de carreras. Instrumental DDU en tiempo real, luces de corte instantáneas y telemetría analítica de boxes para Assetto Corsa.",
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

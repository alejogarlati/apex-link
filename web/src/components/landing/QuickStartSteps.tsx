import { Play, Laptop, Gauge } from "lucide-react";

export function QuickStartSteps() {
  const pasos = [
    {
      numero: "01",
      titulo: "Abrí ApexLink",
      descripcion:
        "Iniciá la aplicación en tu computadora. No requiere instalar plugins complejos ni configurar puertos o canales manualmente.",
      icono: Laptop,
    },
    {
      numero: "02",
      titulo: "Salí a pista en el simulador",
      descripcion:
        "Abrí Assetto Corsa y salí del pitlane. El enlace se acopla automáticamente y empieza a registrar los datos del auto desde la primera curva.",
      icono: Play,
    },
    {
      numero: "03",
      titulo: "Mirá tu telemetría en tiempo real",
      descripcion:
        "Seguí tus tiempos y el estado del chasis en el display de cabina, o abrí el navegador para monitorear la tanda en vivo desde el muro de boxes.",
      icono: Gauge,
    },
  ];

  return (
    <section id="como-funciona" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#3c3c3c] text-[#e22718] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
            Simplicidad Operativa
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white">
            Cómo empezar en <span className="text-[#e22718]">tres pasos</span>
          </h2>
          <p className="text-[#bbbbbb] text-sm sm:text-base mt-4 leading-relaxed">
            Sin configuraciones engorrosas ni exportaciones manuales de archivos. Todo está pensado para que salgas a girar de inmediato.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pasos.map((paso, idx) => {
            const Icono = paso.icono;
            return (
              <div
                key={idx}
                className="bg-[#0d0d0d] border border-[#262626] hover:border-[#3c3c3c] p-8 flex flex-col justify-between transition-colors relative group"
              >
                {/* Acento superior en hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e22718] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-mono font-bold text-[#e22718]">
                      {paso.numero}
                    </span>
                    <div className="w-10 h-10 bg-[#141414] border border-[#3c3c3c] flex items-center justify-center">
                      <Icono className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold uppercase text-white tracking-tight mb-3">
                    {paso.titulo}
                  </h3>

                  <p className="text-xs leading-relaxed text-[#bbbbbb]">
                    {paso.descripcion}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#1f1f1f] text-[10px] uppercase font-bold tracking-wider text-[#7e7e7e]">
                  Paso {paso.numero} de 03
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

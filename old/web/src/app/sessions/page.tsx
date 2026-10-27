import { Calendar, Trophy, Car } from 'lucide-react';

export default function PaginaSesiones() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-hairline pb-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-m-blue-light" />
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase sm:text-3xl">
            Historial de Sesiones Registradas
          </h1>
        </div>
        <p className="mt-1 text-sm text-body-secondary">
          Listado de sesiones de simulación capturadas desde Assetto Corsa por el Relay de Dev 1.
        </p>
      </div>

      {/* Grid de Sesiones */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Mock card de ejemplo mientras se conecta el backend */}
        <div className="border border-hairline bg-surface-card p-6 transition-colors hover:border-m-blue-light">
          <div className="mb-4 flex items-center justify-between">
            <span className="border border-hairline bg-surface-soft px-2.5 py-1 text-xs font-bold tracking-widest text-m-blue-light uppercase">
              Monza GP
            </span>
            <span className="text-xs text-body-muted">24 Oct 2026</span>
          </div>

          <div className="space-y-3 border-y border-hairline py-4">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-body-secondary">
                <Car className="h-4 w-4 text-body-muted" />
                Vehículo:
              </span>
              <span className="font-semibold text-white">Ferrari 488 GT3</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-body-secondary">
                <Trophy className="h-4 w-4 text-telemetry-warning" />
                Mejor Vuelta:
              </span>
              <span className="font-mono font-bold text-telemetry-throttle">
                01:47.382
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-body-secondary">
                <Calendar className="h-4 w-4 text-body-muted" />
                Total Vueltas:
              </span>
              <span className="font-semibold text-white">8 vueltas</span>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="w-full border border-hairline bg-surface-elevated py-2 text-center text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-m-blue-light"
            >
              Cargar Telemetría
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

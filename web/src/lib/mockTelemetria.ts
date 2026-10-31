import type { ResumenVuelta, MuestraTelemetria } from "@/types/telemetria";

/**
 * Resumen de vueltas mock para Monza GP (Assetto Corsa).
 */
export const VUELTAS_MOCK_MONZA: ResumenVuelta[] = [
  {
    id: "lap-monza-01",
    numeroVuelta: 1,
    tiempoVueltaMs: 83450,
    tiempoVueltaStr: "01:23.450",
    esMejorVuelta: false,
    esVueltaValida: true,
    sectoresMs: [28900, 28100, 26450],
    totalMuestras: 520,
  },
  {
    id: "lap-monza-02",
    numeroVuelta: 2,
    tiempoVueltaMs: 82110,
    tiempoVueltaStr: "01:22.110",
    esMejorVuelta: false,
    esVueltaValida: true,
    sectoresMs: [28400, 27800, 25910],
    totalMuestras: 520,
  },
  {
    id: "lap-monza-03",
    numeroVuelta: 3,
    tiempoVueltaMs: 81520,
    tiempoVueltaStr: "01:21.520",
    esMejorVuelta: false,
    esVueltaValida: false, // Inválida por límites de pista en variante Ascari
    sectoresMs: [28100, 27600, 25820],
    totalMuestras: 520,
  },
  {
    id: "lap-monza-04",
    numeroVuelta: 4,
    tiempoVueltaMs: 80940,
    tiempoVueltaStr: "01:20.940",
    esMejorVuelta: true, // Récord de la sesión
    esVueltaValida: true,
    sectoresMs: [27950, 27410, 25580],
    totalMuestras: 520,
  },
];

/**
 * Vértices clave de la geometría real del Autodromo Nazionale Monza (coordenadas mundo X, Z en metros).
 */
const HITOS_MONZA: Array<{ d: number; x: number; z: number }> = [
  { d: 0, x: 0, z: 0 }, // Línea de Meta
  { d: 950, x: 5, z: 950 }, // Final de recta principal
  { d: 1100, x: 45, z: 1080 }, // Rettifilo Entrada
  { d: 1250, x: -10, z: 1220 }, // Rettifilo Salida
  { d: 1700, x: 120, z: 1650 }, // Curva Grande (Biassono)
  { d: 2100, x: 260, z: 2050 }, // Entrada Roggia
  { d: 2280, x: 235, z: 2200 }, // Salida Roggia
  { d: 2750, x: 380, z: 2420 }, // Curva di Lesmo 1
  { d: 3250, x: 460, z: 2320 }, // Curva di Lesmo 2
  { d: 3800, x: 390, z: 1750 }, // Curva del Serraglio
  { d: 4350, x: 310, z: 1250 }, // Entrada Variante Ascari
  { d: 4550, x: 215, z: 1120 }, // Ápice Ascari
  { d: 4700, x: 240, z: 980 }, // Salida Ascari hacia recta de atrás
  { d: 5200, x: 230, z: 220 }, // Frenada de la Parabolica
  { d: 5450, x: 150, z: -80 }, // Ápice de la Parabolica (Alboreto)
  { d: 5650, x: 40, z: -60 }, // Salida Parabolica
  { d: 5793, x: 0, z: 0 }, // Cierre de vuelta (Meta)
];

function obtenerPosicionMonza(distancia: number): { x: number; z: number } {
  const dNorm = Math.max(0, Math.min(5793, distancia));
  for (let i = 0; i < HITOS_MONZA.length - 1; i++) {
    const a = HITOS_MONZA[i]!;
    const b = HITOS_MONZA[i + 1]!;
    if (dNorm >= a.d && dNorm <= b.d) {
      const t = (dNorm - a.d) / (b.d - a.d);
      return {
        x: a.x + (b.x - a.x) * t,
        z: a.z + (b.z - a.z) * t,
      };
    }
  }
  return { x: 0, z: 0 };
}

/**
 * Generador sintético de muestras de telemetría a lo largo de los 5.793 metros del autódromo de Monza.
 */
export function generarTelemetriaMonza(variacionFactor = 1.0): MuestraTelemetria[] {
  const longitudPista = 5793;
  const totalPuntos = 450;
  const paso = longitudPista / totalPuntos;
  const muestras: MuestraTelemetria[] = [];

  for (let i = 0; i <= totalPuntos; i++) {
    const d = i * paso;
    let vel = 295;
    let throttle = 1.0;
    let brake = 0.0;
    let gear = 6;
    let steer = 0.0;

    // 1. Rettifilo Chicane
    if (d >= 980 && d < 1180) {
      const t = (d - 980) / 200;
      vel = 335 - t * 255 * variacionFactor; // 335 a 80 km/h
      throttle = 0.0;
      brake = Math.min(1.0, 0.96 * variacionFactor);
      gear = t > 0.6 ? 2 : 4;
      steer = 0.45;
    } else if (d >= 1180 && d < 1350) {
      const t = (d - 1180) / 170;
      vel = 80 + t * 145;
      throttle = t;
      brake = 0.0;
      gear = 3;
    }
    // 2. Curva Grande
    else if (d >= 1350 && d < 2100) {
      vel = Math.min(308, 225 + ((d - 1350) / 750) * 83);
      throttle = 1.0;
      gear = 6;
      steer = -0.15;
    }
    // 3. Roggia
    else if (d >= 2100 && d < 2280) {
      const t = (d - 2100) / 180;
      vel = 308 - t * 200 * variacionFactor;
      throttle = 0.0;
      brake = 0.92;
      gear = 2;
      steer = -0.4;
    } else if (d >= 2280 && d < 2700) {
      vel = 108 + ((d - 2280) / 420) * 152;
      throttle = 0.88;
      gear = 4;
    }
    // 4. Lesmo 1 & 2
    else if (d >= 2700 && d < 2850) {
      vel = 260 - ((d - 2700) / 150) * 95;
      throttle = 0.1;
      brake = 0.68;
      gear = 3;
      steer = 0.35;
    } else if (d >= 3150 && d < 3300) {
      vel = 235 - ((d - 3150) / 150) * 85;
      throttle = 0.2;
      brake = 0.62;
      gear = 3;
      steer = 0.28;
    }
    // 5. Ascari
    else if (d >= 4300 && d < 4500) {
      const t = (d - 4300) / 200;
      vel = 320 - t * 175 * variacionFactor;
      throttle = 0.0;
      brake = 0.88;
      gear = 3;
      steer = -0.45;
    } else if (d >= 4500 && d < 4750) {
      vel = 145 + ((d - 4500) / 250) * 115;
      throttle = 0.92;
      gear = 4;
      steer = 0.32;
    }
    // 6. Parabolica
    else if (d >= 5180 && d < 5380) {
      const t = (d - 5180) / 200;
      vel = 315 - t * 145 * variacionFactor;
      throttle = 0.0;
      brake = 0.78;
      gear = 4;
      steer = 0.38;
    } else if (d >= 5380 && d < longitudPista) {
      const t = (d - 5380) / (longitudPista - 5380);
      vel = 170 + t * 140;
      throttle = 0.98;
      gear = 5;
    }

    const pos = obtenerPosicionMonza(d);

    muestras.push({
      timestamp: 1729800000000 + i * 180,
      distanciaMetros: Math.round(d),
      velocidadKmh: Math.max(50, Math.round(vel)),
      rpms: Math.round(8000 + (vel / 335) * 4500),
      marcha: gear,
      acelerador: throttle,
      freno: brake,
      direccion: steer,
      posicionMundo: {
        x: pos.x,
        y: 12.0,
        z: pos.z,
      },
      gForce: {
        lat: steer * 2.5,
        lon: throttle > 0.5 ? 0.8 : brake > 0.1 ? -1.8 : 0,
      },
    });
  }

  return muestras;
}

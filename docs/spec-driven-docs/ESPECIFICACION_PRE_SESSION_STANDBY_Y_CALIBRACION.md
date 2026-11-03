# Especificación Técnica: Pantalla Pre-Sesión (Standby), Calibración y Design System BMW M

> **Proyecto:** ApexLink — DDU Cockpit Móvil (Capa 2)  
> **Fecha de Actualización:** 2026-11-03  
> **Ramas:** `dev/build` y `feat/webapp`  
> **Estado:** Implementado, auditado y verificado (Enfoque A + BMW M Design System)

---

## 1. Resumen Ejecutivo
Incorporación de una pantalla de Standby Pre-Sesión de estilo telemetría de boxes de alta gama que diagnostica en tiempo real los 3 eslabones críticos (Enlace USB/Red, Servidor Backend y Proceso de Simulador) y muestra el perfil de piloto activo (o "Invitado") consumido desde `/api/estado`.

Al detectar el ingreso a pista o activar la simulación, se dispara una transición fluida precedida por una animación de ignición y calibración de **900 ms** (Needle Sweep en tacómetro y barrido secuencial de 15 Shift LEDs) antes de transferir el control al instrumental de carrera a 60 Hz.

Asimismo, todos los parámetros de chasis y neumáticos en el instrumental del volante fueron blindados como **indicadores de solo lectura** para prevenir desajustes táctiles involuntarios durante la conducción.

---

## 2. Máquina de Estados del Ciclo de Vida (Zustand)

```
       ┌───────────┐
       │  STANDBY  │ ◄──── Retorno manual vía botón STANDBY / Desconexión
       └─────┬─────┘
             │ Detección de simulador en pista / Click en Iniciar DDU
             ▼
      ┌─────────────┐
      │ CALIBRATING │ (Secuencia de Ignición 900 ms)
      └──────┬──────┘
             │ Calibración completada al 100%
             ▼
      ┌─────────────┐
      │ ON_SESSION  │ (DDU Cockpit activo a 60 Hz)
      └─────────────┘
```

* **`STANDBY`**: Pantalla previa de diagnóstico de 3 pilares colosales + badge de piloto + hora local.
* **`CALIBRATING`**: Barrido de 900 ms con curva de ida y vuelta:
  - RPM sube de 0 a `maxRpm` y retorna a ralentí.
  - Velocímetro barre hasta 340 km/h y regresa a 0.
  - Los 15 Shift LEDs (5 verdes, 5 rojos, 5 azules) se iluminan progresivamente simulando el encendido del monoplaza F1.
  - Indicador DRS parpadea en la cúspide del barrido.
* **`ON_SESSION`**: Vista completa de cabina (TopDeltaBar, Timing, Tacómetro central, Físicas térmicas de cubiertas y Controles de chasis).

---

## 3. Integración del Design System BMW M (`DESIGN.md`)

Todos los elementos fuera del CORE del DDU (Lobby, Modales, Diagnósticos y Barras de utilidades) se diseñaron bajo la especificación formal de **[BMW M Design System](https://getdesign.md/bmw-m/design-md)**:

1. **Siluetas Rectangulares Industriales (`rounded.none` / `0px`):**
   - Cero radios decorativos en tarjetas, pilares de diagnóstico, modales y botones principales.
   - La regla binaria estricta de BMW M reserva `rounded-full` exclusivamente para botones circulares de utilidad (`button-icon`: configuración, pantalla completa y cerrar).

2. **Balance Cromático Dominante (Rojo M `#e22718` y Negro Puro `#000000`):**
   - **Canvas:** `#000000` (negro absoluto de fondo).
   - **Superficies:** `#0d0d0d` (*surface-soft*), `#141414` (*surface-card*), `#262626` / `#3c3c3c` (*hairlines*).
   - **Acento Rojo M:** Botón primario de acción (`INICIAR COCKPIT DDU`), franjas reactivas de 4px, estados activos de simulador y badge de piloto.

3. **Franja M Tricolor Estructural (`m-stripe-divider`):**
   - Franja de 4px en el borde superior de la pantalla y cabecera de modales:
     - Azul Celeste: `#0066b1`
     - Azul Corporativo: `#1c69d4`
     - Rojo M: `#e22718`
   - Badge M oblicuo (`MSlantedBadge`) acompañando el logotipo `APEXLINK`.

4. **Voz Tipográfica BMW Type Next:**
   - Titulares y etiquetas técnicas en **UPPERCASE 700** con espaciado de ingeniería (`tracking-[0.15em]` / 1.5px).
   - Subvalores y metadatos en peso ligero 300 (Light) para contraste editorial de ingeniería automotriz.

---

## 4. Política de Parámetros de Solo Lectura (Read-Only Telemetry)

Para garantizar la estabilidad en carrera desde un soporte de smartphone (6"):
* **Controles de Chasis (`ZoneEChassisControls.tsx`):** TC, FUEL, ABS y BIAS se convirtieron de elementos `<button>` cliqueables a contenedores estáticos `<div>`.
* **Neumáticos (`ZoneBTyresAndBrakes.tsx`):** Se eliminó la función de ciclar compuestos F1 (Soft/Medium/Hard/Inter/Wet) al tocar las ruedas.
* **Velocímetro (`ZoneCCentralColumn.tsx`):** Se eliminó la conmutación táctil accidental de unidades (KM/H y MPH permanecen configurables desde el modal de diagnóstico).

---

## 5. Componentes Involucrados

| Componente | Ruta de Archivo | Responsabilidad |
| :--- | :--- | :--- |
| **`AppState` & `PilotProfile`** | `src/types/ddu.ts` | Definición de tipos de estado y perfil de piloto. |
| **`useTelemetryStore`** | `src/store/useTelemetryStore.ts` | Store Zustand con acciones `setAppState`, `setPilotProfile`, `startCalibration`. |
| **`BmwMComponents`** | `src/components/common/BmwMComponents.tsx` | Componentes `MTricolorStripe` y `MSlantedBadge`. |
| **`PreSessionLobby`** | `src/components/lobby/PreSessionLobby.tsx` | Pantalla de Standby con los 3 pilares colosales. |
| **`DiagnosticCard`** | `src/components/lobby/DiagnosticCard.tsx` | Tarjetas técnicas de diagnóstico USB, Servidor y Juego. |
| **`DriverProfileBadge`** | `src/components/lobby/DriverProfileBadge.tsx` | Insignia de piloto con indicador Rojo M. |
| **`useCalibrationSequence`** | `src/hooks/useCalibrationSequence.ts` | Hook orquestador del barrido de aguja y LEDs (900 ms). |
| **`CockpitView`** | `src/components/cockpit/CockpitView.tsx` | Vista del instrumental en vivo con Shift Lights y telemetría 60 Hz. |
| **`useTelemetryWebSocket`** | `src/hooks/useTelemetryWebSocket.ts` | Consulta a `/api/estado` para hidratar perfil y suscripción WebSocket. |

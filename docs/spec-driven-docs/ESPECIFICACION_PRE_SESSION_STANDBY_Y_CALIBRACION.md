# Especificación Técnica: Pantalla Pre-Sesión (Standby) y Calibración de Cockpit

> **Proyecto:** ApexLink — DDU Cockpit Móvil (Capa 2)  
> **Fecha:** 2026-11-03  
> **Rama:** `dev/build`  
> **Estado:** Aprobado para implementación (Enfoque A)

---

## 1. Resumen Ejecutivo
Incorporación de una pantalla de Standby de estilo telemetría de boxes (Porsche GT3 / F1 Pitwall) que diagnostica en tiempo real los 3 eslabones críticos (Enlace USB, Servidor Backend y Proceso de Assetto Corsa) y muestra el perfil de piloto activo (o "Invitado").

Al detectar el ingreso a pista, se dispara una transición automática precedida por una animación de calibración de ignición de 800 ms (Needle Sweep & Shift LEDs) antes de ceder el control al instrumental de carrera a 60 Hz.

---

## 2. Máquina de Estados (Zustand)
* `STANDBY`: Pantalla de boxes / diagnóstico triple.
* `CALIBRATING`: 800 ms de animación de ignición (tacómetro y luces de corte).
* `ON_SESSION`: DDU en pista en tiempo real.

---

## 3. Componentes Creados / Modificados
1. `apex-link-display/src/types/ddu.ts`: Tipos `AppState` y `PilotProfile`.
2. `apex-link-display/src/store/useTelemetryStore.ts`: Estados `appState`, `pilotProfile`, `calibrationProgress`.
3. `apex-link-display/src/components/lobby/PreSessionLobby.tsx`: Pantalla de Standby.
4. `apex-link-display/src/components/lobby/DiagnosticCard.tsx`: Tarjeta de diagnóstico USB/Servidor/Juego.
5. `apex-link-display/src/components/lobby/DriverProfileBadge.tsx`: Badge de piloto.
6. `apex-link-display/src/components/cockpit/CockpitView.tsx`: Envoltorio del DDU de carrera.
7. `apex-link-display/src/hooks/useCalibrationSequence.ts`: Orquestador de la animación de barrido de 800 ms.
8. `apex-link-display/src/App.tsx`: Conmutador de vistas según `appState`.

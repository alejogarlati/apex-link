# 📱 ApexLink DDU — Digital Dashboard Unit (`apex-link-display`)

> **Capa 2:** Instrumental Digital de Cockpit para Volante de Simulación  
> **Ámbito:** Proyecto Final Integrador — **FAPPE 2026**  
> **Tecnologías:** Vite 6 · React 19 · TypeScript 5.7 · Tailwind CSS v4 · Zustand 5  
> **Resolución y Proporción:** $1920 \times 864\text{ px}$ (Relación 2.22:1) con contenedor Letterbox auto-centrado para cualquier smartphone o tablet (16:9 a 21:9).  
> **Hardware Objetivo:** Smartphone Android (Samsung, Xiaomi, Motorola, etc.) montado físicamente en aro o base de volante mediante enlace USB determinístico de baja latencia ($< 0.8\text{ ms}$).

---

## 🚀 Puesta en Marcha Rápida

### 1. Instalación de Dependencias
```bash
cd apex-link-display
pnpm install
```

### 2. Ejecución en Desarrollo (Puerto 5173)
```bash
pnpm dev
```
La aplicación quedará disponible en `http://localhost:5173` y en la IP de red local para acceso desde el smartphone o tablet.

### 3. Compilación Release para Producción
```bash
pnpm build
```

---

## 🎮 Modos Operativos y Escenarios de Demostración

La aplicación incluye un motor procedural de telemetría mock determinístico (`useMockTelemetry.ts`) que emite cuadros a 60 FPS simulando vueltas completas en Monza F1:

* **Modo Autónomo / Standalone:** Funciona al 100% sin necesidad de tener corriendo el backend ni el simulador.
* **Escenarios Rápidos (Pill Bar Inferior):**
  1. `🏁 Monza Vuelta`: Vuelta continua a 60 FPS con aceleraciones, frenadas, cambios 1..8 y cruce de meta.
  2. `🛑 Frenada -2.8G`: Desaceleración violenta de 330 a 75 km/h con discos de freno incandescentes al rojo vivo ($> 800^\circ\text{C}$).
  3. `⚡ DRS 320km/h`: Recta principal a 320 km/h en 7ma marcha con el testigo DRS en verde neón (`DRS OPEN`).
  4. `🏎️ Curva 2.4G`: Curva Biassono con fuerzas G laterales intensas y calentamiento de neumáticos izquierdos.
  5. `🅿️ Pit Limiter`: Velocidad limitada a 78 km/h en 1ra marcha con testigo azul parpadeante a 4 Hz.

---

## 🔌 Conexión Físico-USB con el Simulador Real

Para conectar el smartphone físico por cable USB sin depender de redes Wi-Fi:

```bash
# Habilitar túnel inverso ADB hacia el backend Kestrel (.NET)
adb reverse tcp:8080 tcp:8080

# (Opcional) Forzar que la pantalla del smartphone nunca se apague mientras esté conectada por USB
adb shell svc power stayonusb true
```
El DDU se conectará automáticamente a `ws://localhost:8080/ws/telemetry`. Si el cable se desconecta en plena carrera, el hook de reconexión reanuda el flujo en $< 0.5\text{ s}$ sin recargar la página.

---

## 🏛️ Estructura del Proyecto

```
apex-link-display/
├── public/
│   ├── favicon.svg
│   └── manifest.json             # Manifiesto PWA Standalone
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── LetterboxContainer.tsx   # Contenedor 2.22:1 auto-centrado
│   │   ├── modals/
│   │   │   ├── DiagnosticsModal.tsx     # Overlay de latencia, FPS y calibración
│   │   │   ├── LapCompletedBanner.tsx   # Notificación de vuelta récord (4s)
│   │   │   └── QuickControlsBar.tsx     # Barra flotante de demostración rápida
│   │   └── zones/
│   │       ├── ZoneA1WarningStrip.tsx   # Testigos: Pit Limiter, DRS, Flags, USB
│   │       ├── ZoneA2DeltaBar.tsx       # Caja de delta numérico y barra bicolor
│   │       ├── ZoneA3SessionMonitor.tsx # Posición P01/P02, tiempo y vuelta
│   │       ├── ZoneBTyresAndBrakes.tsx  # Matriz 4 ruedas (PSI, °C, desgaste) y frenos
│   │       ├── ZoneCCentralColumn.tsx   # Shift LEDs 15Hz, marcha gigante, RPM, velocímetro
│   │       ├── ZoneDTiming.tsx          # Predicted, Last, Best Lap y parciales
│   │       ├── ZoneEChassisControls.tsx # TC, ABS, Brake Bias % y mapa motor
│   │       └── ZoneFFuelManagement.tsx  # Combustible, consumo L/vuelta y autonomía
│   ├── hooks/
│   │   ├── useKioskMode.ts          # Fullscreen API y orientación apaisada
│   │   ├── useMockTelemetry.ts      # Generador mock Monza a 60 FPS
│   │   ├── useScreenWakeLock.ts     # Screen Wake Lock API
│   │   └── useTelemetryWebSocket.ts # Cliente WebSocket nativo con auto-reconexión
│   ├── store/
│   │   └── useTelemetryStore.ts     # Almacén reactivo Zustand 5 con selectores atómicos
│   ├── types/
│   │   ├── ddu.ts                   # Interfaces UI, electrónica y combustible
│   │   └── telemetry.ts             # DTOs 1:1 con Backend Relay (camelCase)
│   ├── App.tsx                      # Orquestador visual del layout
│   ├── index.css                    # Estilos Tailwind v4 y animaciones GPU
│   └── main.tsx                     # Punto de entrada React 19
├── package.json
├── tsconfig.json
└── vite.config.ts
```

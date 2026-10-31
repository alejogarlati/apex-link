# 🏎️ ApexLink — Telemetría SimRacing en Tiempo Real y Análisis de Rendimiento (FAPPE 2026)

> **Proyecto Final de Grado / Presentación FAPPE 2026**  
> **Metodología de Desarrollo:** Spec-Driven Development (SDD Intensivo)  
> **Plazo de Ejecución:** Sprint de 3 Semanas (15 Días Hábiles)  
> **Equipo:** 3 Desarrolladores en Paralelo (Dev 1: Backend/API · Dev 2: DDU Móvil · Dev 3: Plataforma Web)  
> **Estado:** Prototipos y pruebas PoC archivados en [`/old`](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/apex-link/old/). Especificaciones Sagradas de las 3 Capas 100% Definidas.

---

## 🎯 Concepto y Propuesta de Valor

Este proyecto desarrolla un **ecosistema integral distribuido de telemetría automovilística y análisis de rendimiento para Assetto Corsa**, diseñado específicamente para maximizar el impacto visual y técnico durante la feria de proyectos estudiantiles **FAPPE 2026**.

El sistema resuelve tres problemáticas críticas del simracing y el motorsport formativo:
1. **Democratización de Instrumentación Profesional:** Transforma cualquier smartphone Android convencional en un display réplica de volante de Fórmula 1/GT3 mediante conexión física USB determinística de ultrabaja latencia (**$< 0.8\text{ ms}$**), sustituyendo periféricos comerciales de más de $1.000 USD.
2. **Rol Activo de "Ingeniero de Carrera" para el Jurado:** Proporciona un centro de mando en vivo (*Live Pitwall*) en Next.js donde docentes y jurado evalúan pedales a 60 Hz, diagrama de fuerzas G (*Kamm Circle*), presiones y temperaturas de neumáticos mientras alguien conduce en el simulador.
3. **Telemetría Post-Sesión Didáctica en el Dominio de Distancia:** Elimina la barrera de software complejos como MoTeC, ofreciendo un mapa interactivo de trazadas 2D con mapas de calor y superposición milimétrica de curvas de telemetría (freno, acelerador, velocidad, deltas) normalizadas por distancia de pista ($0 \to L_{\text{circuito}}$ metros).

---

## 📜 Suite Sagrada de Spec-Driven Development (`/docs/spec-driven-docs`)

Bajo la metodología de **Spec-Driven Development Intensivo**, las especificaciones son la **Fuente Sagrada de Verdad** y el desarrollo de código ocurre de forma descendente y estrictamente alineada:

| Documento Rector | Alcance / Capa | Descripción Técnica |
| :--- | :---: | :--- |
| 📋 **[BRIEF_INTEGRAL_SISTEMA_3_CAPAS.md](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/apex-link/docs/spec-driven-docs/BRIEF_INTEGRAL_SISTEMA_3_CAPAS.md)** | **Ecosistema Global** | Brief maestro del software en sus 3 capas (API / DDU / WEBAPP), los 3 momentos operativos del usuario, acuerdos de SLA y arquitectura de integración. |
| 📡 **[CONTRATOS_TELEMETRIA_Y_API.md](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/apex-link/docs/spec-driven-docs/CONTRATOS_TELEMETRIA_Y_API.md)** | **Contratos de Red** | Catálogo exhaustivo de mensajes WebSocket (`FRAME` @ 60 Hz, `LAP_COMPLETED`), DTOs camelCase, diccionarios de tipos/unidades y endpoints REST analíticos. |
| 📚 **[DOCUMENTACION_TECNICA.md](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/apex-link/docs/spec-driven-docs/DOCUMENTACION_TECNICA.md)** | **Capa 1: Backend / API** | Documentación técnica oficial del Backend (.NET 8 Clean Architecture, Win32 MMF `unsafe fixed Pack=4`, *SeqLock*, SQLite WAL, PostgreSQL Sync y WebSocket). |
| 📱 **[DOCUMENTACION_TECNICA_MODULO2_DASHBOARD.pdf](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/apex-link/docs/spec-driven-docs/DOCUMENTACION_TECNICA_MODULO2_DASHBOARD.pdf)** | **Capa 2: DDU Volante** | Especificación técnica integral del DDU (`apex-link-display`: Vite + React 19 + Zustand 5 atómico, 6 zonas ergonómicas, Shift Lights, Screen WakeLock y ADB reverse). |
| 💻 **[DOCUMENTACION_TECNICA_MODULO3_WEBAPP.md](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/apex-link/docs/spec-driven-docs/DOCUMENTACION_TECNICA_MODULO3_WEBAPP.md)** | **Capa 3: WebApp SaaS** | Especificación técnica integral de la plataforma web SaaS (`apex-link-web`: Next.js 15 App Router, Landing Page, Auth Local / Modo Invitado, Hub Multi-Juegos, Perfil con Ratings/Logros, Live Pitwall 60 Hz, Track Geometry 2D y gráficas uPlot metro a metro). |
| 📊 **[CONTROL_FASES_Y_TAREAS_INTEGRAL.md](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/apex-link/docs/spec-driven-docs/CONTROL_FASES_Y_TAREAS_INTEGRAL.md)** | **Gestión Global** | Control integral de fases, tareas atómicas (145 tareas), Gantt multi-carril, hitos de desbloqueo y matriz de riesgos para los 3 desarrolladores. |
| 📋 **[CONTROL_FASES_Y_TAREAS.md](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/apex-link/docs/spec-driven-docs/CONTROL_FASES_Y_TAREAS.md)** | **Gestión Capa 1** | Control atómico detallado de las 95 tareas del backend C# .NET. |
| 📖 **[MANUAL_SPEC_DRIVEN_DEVELOPMENT.md](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/apex-link/docs/spec-driven-docs/MANUAL_SPEC_DRIVEN_DEVELOPMENT.md)** | **Gobernanza SDD** | Manual de gobernanza para los 3 desarrolladores: jerarquía de verdad, ciclo Contract-First, política de cero divergencia y criterios DoD. |

---

## 🏛️ Arquitectura del Sistema en 3 Capas

```
┌────────────────────────────────────────────────────────────────────────┐
│ PC HOST WINDOWS (Simulador Assetto Corsa)                              │
│ • Local\acpmf_physics / graphic / static (Win32 MMF @ 333 Hz)          │
│ • CAPA 1: Backend Edge C# .NET 8 Kestrel (:8080)                       │
│   ├── Lector Nativo MMF (unsafe fixed Pack=4 + SeqLock)               │
│   ├── GeneradorTelemetriaMock (Monza 9 tramos determinístico)          │
│   ├── WebSocket RFC 6455 a 60 Hz (DropOldest canal acotado)            │
│   └── SQLite Local (Modo WAL) + API REST Analítica Normalizada         │
└──────────────┬──────────────────────────────────────────┬──────────────┘
               │ Túnel Físico USB                         │ WebSocket LAN
               │ (adb reverse tcp:8080 tcp:8080)          │ y HTTP REST
               │ Latencia < 0.8 ms                        │
               ▼                                          ▼
┌──────────────────────────────┐        ┌────────────────────────────────┐
│ CAPA 2: DDU EN VOLANTE       │        │ CAPA 3: PLATAFORMA WEB BOXES   │
│ (apex-link-display)          │        │ (apex-link-web)                │
│ • React 19 + Zustand 5       │        │ • Next.js 15 App Router        │
│ • 60-144 FPS acelerado GPU   │        │ • Live Pitwall en tiempo real  │
│ • Marcha gigante + ShiftLEDs │        │ • uPlot Gráficos Multieje      │
│ • Screen WakeLock + Kiosco   │        │ • Reconstructor 2D X/Z Heatmap │
└──────────────────────────────┘        └────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico Oficial

| Módulo | Tecnologías Seleccionadas | Justificación Técnica de Ingeniería |
| :--- | :--- | :--- |
| **Capa 1: Backend Relay & API** | C# .NET 8, ASP.NET Core Kestrel, Win32 MMF, System.Threading.Channels | Latencia sub-microsegundo ($< 4\mu\text{s}$ en MMF), bajo overhead ($< 1.5\%$ CPU), serialización UTF-8 zero-allocation. |
| **Capa 1: Persistencia** | SQLite (Modo WAL) + Store-and-Forward a PostgreSQL (`NpgsqlBatch`) | Rendimiento local garantizado con protección contra cortes de energía y sincronización asíncrona central. |
| **Capa 2: DDU Volante (Móvil)** | Vite 6, React 19, TypeScript, Tailwind CSS v4, Zustand 5, Lucide React | Selectores atómicos memoizados (97-99% reducción de re-renders), 60-144 FPS estables y consumo térmico mínimo. |
| **Capa 3: Plataforma Web Boxes** | Next.js 15 (App Router), Tailwind CSS, **uPlot**, HTML5 Canvas 2D | Renderizado de 10.000+ puntos métricos en $< 3\text{ ms}$, crosshair sincronizado y cálculo vectorial de trazada 2D. |
| **Enlace Físico USB** | ADB (`adb reverse tcp:8080 tcp:8080`) | Cero dependencia del Wi-Fi en eventos masivos, latencia determinística $< 0.8\text{ ms}$ y alimentación continua. |

---

## 📁 Estructura del Repositorio

* [`/docs`](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/apex-link/docs): Documentación general de arquitectura, hardware y roles.
* [`/docs/spec-driven-docs`](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/apex-link/docs/spec-driven-docs): **Suite Sagrada de Especificaciones y Contratos (SDD)**.
* [`/old`](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/apex-link/old): Código y prototipos exploratorios previos archivados (`dash-mobile`, `server`, `web`).
* [`/sdk`](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/apex-link/sdk): SDK y archivos de cabecera de Assetto Corsa.
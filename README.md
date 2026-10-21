# 🏁 Telemetría SimRacing para Assetto Corsa (FAPPE 2026)

> **Proyecto Final de Grado / Presentación FAPPE 2026**  
> **Plazo de Ejecución:** 3 Semanas (Sprint Urgente)  
> **Equipo:** 3 Desarrolladores  

---

## 🎯 Concepto y Propuesta de Valor

Este proyecto desarrolla un **ecosistema integral de telemetría automovilística y análisis de rendimiento para Assetto Corsa**, diseñado específicamente para maximizar el impacto visual y técnico durante la feria de proyectos estudiantiles **FAPPE 2026**.

El sistema resuelve tres problemáticas críticas del simracing y el motorsport formativo:
1. **Democratización de Instrumentación Profesional:** Transforma cualquier smartphone Android convencional en un display réplica de volante de Fórmula 1/GT3 mediante conexión física USB de ultrabaja latencia (<3ms), sustituyendo periféricos comerciales de más de $1.000 USD.
2. **Rol Activo de "Ingeniero de Carrera" para el Jurado:** Proporciona un dashboard de boxes en vivo (*Live Pitwall*) en Next.js donde docentes o público pueden monitorear el desgaste de frenos/gomas, deltas de tiempo e inputs de pedales mientras alguien conduce en el simulador.
3. **Telemetría Post-Sesión Accesible:** Elimina la barrera de software complejos como MoTeC, ofreciendo un mapa interactivo de trazadas con mapas de calor y superposición milimétrica de curvas de telemetría (freno, acelerador, velocidad) normalizadas por distancia de pista.

---

## 📚 Índice de Documentación del Proyecto

Toda la documentación técnica y de gestión se encuentra organizada en la carpeta [`/docs`](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/investigacion-proyecto-fappe-2026/docs):

1. 🏛️ **[Visión Integral, Concepto y Arquitectura del Sistema](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/investigacion-proyecto-fappe-2026/docs/architecture/01-overview.md)**
   - Problemática en SimRacing, propuesta de valor agregado, los tres momentos operativos del usuario (En Carrera, Cierre de Vuelta, Debrief), arquitectura en tres capas, diagramas C4 y secuencia interactiva.
2. 🔬 **[Investigación Técnica de Assetto Corsa](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/investigacion-proyecto-fappe-2026/docs/architecture/02-assetto-corsa-shared-memory.md)**
   - Estructuras Win32 MMF (`acpmf_physics`, `acpmf_graphic`, `acpmf_static`), frecuencias de muestreo (60Hz/10Hz) y mapeo de variables.
3. 🔌 **[Protocolo de Telemetría y Contratos API](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/investigacion-proyecto-fappe-2026/docs/api-specs/telemetry-protocol.md)**
   - Especificación JSON/Binary de WebSocket, eventos de inicio/fin de vuelta y endpoints REST para sesiones.
4. 📱 **[Conectividad Android por USB (Cero Latencia)](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/investigacion-proyecto-fappe-2026/docs/hardware-setup/android-usb-setup.md)**
   - Configuración con `adb reverse`, resolución de interferencias de red y scripts de arranque automático de un clic.
5. 👥 **[Matriz de Responsabilidades y Asignación de Roles](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/investigacion-proyecto-fappe-2026/docs/sprints/team-roles.md)**
   - Distribución detallada para Dev 1, Dev 2 y Dev 3 sin dependencias bloqueantes mediante el Mock Engine.
6. 📅 **[Cronograma de 3 Semanas (Día a Día / Sprints)](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/investigacion-proyecto-fappe-2026/docs/sprints/roadmap-3-weeks.md)**
   - Plan de entregas por semana, checkpoints, definición de terminado (DoD) y plan de contingencia para la presentación.
7. 🎪 **[Checklist de Puesta en Escena para la FAPPE](file:///C:/Users/Alejo%20Garlati/Documents/Facultad/investigacion-proyecto-fappe-2026/docs/hardware-setup/fappe-showcase-checklist.md)**
   - Requerimientos físicos del simulador, soporte para celular en volante, guion de pitch de 3 minutos y modo Demo offline de respaldo.

---

## 🛠️ Stack Tecnológico Seleccionado

| Módulo | Tecnologías | Justificación |
| :--- | :--- | :--- |
| **Telemetry Relay (PC)** | Node.js v22 (o Python), `ws` / WebSockets, Shared Memory MMF | Velocidad de desarrollo, bajo overhead (<2% CPU), multiplataforma de testeo. |
| **F1 Display (Móvil)** | Web PWA ultraoptimizada (Next.js/React + Canvas 2D / CSS GPU) | Sin necesidad de compilar APK ni instalar SDK de Android en todas las PCs. Funciona a 60 FPS nativo. |
| **Plataforma Web** | Next.js (App Router), TailwindCSS, Recharts / uPlot, Lucide Icons | Interfaz moderna, renderizado fluido para gráficos pesados de telemetría. |
| **Persistencia** | SQLite (Better-SQLite3) o JSON estructurado por vuelta | Cero configuración, liviano, portable para guardar sesiones de la feria. |
| **Enlace USB** | ADB (Android Debug Bridge) `adb reverse` | Latencia inferior a 3ms, no satura ni depende del WiFi del evento. |

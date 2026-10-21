# 📅 Cronograma de 3 Semanas (Sprint Urgente FAPPE)

Plan de acción día por día con metas semanales verificables para llegar con holgura a la presentación.

---

## Resumen del Calendario de Sprints

```mermaid
gantt
    title Cronograma de 3 Semanas hacia la FAPPE
    dateFormat  YYYY-MM-DD
    section Semana 1: Cimientos y Conectividad
    Setup de repo y contratos de API       :done, s1_1, 2026-10-19, 2d
    Lector de Memoria AC + Mock Engine     :active, s1_2, 2026-10-20, 3d
    Prototipo inicial Display F1 (Móvil)   :active, s1_3, 2026-10-21, 3d
    Setup Next.js & conexión WebSocket     :active, s1_4, 2026-10-21, 3d
    Validación de conexión USB adb         :s1_5, 2026-10-23, 2d

    section Semana 2: Desarrollo Central
    Display F1 completo (Shift LEDs, Deltas):s2_1, 2026-10-26, 4d
    Módulo Web Live (Pitwall en vivo)      :s2_2, 2026-10-26, 4d
    Motor de grabación de vueltas en DB    :s2_3, 2026-10-27, 3d
    Integración Simulador + Celular en vivo:crit, s2_4, 2026-10-30, 2d

    section Semana 3: Análisis, Pulido y Demo
    Módulo Post-Sesión (Gráficas Telemetría):s3_1, 2026-11-02, 3d
    Render de mapa de pista y trazadas     :s3_2, 2026-11-03, 3d
    Modo Demo Offline de respaldo          :s3_3, 2026-11-05, 2d
    Ensayo general con simulador físico    :crit, s3_4, 2026-11-06, 2d
    Presentación en la FAPPE               :milestone, fappe, 2026-11-08, 1d
```

---

## 🏁 Semana 1: Cimientos, Mock Engine y Enlace USB

| Día | Dev 1 (Core & Relay) | Dev 2 (F1 Display) | Dev 3 (Web Next.js) |
| :--- | :--- | :--- | :--- |
| **Día 1** | Configuración del monorepo / paquetes. Definir contrato JSON final. | Boceto en Figma/CSS del layout de volante F1. | Setup proyecto Next.js 15, TailwindCSS y Lucide. |
| **Día 2** | Desarrollar el **Mock Telemetry Engine** emitiendo datos por WS a 60Hz. | Maquetar estructura de volante (Gear central, RPM bar, Speed). | Crear estructura de rutas (`/live`, `/analysis`, `/sessions`). |
| **Día 3** | Implementar lector MMF de Assetto Corsa en PC con el juego abierto. | Conectar UI al WebSocket mock y animar barra de RPMs. | Implementar cliente WebSocket en Next.js para escuchar el stream. |
| **Día 4** | Integrar lector real con servidor WebSocket. | Implementar lógica de Shift LEDs (cambio de color según % RPM). | Construir componentes de acelerador y freno en tiempo real. |
| **Día 5** | Configurar y probar `adb reverse` con el cable USB en celular Android. | Probar la PWA en el teléfono físico por USB con pantalla completa. | Crear widget de G-Force bidimensional en vivo. |
| **Fin de Semana 1** | **Hito Semanal 1:** El teléfono montado al volante ya muestra marchas y RPMs en vivo saliendo del simulador por USB. |

---

## ⚡ Semana 2: Desarrollo Central y Grabación de Vueltas

| Día | Dev 1 (Core & Relay) | Dev 2 (F1 Display) | Dev 3 (Web Next.js) |
| :--- | :--- | :--- | :--- |
| **Día 6** | Detección de paso por meta (`lapCompleted`) y cálculo de deltas. | Añadir widget de neumáticos (temperaturas y presiones de 4 ruedas). | Diseñar dashboard completo de Boxes (Live Pitwall). |
| **Día 7** | Sistema de almacenamiento en SQLite o JSON para cada vuelta. | Añadir banderas de pista (Yellow flag, Green flag, Box flag). | Incorporar mapa 2D esquemático del circuito con posición del auto. |
| **Día 8** | Guardar muestras de telemetría (Throttle, Brake, Speed, Coords X/Z). | Añadir indicador de delta en tiempo real (+0.3s rojo / -0.2s verde). | Armar listado de vueltas registradas y selector de sesiones. |
| **Día 9** | Endpoints REST (`/api/sessions`, `/api/laps/:id/telemetry`). | Optimizar rendimiento: asegurar 60 FPS estables sin tirones. | Integrar librería de gráficos (uPlot o Recharts) para curvas de datos. |
| **Día 10** | Pruebas de estrés y reconexión automática tras desenchufar cable USB. | Incorporar botón de pantalla completa y WakeLock API. | Primera prueba de renderizado de gráfica multieje (Speed vs Distancia). |
| **Fin de Semana 2** | **Hito Semanal 2:** El sistema completo graba vueltas y el display del volante está 100% terminado y pulido. |

---

## 🏆 Semana 3: Análisis Post-Sesión, Pulido y Ensayos de Stand

| Día | Dev 1 (Core & Relay) | Dev 2 (F1 Display) | Dev 3 (Web Next.js) |
| :--- | :--- | :--- | :--- |
| **Día 11** | Empaquetar todo el backend en script ejecutable de 1 clic. | Ajustes de contraste para ambientes de mucha luz en la feria. | Desarrollar comparador de vueltas (Superposición Vuelta A vs Vuelta B). |
| **Día 12** | Desarrollar **Modo Demo Offline** (reproduce una vuelta grabada en bucle). | Soporte para cambiar de pantalla (modo Qualifying vs modo Carrera). | Algoritmo de dibujo de trazada con Canvas a partir de coordenadas X/Z. |
| **Día 13** | Pruebas de consumo de CPU mientras Assetto Corsa corre a 1080p/4K. | Pruebas de calentamiento del teléfono con brillo al máximo. | Colorear la trazada según frenada (rojo) y aceleración a fondo (verde). |
| **Día 14** | Ensayo general con el volante y pedalera conectados en la PC de feria. | Revisar que la app no se cuelgue ante ningún evento inesperado. | Revisión visual de toda la suite web; preparar modo presentación. |
| **Día 15** | Armado de maletín técnico y backups en pendrive. | Checklist de hardware (cables, soporte). | Guión de explicación para el jurado. |
| **Día FAPPE** | **¡PRESENTACIÓN Y DEFENSA DEL PROYECTO! 🏎️💨** |

---

## 🛡️ Plan de Contingencia para el Día del Evento

1. **¿Qué pasa si la PC del simulador se queda sin internet?**
   - El sistema opera 100% de manera local (`localhost:8080`). No requiere conexión a internet externa.
2. **¿Qué pasa si el simulador no puede correr por problemas de hardware o falta de espacio?**
   - Se activa el comando `npm run start:demo`, que ejecuta el **Mock Telemetry Engine** reproduciendo una vuelta grabada de Monza a 60 FPS. Tanto el volante en el teléfono como la plataforma web funcionarán con total fidelidad visual ante el jurado.
3. **¿Qué pasa si el cable USB se desconecta durante una vuelta?**
   - El display en el móvil muestra un banner de reconexión y se reengancha en menos de 1 segundo al reconectar el cable sin necesidad de reiniciar la app.

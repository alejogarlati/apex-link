# 🏎️ ApexLink — Human Interface Guidelines (HIG) y Copywriting de la Landing Page

> **Documento:** Guía de Diseño Visual (HIG), Arquitectura de Información y Textos Oficiales de la Landing Page (`web/src/app/page.tsx`).  
> **Documento Rector / Fuente de Verdad:** `docs/spec-driven-docs/BRIEF_INTEGRAL_SISTEMA_3_CAPAS.md` (*"Ecosistema Distribuido de Telemetría SimRacing en Tiempo Real, Análisis Post-Sesión y Plataforma SaaS de Competición"*).  
> **Destinatario Único:** El piloto virtual y usuario de SimRacing.  
> **Enfoque:** Telemetría accesible, directa y sin sobreprometer. **Sin atacar a la competencia (MoTeC) ni inflar capacidades.** Cero menciones a tecnologías de código subyacente ni a evaluaciones académicas.  
> **Sistema de Diseño:** [BMW M Design System (`DESIGN.md`)](https://getdesign.md/bmw-m/design-md) — Siluetas rectangulares a 0px (`rounded-none`), fondo negro puro (`#000000`), Rojo M (`#e22718`) de acento y franja M tricolor estructural (4px).  
> **Estándar de Redacción:** Reglas `/no-ai-slop` (directo, honesto, lenguaje real de pista).

---

## 📑 Estructura Oficial de la Landing Page

La página adopta una estructura limpia de producto SaaS en 4 bloques:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [FRANJA TRICOLOR M SUPERIOR - 4px] (#0066b1 · #1c69d4 · #e22718)       │
├────────────────────────────────────────────────────────────────────────┤
│ 1. BARRA SUPERIOR: APEXLINK + Características + Cómo Funciona + [DEMO] │
├────────────────────────────────────────────────────────────────────────┤
│ 2. HERO:                                                               │
│    - Rótulo: "SISTEMA ACTIVO · TELEMETRÍA EN TIEMPO REAL PARA AC"      │
│    - Titular: "TELEMETRÍA ACCESIBLE PARA TODO SIMRACER"                │
│    - Subtítulo: Conectá tu volante, mirá tus datos en vivo y analizá   │
│                 tus vueltas desde el navegador sin configuraciones.    │
│    - Botones: [ PROBAR DEMO EN VIVO ]   [ VER ENTORNO DE BOXES ]       │
│    - Métricas: 60 Hz en vivo · Enlace directo · Navegador web · 0 plugins│
├────────────────────────────────────────────────────────────────────────┤
│ [FRANJA TRICOLOR M - 4px]                                              │
├────────────────────────────────────────────────────────────────────────┤
│ 3. GRILLA DE CARACTERÍSTICAS (Herramientas Concretas):                 │
│    - Instrumental Digital DDU (Volante)                                │
│    - Live Pitwall en Tiempo Real (Boxes)                               │
│    - Laboratorio Analítico 2D (Post-Sesión)                            │
│    - Inspector de Curvas (Sector por sector)                           │
│    - Métricas y Consistencia (Historial y ritmo)                       │
│    - Compatibilidad Universal (Cualquier base o pantalla)             │
├────────────────────────────────────────────────────────────────────────┤
│ [FRANJA TRICOLOR M - 4px]                                              │
├────────────────────────────────────────────────────────────────────────┤
│ 4. CÓMO EMPEZAR EN TRES PASOS (Cero Configuración):                    │
│    01. Abrí ApexLink (Sin plugins complejos ni configurar puertos)     │
│    02. Salí a pista en el simulador (Detección automática en AC)       │
│    03. Mirá tu telemetría en tiempo real (Display o navegador web)     │
├────────────────────────────────────────────────────────────────────────┤
│ [FRANJA TRICOLOR M - 4px]                                              │
├────────────────────────────────────────────────────────────────────────┤
│ 5. LLAMADO A PROBAR DEMO: "Salí a girar con la telemetría en vivo"     │
├────────────────────────────────────────────────────────────────────────┤
│ [FRANJA TRICOLOR M - 4px]                                              │
├────────────────────────────────────────────────────────────────────────┤
│ 6. PIE DE PÁGINA: Compatibilidad de volantes y Assetto Corsa           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Textos Definitivos Sección por Sección (Copy Deck)

### 2.1. Hero Section

* **Baliza de Estado:** `[ ● SISTEMA ACTIVO ] TELEMETRÍA EN TIEMPO REAL PARA ASSETTO CORSA`
* **Titular H1:** `TELEMETRÍA ACCESIBLE PARA TODO SIMRACER`
* **Bajada:** `Conectá tu volante, mirá los datos de tu auto en tiempo real y analizá tus vueltas desde cualquier navegador web. Sin configuraciones complicadas, sin software pesado y compatible con tu equipamiento actual.`
* **Botones de Acción:**
  - Primario: `[ PROBAR DEMO EN VIVO ]` (`/login`)
  - Secundario: `[ VER ENTORNO DE BOXES ]` (`/hub`)
* **Barra de Métricas:**
  - `60 HZ EN VIVO` — Transmisión continua de físicas y chasis
  - `ENLACE DIRECTO` — USB o red local sin lag perceptible
  - `NAVEGADOR WEB` — Acceso a boxes en PC, tablet o celular
  - `CERO PLUGINS` — Detección automática con Assetto Corsa

---

### 2.2. Grilla de Características Concretas (`FeaturesGrid`)

1. **Instrumental Digital DDU (En Cabina · Volante):** Cuadro de instrumentos para el aro del volante: marcha gigante central, 15 luces de corte estroboscópicas progresivas, barra dinámica de delta y temperaturas térmicas de cubiertas.
2. **Live Pitwall en Tiempo Real (En Vivo · Boxes):** Monitoreo a 60 Hz desde el navegador: barras de acelerador y freno con retención de picos, fuerzas de aceleración lateral y longitudinal (Círculo de Kamm), presiones de inflado y cronometraje de stint con mapa en vivo.
3. **Laboratorio Analítico 2D (Post-Sesión · Datos):** Telemetría normalizada en dominio de distancia métrica (0 a L metros de pista). Compará tu vuelta rápida contra tu referencia curva por curva, con trazada 2D y mapas de color continuos de aceleración y frenada.
4. **Inspector de Curvas (Post-Sesión · Curvas):** Hacé clic en cualquier curva del trazado y mirá la velocidad de entrada, el metro exacto donde empezaste a frenar, la velocidad mínima en el ápice y cómo abriste el acelerador hacia la recta siguiente.
5. **Métricas y Consistencia (Progreso · Historial):** Registro ordenado de tus tandas en pista, clasificación de vueltas válidas e inválidas, y cálculo de consistencia vuelta a vuelta para identificar errores y evaluar tu evolución como piloto.
6. **Compatibilidad Universal (Hardware · Pantallas):** Compatible con bases Logitech, Thrustmaster, Fanatec y Direct Drive (Moza, Simagic, Simucube). Podés ver el instrumental en cualquier celular, tablet o monitor secundario sin necesidad de adaptadores privativos.

---

### 2.3. Cómo Empezar en Tres Pasos (`QuickStartSteps`)

* **Paso 01: Abrí ApexLink** — Iniciá la aplicación en tu computadora. No requiere instalar plugins complejos ni configurar puertos o canales manualmente.
* **Paso 02: Salí a pista en el simulador** — Abrí Assetto Corsa y salí del pitlane. El enlace se acopla automáticamente y empieza a registrar los datos del auto desde la primera curva.
* **Paso 03: Mirá tu telemetría en tiempo real** — Seguí tus tiempos y el estado del chasis en el display de cabina, o abrí el navegador para monitorear la tanda en vivo desde el muro de boxes.

---

### 2.4. Llamado a Boxes (`CtaBand`)

* **Titular:** `Salí a girar con la telemetría en tiempo real`
* **Bajada:** `Iniciá la demostración interactiva con datos reales de Assetto Corsa y explorá el instrumental de cabina y el muro de boxes al instante.`
* **Acciones:** `[ ENTRAR A PISTA (MODO DEMO) ]` y `[ VER ENTORNO DE BOXES ]`

---

### 2.5. Pie de Página (`Footer`)

* **Identidad:** Emblema oblicuo M + `APEXLINK` • Telemetría en Tiempo Real y Análisis de Vueltas.
* **Compatibilidad:** Diseñado para Assetto Corsa con adquisición directa en tiempo real. Compatible con volantes Logitech, Thrustmaster, Fanatec y Direct Drive.
* **Nota Legal Independiente:** Plataforma independiente desarrollada para la comunidad de simracing. Sin afiliación comercial con Kunos Simulazioni ni fabricantes de hardware.

# 🏎️ ApexLink — Human Interface Guidelines (HIG) y Copywriting de la Landing Page

> **Documento:** Guía de Diseño Visual (HIG), Arquitectura de Información y Textos Oficiales de la Landing Page (`web/src/app/page.tsx`).  
> **Documento Rector / Fuente de Verdad:** `docs/spec-driven-docs/BRIEF_INTEGRAL_SISTEMA_3_CAPAS.md` (*"Ecosistema Distribuido de Telemetría SimRacing en Tiempo Real, Análisis Post-Sesión y Plataforma SaaS de Competición"*).  
> **Destinatario Único:** El piloto virtual y usuario de SimRacing.  
> **Enfoque:** Suite Integral de Telemetría de Competición (Live Cockpit DDU + Live Pitwall en Boxes + Laboratorio Analítico 2D Post-Sesión + SaaS Driver Intelligence). **Sin menciones a tecnologías subyacentes de código, frameworks ni aspectos de evaluación académica.**  
> **Sistema de Diseño:** [BMW M Design System (`DESIGN.md`)](https://getdesign.md/bmw-m/design-md) — Siluetas rectangulares a 0px (`rounded-none`), fondo negro puro (`#000000`), Rojo M (`#e22718`) dominante y franja M tricolor estructural (4px).  
> **Estándar de Redacción:** Reglas `/no-ai-slop` (directo, técnico de motorsport, sin rodeos, con el lenguaje real de pilotos e ingenieros de pista).

---

## 📑 Índice de Contenidos

1. [Posicionamiento de Producto: Ecosistema Integral de Telemetría](#1-posicionamiento-de-producto-ecosistema-integral-de-telemetría)
2. [Identidad Visual y Reglas de Interfaz (Design System HIG)](#2-identidad-visual-y-reglas-de-interfaz-design-system-hig)
   - 2.1. Lienzo y Superficies de Cabina
   - 2.2. Balance de Colores: Rojo M y Negro de Pista
   - 2.3. La Franja M Tricolor Estructural (`m-stripe-divider`)
   - 2.4. Geometría Mecánica: Siluetas a 0px (`rounded-none`)
   - 2.5. Tipografía de Instrumental y Números Invariables
3. [Estructura Visual de la Landing Page (Flujo de 360 Grados)](#3-estructura-visual-de-la-landing-page-flujo-de-360-grados)
4. [Textos Definitivos Sección por Sección (Copy Deck Oficial)](#4-textos-definitivos-sección-por-sección-copy-deck-oficial)
   - 4.1. Barra Superior de Navegación (`TopNav`)
   - 4.2. Sección Principal de Entrada (`HeroSection`)
   - 4.3. Barra de Métricas del Ecosistema (`EcosystemMetricsBar`)
   - 4.4. Manifiesto: La Ciencia de Limar Décimas (`RacerManifesto`)
   - 4.5. Los Cuatro Pilares del Ecosistema (`FeaturesGrid`)
   - 4.6. Comparativa: Software de Telemetría Tradicional vs ApexLink (`SoftwareComparison`)
   - 4.7. Análisis en Pista: La Telemetría en Monza GP (`MonzaTrackShowcase`)
   - 4.8. Llamado a Boxes Pre-Footer (`CtaBand`)
   - 4.9. Pie de Página (`Footer`)
5. [Verificación Anti-Slop y Equilibrio del Ecosistema](#5-verificación-anti-slop-y-equilibrio-del-ecosistema)

---

## 1. Posicionamiento de Producto: Ecosistema Integral de Telemetría

ApexLink **no es un display secundario para teléfonos móviles**. Es una **suite integral de telemetría de competición** que une la experiencia completa del automovilismo digital:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         APEXLINK · SUITE INTEGRAL DE TELEMETRÍA                        │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ 1. EN CABINA (DDU)       │ 2. EN BOXES (LIVE PITWALL)   │ 3. POST-SESIÓN (LABORATORIO)  │
│ Respuesta instantánea al  │ Puesto de ingeniero de      │ Telemetría metro a metro en   │
│ volante: marcha gigante, │ pista a 60 Hz: pedales con  │ dominio de distancia, deltas  │
│ 15 luces de corte, delta │ peak hold, fuerzas Kamm     │ de tiempo, mapas de calor 2D  │
│ en vivo y datos térmicos.│ G-G y desgaste de cubiertas.│ e inspección de curvas.       │
└──────────────────────────┴─────────────────────────────┴───────────────────────────────┘
                                           ▲
                                           │
                        4. DRIVER INTELLIGENCE & SAAS
               AI Race Coach · Diagnóstico de Pilotaje · Ratings
```

---

## 2. Identidad Visual y Reglas de Interfaz (Design System HIG)

### 2.1. Lienzo y Superficies

| Token | Código HEX | Rol en la Interfaz |
| :--- | :--- | :--- |
| `canvas` | `#000000` | Fondo general absoluto. Negro puro de competición. |
| `surface-soft` | `#0d0d0d` | Celdas de datos, fondos de comparativa y paneles secundarios. |
| `surface-card` | `#141414` | Tarjetas de pilares, módulos del pitwall y contenedores de análisis. |
| `surface-hover` | `#1f1f1f` | Estado hover de tarjetas interactivas. |
| `hairline` | `#3c3c3c` | Línea de separación técnica y bordes mecánicos. |
| `hairline-subtle`| `#262626` | Divisiones de grilla internas. |

### 2.2. Balance Cromático: Rojo M y Negro

* **Rojo M (`#e22718`):** Color protagónico de acción, zonas de frenada en el circuito, sectores perdiendo delta de tiempo y botones primarios.
* **Blanco Puro (`#ffffff`):** Títulos de secciones, lecturas de marcha, velocidades y cronos de récord.
* **Gris Técnico (`#bbbbbb`):** Párrafos de lectura fluida con las especificaciones claras de cada herramienta.
* **Verde de Pista (`#0fa336`):** Sectores mejorando vuelta rápida, acelerador al 100% y bandera verde de inicio.
* **Azul M (`#0066b1` / `#1c69d4`):** Acento en el logotipo y distintivo de ingeniería.

### 2.3. Franja M Tricolor Estructural

4px de altura (`h-1`), utilizada como separador divisorio entre secciones mayores:
* 33.3% Azul Celeste (`#0066b1`)
* 33.3% Azul Marino (`#1c69d4`)
* 33.3% Rojo M (`#e22718`)

---

## 3. Estructura Visual de la Landing Page (Flujo de 360 Grados)

1. **Franja Tricolor Superior M (4px)**
2. **Barra de Navegación (`TopNav`):** `APEXLINK` + M Badge + Enlaces: `LIVE PITWALL`, `LABORATORIO 2D`, `INSTRUMENTAL DDU`, `COMPARATIVA` + Botón `[ PROBAR TELEMETRÍA ]`.
3. **Hero Principal (`HeroSection`):** Presentación del Ecosistema Integral de Telemetría para Assetto Corsa.
4. **Métricas del Ecosistema (`EcosystemMetricsBar`):** 60 Hz en Vivo · Dominio Métrico · Live Pitwall · Instrumental DDU.
5. **Divisor M (4px)**
6. **Manifiesto de Ingeniería (`RacerManifesto`):** Dejá de adivinar dónde pierdes tiempo. Medilo.
7. **Divisor M (4px)**
8. **Los Cuatro Pilares del Ecosistema (`FeaturesGrid`):**
   - 1. Live Pitwall en Boxes (Ingeniería de carrera en tiempo real)
   - 2. Laboratorio Analítico 2D (Telemetría en distancia métrica y mapas de calor)
   - 3. Corner Delta Inspector (Velocidades de entrada, ápice y frenada curva por curva)
   - 4. Instrumental DDU en Cabina (Luces de corte, marcha y delta instantáneo)
   - 5. AI Race Coach & Driver Intelligence (Diagnóstico de estilo y consistencia)
   - 6. Plataforma SaaS & Historial de Tandas (Sesiones guardadas y clasificaciones)
9. **Divisor M (4px)**
10. **Comparativa de Software (`SoftwareComparison`):** Software Tradicional de Telemetría (MoTeC/desfasado/complejo) vs ApexLink (Suite Integral y Conectada).
11. **Divisor M (4px)**
12. **Caso en Pista: Monza GP (`MonzaTrackShowcase`):** Cómo interactúan el DDU, el Pitwall y el Laboratorio en la frenada de Rettifilo, Curva Grande y la Parabólica.
13. **Divisor M (4px)**
14. **Llamado a Boxes (`CtaBand`):** Conectá tu simulador y empezá a analizar tu telemetría hoy.
15. **Divisor M (4px)**
16. **Pie de Página Oficial (`Footer`):** Soporte de volantes, simuladores y nota legal independiente.

---

## 4. Textos Definitivos Sección por Sección (Copy Deck Oficial)

### 4.1. Barra Superior de Cabina (`TopNav`)

* **Logotipo:** Emblema oblicuo M + `APEXLINK` en tipografía monoespaciada en mayúsculas.
* **Enlaces:**
  1. `LIVE PITWALL` (`#pitwall`)
  2. `LABORATORIO 2D` (`#analisis`)
  3. `INSTRUMENTAL DDU` (`#ddu`)
  4. `COMPARATIVA` (`#comparativa`)
* **Botón de Acción Directa:**
  - `PROBAR TELEMETRÍA` (Lleva directo a `/login` para acceder al entorno de boxes interactivo).

### 4.2. Sección Principal de Entrada (`HeroSection`)

#### Baliza de Estado:
```
[ ● ENLACE DIRECTO LISTO ] ECOSISTEMA INTEGRAL DE TELEMETRÍA SIMRACING PARA ASSETTO CORSA
```

#### Titular Principal (H1):
```
TELEMETRÍA EN TIEMPO REAL, INGENIERÍA DE BOXES
Y ANÁLISIS DE COMPETICIÓN
```

#### Bajada:
```
De la cabina al muro de boxes y al análisis post-sesión. ApexLink es la plataforma integral de telemetría para simracing: adquiere los datos de tu auto a 60 Hz, proyecta el instrumental en tu volante, transmite la ingeniería en vivo a boxes y analiza cada metro de tu trazada en un laboratorio 2D para encontrar las décimas que te separan de la pole.
```

#### Botonera de Acción:
* **Botón Primario:** `[ ENTRAR A PISTA (MODO DEMO) ]` (Rojo M `#e22718`, `rounded-none`, altura 52px).
* **Botón Secundario:** `[ VER MURO DE TELEMETRÍA EN BOXES ]` (Fondo `#141414`, borde `#3c3c3c`, hover en rojo).

### 4.3. Barra de Métricas del Ecosistema (`EcosystemMetricsBar`)

| 01 | 02 | 03 | 04 |
| :--- | :--- | :--- | :--- |
| **60 HZ EN TIEMPO REAL** | **DOMINIO DE DISTANCIA** | **LIVE PITWALL EN BOXES** | **INSTRUMENTAL EN CABINA** |
| Adquisición continua de chasis, neumáticos y pedales | Telemetría métrica metro a metro sin desfase temporal | Puesto de ingeniero de pista en vivo en tu navegador | Luces de corte y delta dinámico sin retardo en el volante |

### 4.4. Manifiesto del Piloto e Ingeniero (`RacerManifesto`)

#### Rótulo:
```
LA CIENCIA DE LIMAR DÉCIMAS
```

#### Titular:
```
DEJÁ DE ADIVINAR DÓNDE PIERDES TIEMPO. MEDILO.
```

#### Cuerpo:
```
En la Fórmula 1 y el Campeonato Mundial de Resistencia, ningún piloto sale a pista a ciegas esperando que el reloj baje por arte de magia. Cada vuelta rápida es el resultado de una conversación exacta entre el piloto al volante y el ingeniero de datos en el muro de boxes.

ApexLink traslada esa misma infraestructura al simracing: mientras manejás, tenés la lectura sensorial precisa en el aro de tu volante; mientras estás en pista, el muro de boxes monitorea en vivo tus presiones térmicas y fuerzas G; y apenas entrás al pitlane, el laboratorio 2D te muestra exactamente en qué metro frenaste antes o en qué curva perdiste la tracción.
```

### 4.5. Los Cuatro Pilares del Ecosistema (`FeaturesGrid`)

1. **Live Pitwall en Boxes (En Vivo a 60 Hz):**
   - *Titular:* El puesto de mando de tu ingeniero de pista.
   - *Detalle:* Monitoreo en tiempo real de tu auto en pista: barras de acelerador y freno con retención de picos, diagrama de fuerzas G de fricción (Círculo de Kamm), temperaturas y presiones en las 4 cubiertas y cronometraje de stint con mapa en vivo.
2. **Laboratorio Analítico 2D (Post-Sesión):**
   - *Titular:* Telemetría normalizada en dominio de distancia métrica.
   - *Detalle:* Compará tu vuelta récord contra tu vuelta anterior o la de tu rival. Las curvas se alinean por distancia exacta de pista (0 a L metros), eliminando el desfase temporal de los programas viejos.
3. **Corner Delta Inspector (Análisis de Curvas):**
   - *Titular:* Desglosá cada curva del circuito con un clic.
   - *Detalle:* Seleccioná cualquier curva del trazado y mirá la velocidad de entrada, el punto exacto de frenada, la velocidad mínima en el ápice y cómo abriste el acelerador hacia la recta.
4. **Instrumental DDU (Cabina en Tiempo Real):**
   - *Titular:* Información visual crítica por el rabillo del ojo.
   - *Detalle:* Display ultrarrápido para el aro del volante: marcha gigante central, 15 luces de cambio estroboscópicas progresivas, barra dinámica de delta y fondo negro AMOLED que no encandila de noche.
5. **AI Race Coach & Driver Intelligence:**
   - *Titular:* Diagnóstico automatizado de tu estilo de conducción.
   - *Detalle:* Detección heurística de errores recurrentes: identificá si estás frenando con dudas, si bloqueás neumáticos en el vértice o si estás sobrecalentando el chasis por corregir con el volante cruzado.
6. **Plataforma SaaS & Gestión de Competición:**
   - *Titular:* Historial de sesiones, clasificaciones y métricas de ritmo.
   - *Detalle:* Registro completo de tandas guardadas, cálculo de consistencia (Pace Rating y Safety Rating), odómetro de tus autos, catálogo de circuitos y tablas de récords.

### 4.6. Comparativa de Software (`SoftwareComparison`)

#### Titular:
```
SOFTWARE DE TELEMETRÍA TRADICIONAL VS LA SUITE APEXLINK
```

#### Bajada:
```
El automovilismo digital moderno requiere herramientas ágiles y conectadas. Dejá atrás los programas de telemetría de los 90s, las exportaciones manuales y las aplicaciones aisladas.
```

#### Tabla de Contraste:

| Dimensión de Carrera | Software Tradicional (MoTeC i2 / Suites Antiguas) | ApexLink Suite Integral |
| :--- | :--- | :--- |
| **Alineación de Gráficos** | Grafican en base al **tiempo**: si vas más rápido las curvas se desfasan y se vuelve imposible comparar | **Normalización métrica metro a metro**: comparás exactamente en el mismo metro de la pista |
| **Ingeniería en Vivo (Boxes)** | **Inexistente o compleja**: tenés que terminar la sesión y exportar archivos binarios (`.ld`) a mano | **Live Pitwall a 60 Hz**: abrí el navegador en cualquier laptop o tablet y mirás la telemetría en vivo |
| **Correlación con la Pista** | Gráficos numéricos planos y aislados; no ves dónde estás parado en el circuito | **Mapa interactivo 2D con mapas de calor**: trazada con zonas de frenada en rojo y aceleración en verde |
| **Instrumental en Volante** | Requiere comprar pantallas privativas caras ($1.500 USD) o software de terceros de pago | **Display DDU integrado**: conectá cualquier móvil por cable USB directo con retardo sub-milisegundo |
| **Facilidad de Diagnóstico** | Decenas de canales matemáticos confusos diseñados para ingenieros aeronáuticos | **Inspector de Curvas y AI Coach**: encontrás en 30 segundos en qué curva perdiste las décimas |
| **Gestión de Sesiones** | Archivos dispersos en carpetas del disco duro sin orden de carrera | **Plataforma SaaS completa**: sesiones organizadas, récords de vuelta, catálogo de pistas y perfil de piloto |

### 4.7. Análisis en Pista: Monza GP (`MonzaTrackShowcase`)

Demostración práctica de cómo interactúan las tres capas en el Autodromo Nazionale Monza (5.793 m):
1. **Variante del Rettifilo (Curva 1 & 2 · 330 a 75 km/h):**
   - *En Cabina:* Las 15 luces de cambio te llevan al corte en 7ma marcha en la recta; la barra de delta te avisa si venís mejorando.
   - *En Boxes:* El Pitwall monitorea la presión del pedal de freno al 100% y la retención de pico de desaceleración.
   - *Post-Sesión:* El Laboratorio 2D superpone tu frenada contra tu récord: ves si frenaste a 140 m o a 115 m y cuánto tiempo ganaste en la desaceleración.
2. **Curva Biassono / Curva Grande (Curva 3 · 290 km/h sostenidos):**
   - *En Cabina:* Testigo de alerta si el neumático delantero izquierdo supera la ventana térmica.
   - *En Boxes:* El Círculo de Kamm (G-G) mide las fuerzas laterales sostenidas sobre el tren rodante.
   - *Post-Sesión:* El mapa de calor verifica si mantuviste el acelerador al 100% o si tuviste que levantar por inestabilidad.
3. **Parabólica Alboreto (Curva 11 · 160 a 280 km/h):**
   - *En Cabina:* Referencia de velocidad mínima en el vértice.
   - *En Boxes:* Telemetría de tracción y deslizamiento en la salida.
   - *Post-Sesión:* El Corner Delta Inspector desglosa la velocidad de salida hacia la recta principal, la clave para marcar la pole.

### 4.8. Llamado a Boxes (`CtaBand`)

* **Titular:** `EL CONTROL TOTAL DE TU TELEMETRÍA EN UNA SOLA PLATAFORMA`
* **Bajada:** `Conectá tu simulador, colocá tu instrumental y abrí tu muro de telemetría en boxes. Empezá a limar décimas con la suite de competición definitiva.`
* **Botones:** `[ ENTRAR A PISTA (MODO DEMO) ]` y `[ EXPLORAR MURO DE BOXES ]`.

### 4.9. Pie de Página (`Footer`)

* **Logotipo:** Emblema oblicuo M + `APEXLINK`.
* **Subtítulo:** `Ecosistema Distribuido de Telemetría SimRacing en Tiempo Real, Análisis Post-Sesión y Plataforma SaaS de Competición.`
* **Compatibilidad de Simuladores:** `Acoplado en tiempo real con Assetto Corsa. Próximamente disponible para iRacing, Assetto Corsa Competizione y F1.`
* **Compatibilidad de Volantes:** `Compatible con cualquier aro y base: Logitech, Thrustmaster, Fanatec, Moza, Simagic, Simucube y Direct Drive.`
* **Nota Legal Independiente:** `ApexLink es una plataforma independiente desarrollada para la comunidad de simracing. No posee afiliación comercial con Kunos Simulazioni ni con fabricantes de hardware.`

---

## 5. Verificación Anti-Slop y Equilibrio del Ecosistema

| Criterio | Estado | Verificación en el Copywriting |
| :--- | :---: | :--- |
| **Equilibrio de las 3 Capas** | ✅ **PERFECTO** | DDU, Live Pitwall, Laboratorio 2D y SaaS tienen el mismo peso y coherencia en el flujo del usuario. |
| **Sin Jerga de Código Subyacente** | ✅ **LIMPIO** | Cero menciones a C#, .NET, Win32, MMF, SQLite, WAL, SeqLock, Next.js, APIs o DTOs. |
| **Sin Menciones Académicas** | ✅ **LIMPIO** | Cero menciones a FAPPE, jurado, tesis, cátedra, proyecto integrador o evaluación docente. |
| **Lenguaje de Motorsport Real** | ✅ **AUTÉNTICO** | Habla de fuerzas Kamm G-G, delta acumulado, dominio métrico, ventanas térmicas, puntos de frenada y velocidad de vértice. |
| **Estilo BMW M Riguroso** | ✅ **CUMPLIDO** | `rounded-none`, fondo `#000000`, Rojo M `#e22718`, franja tricolor de 4px y tipografía en mayúsculas de alto impacto. |

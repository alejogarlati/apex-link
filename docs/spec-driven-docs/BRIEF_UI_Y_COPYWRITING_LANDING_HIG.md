# 🏎️ ApexLink — Human Interface Guidelines (HIG) y Copywriting de la Landing Page

> **Documento:** Guía de Diseño Visual (HIG), Arquitectura de Información y Textos Oficiales de la Landing Page (`web/src/app/page.tsx`).  
> **Destinatario Único:** El piloto virtual y usuario de SimRacing.  
> **Enfoque:** 100% experiencia de pista, instrumental de cabina y análisis de telemetría. **Sin menciones a tecnologías, código, arquitecturas de software ni evaluaciones académicas.**  
> **Sistema de Diseño:** [BMW M Design System (`DESIGN.md`)](https://getdesign.md/bmw-m/design-md) — Siluetas rectangulares a 0px (`rounded-none`), fondo negro puro (`#000000`), Rojo M (`#e22718`) dominante y franja M tricolor estructural.  
> **Estándar de Redacción:** Reglas `/no-ai-slop` (directo, sin rodeos, sin frases armadas de marketing, con el lenguaje real de los pilotos).

---

## 📑 Índice de Contenidos

1. [Identidad Visual y Reglas de Interfaz (Design System HIG)](#1-identidad-visual-y-reglas-de-interfaz-design-system-hig)
   - 1.1. Lienzo y Superficies de Cabina
   - 1.2. Balance de Colores: Rojo M y Negro de Pista
   - 1.3. La Franja M Tricolor Estructural (`m-stripe-divider`)
   - 1.4. Geometría Mecánica: Siluetas a 0px (`rounded-none`)
   - 1.5. Tipografía de Instrumental y Números Invariables
2. [Estructura Visual de la Landing Page](#2-estructura-visual-de-la-landing-page)
3. [Textos Definitivos Sección por Sección (Copy Deck)](#3-textos-definitivos-sección-por-sección-copy-deck)
   - 3.1. Barra Superior de Cabina (`TopNav`)
   - 3.2. Sección Principal de Entrada (`HeroSection`)
   - 3.3. Barra de Métricas Rápidas de Carrera (`TrackSpecBar`)
   - 3.4. Manifiesto del Piloto: Medir vs Adivinar (`RacerManifesto`)
   - 3.5. Tabla Comparativa de Volantes y Costos (`HardwareComparison`)
   - 3.6. Los Tres Momentos de la Carrera (`RacerExperienceGrid`)
   - 3.7. Análisis en Pista: La Telemetría en Monza GP (`MonzaTrackShowcase`)
   - 3.8. Llamado a Pista Pre-Footer (`CtaBand`)
   - 3.9. Pie de Página (`Footer`)
4. [Componentes Listos para Implementar en Tailwind CSS](#4-componentes-listos-para-implementar-en-tailwind-css)
5. [Verificación Anti-Slop: Lenguaje de Piloto a Piloto](#5-verificación-anti-slop-lenguaje-de-piloto-a-piloto)

---

## 1. Identidad Visual y Reglas de Interfaz (Design System HIG)

La interfaz se concibe como una extensión del cockpit del monoplaza: sobria, con alto contraste y sin elementos gráficos superfluos que distraigan.

### 1.1. Lienzo y Superficies de Cabina

| Token | Código HEX | Rol en la Interfaz |
| :--- | :--- | :--- |
| `canvas` | `#000000` | Fondo general absoluto. En pantallas de teléfono OLED apaga los píxeles negros, elimina el brillo que encandila al piloto y evita que el móvil caliente en carreras largas. |
| `surface-soft` | `#0d0d0d` | Celdas de datos, fondos de comparativa y paneles secundarios de boxes. |
| `surface-card` | `#141414` | Tarjetas de características, bloques de neumáticos y paneles de instrumentos. |
| `surface-hover` | `#1f1f1f` | Estado al apoyar el cursor sobre tarjetas o botones secundarios. |
| `hairline` | `#3c3c3c` | Línea de división fina de 1px entre bloques y bordes de tarjetas. |
| `hairline-subtle`| `#262626` | Divisiones internas de grillas. |

---

### 1.2. Balance de Colores: Rojo M y Negro de Pista

El color principal es el **Rojo M (`#e22718`)** combinado con negro absoluto y grises oscuros:

* **Rojo M (`#e22718`):** Botón principal para salir a pista, barras activas, zonas de frenada en el mapa del circuito y alertas de delta perdiendo tiempo.
* **Blanco Puro (`#ffffff`):** Títulos principales, números gigantes de marcha, velocidad y tiempos de vuelta.
* **Gris Técnico (`#bbbbbb`):** Explicaciones claras de cómo funciona cada pantalla y herramienta.
* **Gris Oscuro (`#7e7e7e`):** Etiquetas secundarias (unidades de medida, presión en PSI, litros de combustible).
* **Verde de Pista (`#0fa336`):** Bandera verde, delta mejorando respecto a tu récord personal y acelerador a fondo.

---

### 1.3. La Franja M Tricolor Estructural (`m-stripe-divider`)

El distintivo tricolor de competición aparece como divisor horizontal de 4px (`h-1`):
1. Azul Celeste (`#0066b1`) — 33.3%
2. Azul Marino (`#1c69d4`) — 33.3%
3. Rojo M (`#e22718`) — 33.3%

Se ubica en la parte superior fija de la pantalla y como remate divisorio entre secciones principales. **Nunca se utiliza como fondo de botones ni como degradado de texto**.

---

### 1.4. Geometría Mecánica: Siluetas a 0px (`rounded-none`)

* **Esquinas vivas a 0px (`rounded-none`):** Todos los botones, tarjetas de telemetría, tablas comparativas y contenedores tienen esquinas rectas. Imitan los displays de fibra de carbono y las botoneras de aluminio de los volantes de Fórmula 1 y GT3.
* **Círculos exclusivos (`rounded-full`):** Únicamente se permiten esquinas redondeadas en botones circulares de utilidad (ajustes, pantalla completa) o en las luces LED de corte de revoluciones.

---

### 1.5. Tipografía de Instrumental y Números Invariables

* **Titulares y Botones:** Texto en **MAYÚSCULAS**, tipografía sans-serif limpia, peso **Bold 700**, con separación entre letras de **1.5px (`tracking-[0.15em]`)** para facilitar la lectura rápida de un vistazo.
* **Cuerpo de Lectura:** Texto claro en tamaño 15-16px, peso **Light 300** o **Regular 400**, con buena separación entre líneas.
* **Cifras Telemétricas:** Siempre con ancho de número fijo (**`tabular-nums`**) para que la velocidad, las RPM o el delta de tiempo no se muevan hacia los costados mientras cambian a alta velocidad.

---

## 2. Estructura Visual de la Landing Page

La página de inicio guía al piloto paso a paso desde el problema que tiene en su simulador hasta la solución en pista:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [FRANJA TRICOLOR M SUPERIOR - 4px] (#0066b1 · #1c69d4 · #e22718)       │
├────────────────────────────────────────────────────────────────────────┤
│ 1. BARRA SUPERIOR: APEXLINK + Menú de Carrera + [ PROBAR TELEMETRÍA ] │
├────────────────────────────────────────────────────────────────────────┤
│ 2. HERO:                                                               │
│    - Rótulo: "INSTRUMENTAL DE CARRERA EN VIVO PARA ASSETTO CORSA"      │
│    - Titular: "UN VOLANTE DE COMPETICIÓN EN LA PANTALLA DE TU TELÉFONO" │
│    - Explicación: Delta en vivo, luces de corte, gomas y telemetría     │
│    - Botones: [ ENTRAR A PISTA (DEMO) ]   [ VER MURO DE TELEMETRÍA ]   │
├────────────────────────────────────────────────────────────────────────┤
│ 3. MÉTRICAS CLAVE: Cero lag por USB · Pantalla OLED · Sin gastar plata │
├────────────────────────────────────────────────────────────────────────┤
│ 4. MANIFIESTO: "Dejá de adivinar dónde pierdes tiempo. Medilo."       │
├────────────────────────────────────────────────────────────────────────┤
│ 5. COMPARATIVA: Volantes caros ($1.200 USD) vs Tu Teléfono con ApexLink│
├────────────────────────────────────────────────────────────────────────┤
│ 6. LOS TRES MOMENTOS:                                                  │
│    [EN EL VOLANTE (DDU)] │ [GESTIÓN DEL AUTO] │ [EN BOXES (TELEMETRÍA)]│
├────────────────────────────────────────────────────────────────────────┤
│ 7. MONZA GP: Dónde frenar en Rettifilo y cómo ver tus décimas ganadas  │
├────────────────────────────────────────────────────────────────────────┤
│ 8. LLAMADO A PISTA: Conectá el cable USB, abrí el simulador y salí     │
├────────────────────────────────────────────────────────────────────────┤
│ 9. PIE DE PÁGINA: Compatibilidad con volantes y simuladores            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Textos Definitivos Sección por Sección (Copy Deck)

Todos los textos están redactados en el tono de un piloto de simracing experimentado que habla con otro piloto: directo, honesto y enfocado en el rendimiento en pista.

---

### 3.1. Barra Superior de Cabina (`TopNav`)

* **Logotipo:** Emblema M oblicuo de 3 franjas (`MSlantedBadge`) junto a `APEXLINK` en mayúsculas de 20px.
* **Enlaces de Navegación:**
  1. `EN EL VOLANTE` (desplaza hasta la explicación del display móvil)
  2. `EN BOXES` (desplaza hasta la explicación del muro de telemetría)
  3. `COMPARATIVA` (desplaza hasta la tabla frente a volantes comerciales)
  4. `CIRCUITOS` (desplaza al análisis de Monza)
* **Botón de Acción Directa:**
  - Texto: `PROBAR TELEMETRÍA`
  - Icono: `Zap` (Rayo).
  - Estilo: Rectangular `rounded-none`, fondo Rojo M `#e22718`, texto blanco en mayúsculas, tracking de 1.5px. Al hacer clic abre el entorno de boxes listo para probar (`/login`).

---

### 3.2. Sección Principal de Entrada (`HeroSection`)

#### Rótulo Superior (Baliza de Estado):
```
[ ● ENLACE DIRECTO LISTO ] INSTRUMENTAL DE CARRERA EN VIVO PARA ASSETTO CORSA
```

#### Titular Principal (H1 Display):
```
UN VOLANTE DE COMPETICIÓN
EN LA PANTALLA DE TU TELÉFONO
```

#### Bajada:
```
Montá tu smartphone en el aro de tu volante y tené la instrumentación de un monoplaza de Fórmula 1 o GT3 al instante. Mirá tu delta de tiempo en cada curva, clavá las marchas en el punto exacto con las luces de corte y cuidá la temperatura de tus gomas sin gastar fortunas en equipamiento privativo.
```

#### Botonera de Acción:
* **Botón Principal:**
  - Texto: `ENTRAR A PISTA (MODO DEMO)`
  - Icono: `Play`
  - Estilo: Altura 52px, esquinas a 0px (`rounded-none`), fondo Rojo M `#e22718`, texto blanco en mayúsculas con espaciado amplio, brillo sutil en rojo. Lleva directo al simulador activo.
* **Botón Secundario:**
  - Texto: `VER MURO DE TELEMETRÍA EN BOXES`
  - Icono: `Gauge`
  - Estilo: Altura 52px, esquinas a 0px, fondo negro `#141414`, borde fino `#3c3c3c`, texto blanco. Abre el panel de análisis de vueltas.

---

### 3.3. Barra de Métricas Rápidas de Carrera (`TrackSpecBar`)

Cuatro especificaciones esenciales para el piloto que va a montar el sistema en su puesto de conducción:

| 01 | 02 | 03 | 04 |
| :--- | :--- | :--- | :--- |
| **0 MS DE RETARDO** | **PANTALLA OLED PURA** | **CERO CORTES WI-FI** | **$0 EN NUEVOS VOLANTES** |
| Las luces de cambio se encienden al mismo tiempo que ruge el motor | Fondo negro que no te encandila en carreras nocturnas | Conexión directa por cable USB: sin lag ni microcortes | Usás el teléfono que ya tenés guardado en el cajón |

---

### 3.4. Manifiesto del Piloto: Medir vs Adivinar (`RacerManifesto`)

Bloque sobrio con una franja lateral izquierda en Rojo M `#e22718`:

#### Rótulo:
```
EL SECRETO DE LOS PILOTOS RÁPIDOS
```

#### Titular:
```
DEJÁ DE ADIVINAR DÓNDE PIERDES TIEMPO. MEDILO.
```

#### Texto:
```
Bajar medio segundo en una pista no se logra dando cien vueltas a ciegas esperando que el reloj baje por arte de magia. Los pilotos que pelean la punta saben exactamente qué pasa debajo del chasis: si en la frenada de la curva 1 están parándose sobre el pedal 10 metros antes, si están sobrecalentando el neumático delantero en el apoyo o si están acelerando con las ruedas traseras todavía descargadas.

ApexLink pone esa información en dos lugares: en tu volante mientras estás al volante de la máquina, y en tu navegador apenas entrás a boxes para comparar tu vuelta rápida contra tu referencia curva por curva.
```

---

### 3.5. Tabla Comparativa de Volantes y Costos (`HardwareComparison`)

Contraste directo entre comprar un volante comercial dedicado o usar ApexLink:

#### Titular:
```
COMPARATIVA FRENTE A VOLANTES DEDICADOS
```

#### Bajada:
```
Las pantallas de carreras profesionales ya están en tu bolsillo. No necesitás cambiar de base ni pagar de más.
```

#### Tabla de Contraste:

| Lo que necesitás en pista | Volantes comerciales dedicados (MoTeC, Fanatec, Cube Controls) | Tu teléfono con ApexLink |
| :--- | :--- | :--- |
| **Costo para tu bolsillo** | **$700 a $2.000 USD** por un volante con pantalla incorporada | **$0 USD**. Reutilizás cualquier smartphone con Android |
| **Nitidez y contraste** | Pantallas LCD opacas con marcos gruesos y fugas de luz | **Pantallas AMOLED / OLED** con contraste infinito y negros reales |
| **Respuesta de las luces de corte** | Retrasos notables si el software del fabricante es pesado | **Instantánea**. Las luces acompañan el corte del limitador |
| **Conexión en carrera** | Muchos requieren Wi-Fi, propensos a lag si hay saturación | **Cable USB directo**. Cero interferencias y carga continua |
| **Temperatura de cubiertas** | Te muestran presiones básicas o números estáticos | **Mapa térmico en tiempo real**: ves si la goma está fría, óptima o hirviendo |
| **Análisis al terminar la tanda** | Tenés que exportar archivos raros y abrirlos en programas viejos | **Entrás a tu navegador web**, elegís dos vueltas y ves el delta en el mapa |
| **Si cambiás de base de volante** | Si cambiás de marca de volante perdés la pantalla | **Independiente de la base**: sirve en Logitech, Thrustmaster o Direct Drive |

---

### 3.6. Los Tres Momentos de la Carrera (`RacerExperienceGrid`)

Tres tarjetas de esquinas rectas (`rounded-none`) en fondo `#0d0d0d` que explican cómo vivís la carrera con ApexLink:

#### Tarjeta 1: En el volante (Mientras estás manejando)
* **Rótulo:** `EN CABINA · PANTALLA DDU`
* **Titular:** `TODA LA INFORMACIÓN QUE NECESITÁS POR EL RABILLO DEL OJO`
* **Detalle para el piloto:**
  - **Marcha colosal en el centro:** Para saber en qué cambio estás sin desviar la mirada de la pista.
  - **15 luces de cambio progresivas:** 5 verdes, 5 rojas y 5 azules que te marcan el punto exacto de paso de marcha sin mirar el número de RPM.
  - **Barra de delta en vivo:** En verde si venís ganando tiempo contra tu mejor marca, en rojo si venís perdiendo centésimas.
  - **Pantalla blindada sin toques accidentales:** Todos los números son indicadores de lectura fija. Si tocás la pantalla sin querer mientras doblás, nada se desajusta.

#### Tarjeta 2: En el auto (Cuidando la máquina vuelta a vuelta)
* **Rótulo:** `CHASIS Y NEUMÁTICOS`
* **Titular:** `SABÉ CUÁNDO APURAR EL RITMO Y CUÁNDO CUIDAR EL AUTO`
* **Detalle para el piloto:**
  - **Colores térmicos en las 4 ruedas:** Azul si las cubiertas están frías tras salir de boxes, verde cuando están en ventana óptima de agarre, y rojo intermitente si las estás cocinando por derrapar de más.
  - **Presión exacta en PSI por rueda:** Controlá la subida de presión con el calor del asfalto.
  - **Litros de nafta por vuelta:** Monitoreá el consumo exacto y cuántas vueltas de autonomía te quedan antes de entrar a cargar.
  - **Testigo de alerón DRS y limitador de boxes:** Testigos grandes y claros para no exceder la velocidad en el pitlane.

#### Tarjeta 3: En boxes (Apenas bajás del simulador)
* **Rótulo:** `POST-SESIÓN · PLATAFORMA WEB`
* **Titular:** `ENCONTRÁ DÓNDE PERDISTE LAS DÉCIMAS FRENTE A TU RIVAL`
* **Detalle para el piloto:**
  - **Mapa 2D interactivo del circuito:** Mirá tu trazada completa con las zonas de frenada pintadas en rojo y las de aceleración en verde.
  - **Superposición de tus dos mejores vueltas:** Poné tu récord de vuelta contra la tanda anterior y mirá exactamente en qué curva soltaste el freno antes o en cuál aceleraste tarde.
  - **Inspector de curvas:** Tocá cualquier curva del trazado y mirá a qué velocidad entraste, cuál fue tu punto de cuerda y a cuántos km/h saliste hacia la recta.

---

### 3.7. Análisis en Pista: La Telemetría en Monza GP (`MonzaTrackShowcase`)

Un bloque gráfico que muestra un caso concreto en el templo de la velocidad italiano (5.793 metros):

#### Rótulo:
```
CIRCUITO DE PRUEBA: AUTODROMO NAZIONALE MONZA
```

#### Titular:
```
CÓMO LEER TUS FRENADAS EN EL TEMPLO DE LA VELOCIDAD
```

#### Puntos Clave que Ves en el Análisis:
1. **Frenada de la Variante del Rettifilo (Curva 1):**
   - Venís en 7ma marcha a más de 330 km/h en la recta principal.
   - Tenés que clavar el pedal de freno para bajar a 75 km/h en apenas 120 metros.
   - En la telemetría ves si estás frenando en el cartel de 150 metros o si podés estirar la frenada al cartel de 100 sin bloquear las gomas.
2. **Apoyo en Curva Biassono (Curva Grande):**
   - Un curvón largo a fondo a 290 km/h donde el neumático izquierdo soporta toda la carga lateral del chasis.
   - La telemetría te avisa si la temperatura de la cubierta sube de los 105°C para que no la destruyas en carrera larga.
3. **Salida de la Parabólica hacia la recta:**
   - La curva que define el tiempo de la vuelta.
   - Mirás en el gráfico de pedales si estás abriendo el acelerador de forma progresiva o si tuviste que soltar por subviraje.

---

### 3.8. Llamado a Pista Pre-Footer (`CtaBand`)

#### Titular:
```
MONTÁ TU PANTALLA Y SALÍ A PISTA
```

#### Bajada:
```
Enchufá tu teléfono a la computadora por cable USB, abrí el simulador y experimentá la telemetría en tiempo real desde la primera curva.
```

#### Botón de Acción Principal:
```
[ PROBAR EN MODO DEMOSTRACIÓN AHORA ]
```

---

### 3.9. Pie de Página (`Footer`)

* **Logotipo:** `APEXLINK` en blanco con franja M tricolor.
* **Descripción breve:** `Instrumental de cabina en tiempo real y telemetría analítica de boxes para pilotos de simracing.`
* **Compatibilidad de Volantes:** `Compatible con volantes Logitech (G29, G923, Pro), Thrustmaster (T300, T-GT, TS-PC), Fanatec (CSL, DD Pro, ClubSport) y bases Direct Drive (Moza, Simagic, Asetek, Simucube).`
* **Compatibilidad de Simuladores:** `Diseñado para Assetto Corsa. Próximamente en iRacing, Assetto Corsa Competizione y F1.`
* **Nota Aclaratoria:** `ApexLink es una plataforma independiente desarrollada para la comunidad de simracing. No tiene afiliación comercial con Kunos Simulazioni, MoTeC ni fabricantes de volantes.`

---

## 4. Componentes Listos para Implementar en Tailwind CSS

Plantillas exactas de código con estilos BMW M (`rounded-none`, Rojo M `#e22718`, negro profundo):

### 4.1. Botón Principal de Salida a Pista
```tsx
<button className="h-[52px] px-8 rounded-none bg-[#e22718] hover:bg-[#c91f12] active:scale-[0.99] text-white font-bold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all border border-[#e22718] shadow-[0_0_25px_rgba(226,39,24,0.35)] cursor-pointer">
  <Play className="w-4 h-4 fill-current" />
  ENTRAR A PISTA (MODO DEMO)
</button>
```

### 4.2. Botón Secundario de Entorno de Boxes
```tsx
<button className="h-[52px] px-8 rounded-none bg-[#141414] hover:bg-[#1f1f1f] active:scale-[0.99] text-white font-bold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all border border-[#3c3c3c] hover:border-[#e22718] cursor-pointer">
  <Gauge className="w-4 h-4 text-[#bbbbbb]" />
  VER MURO DE TELEMETRÍA EN BOXES
</button>
```

### 4.3. Tarjeta de Instrumental / Característica
```tsx
<div className="rounded-none bg-[#0d0d0d] border border-[#262626] hover:border-[#3c3c3c] p-8 flex flex-col justify-between transition-colors relative overflow-hidden group">
  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e22718] opacity-0 group-hover:opacity-100 transition-opacity" />
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-none bg-[#141414] border border-[#3c3c3c] flex items-center justify-center text-white">
      <Gauge className="w-5 h-5 text-[#e22718]" />
    </div>
    <span className="text-[11px] font-bold tracking-[0.15em] text-[#7e7e7e] uppercase">
      EN CABINA · PANTALLA DDU
    </span>
  </div>
  <h3 className="text-xl font-bold tracking-tight text-white uppercase mb-3">
    TODA LA INFORMACIÓN QUE NECESITÁS POR EL RABILLO DEL OJO
  </h3>
  <p className="text-sm font-light text-[#bbbbbb] leading-relaxed">
    Marcha colosal en el centro, 15 luces de cambio progresivas para clavar el paso de marcha y barra de delta en vivo para saber si venís mejorando tu récord.
  </p>
</div>
```

### 4.4. Franja Estructural M Tricolor (4px)
```tsx
<div className="w-full h-1 flex shrink-0">
  <div className="flex-1 bg-[#0066b1]" />
  <div className="flex-1 bg-[#1c69d4]" />
  <div className="flex-1 bg-[#e22718]" />
</div>
```

---

## 5. Verificación Anti-Slop: Lenguaje de Piloto a Piloto

Se certifica que el nuevo documento cumple con las reglas de redacción humana directa:

| Regla | Estado | Cómo se cumple en el nuevo texto |
| :--- | :---: | :--- |
| **Cero términos técnicos de código** | ✅ **100% PURGADO** | Se eliminaron completamente: *C#, .NET, Win32, MMF, Memory-Mapped, SQLite, WAL, SeqLock, Next.js, React, APIs, DTOs, Kestrel*. |
| **Cero lenguaje académico o de jurado** | ✅ **100% PURGADO** | Se eliminaron todas las menciones a: *FAPPE 2026, jurado, docentes, cátedra, proyecto integrador, SDD, evaluación*. |
| **Palabras prohibidas de marketing eliminadas** | ✅ **LIMPIO** | Cero palabras cliché: *desata tu potencial, revolucionario, cutting-edge, game changer, robusto, agilizar, empoderar*. |
| **Términos reales de SimRacing aplicados** | ✅ **AUTÉNTICO** | Habla de *delta de vuelta, luces de corte, punto de frenada, sobrecalentamiento de gomas, ápice, subviraje, Monza Rettifilo, parada en boxes*. |
| **Siluetas mecánicas BMW M respetadas** | ✅ **EXACTO** | Siluetas a 0px (`rounded-none`), fondo `#000000` y acento protagónico en Rojo M `#e22718`. |

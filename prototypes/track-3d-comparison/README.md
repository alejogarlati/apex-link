# ApexLink // Prototipo Comparativo: Visualización de Telemetría 2D / 3D

Este prototipo demuestra en vivo la integración entre la telemetría de **Assetto Corsa**, el renderizado 2D de retransmisión oficial y el modelo 3D WebGL con elevaciones reales, utilizando datos extraídos directamente de las variantes oficiales solicitadas:

1. 🏎️ **`imola_f1_2025`** — *Autodromo Enzo e Dino Ferrari*
2. 🐂 **`ks_red_bull_ring` (Layout GP)** — *Red Bull Ring Spielberg*
3. ⚡ **`monza_f1_2025`** — *Autodromo Nazionale Monza*

---

## 🚀 Cómo Ejecutar el Prototipo

El servidor de desarrollo Vite se encuentra corriendo en:
👉 **[http://localhost:5173/](http://localhost:5173/)**

Para levantarlo manualmente si hiciera falta:
```bash
cd prototypes/track-3d-comparison
npm run dev
```

---

## 🏁 Variantes y Circuitos Incluidos

### 1. Imola F1 2025 (`tracks/fn_imola/imola_f1_2025`)
* **Mapa 2D:** `imola_map.png` oficial calibrado con `data/map.ini` ($WIDTH=1847$, $HEIGHT=1035$, $X_{\text{offset}}=952.928$, $Z_{\text{offset}}=533.051$).
* **Spline 3D:** 1.551 puntos 3D extraídos de `ai/fast_lane.ai` (4.867 metros).
* **Curvas:** *Variante Tamburello (T2-T4)*, *Variante Villeneuve (T5-T6)*, *Curva Tosa (T7)*, *Curva Piratella (T9)*, *Acque Minerali (T11-T13)*, *Variante Alta (T14-T15)*, *Curva Rivazza (T17-T18)*.
* **DRS:** Zona 1 en la recta de meta.

### 2. Red Bull Ring GP (`tracks/ks_red_bull_ring/layout_gp`)
* **Mapa 2D:** `rbr_map.png` oficial calibrado con `data/map.ini` ($WIDTH=1296.6$, $HEIGHT=822.72$, $X_{\text{offset}}=620.875$, $Z_{\text{offset}}=401.055$).
* **Spline 3D:** 1.406 puntos 3D extraídos de `ai/fast_lane.ai` (4.285 metros).
* **Curvas Oficiales (`sections.ini`):** *Castrol Edge (T1)*, *Remus (T3)*, *Rauch (T4)*, *Pirelli (T6)*, *Würth (T7)*, *Rindt (T9)*, *Red Bull Mobile (T10)*.
* **DRS:** 2 zonas DRS activas (Recta principal y recta de subida a Remus).

### 3. Monza F1 2025 (`tracks/monza/monza_f1_2025`)
* **Mapa 2D:** `monza_map.png` oficial calibrado con `data/map.ini` ($WIDTH=927.422$, $HEIGHT=1575.82$, $SCALE=1.4$, $X_{\text{offset}}=232.866$, $Z_{\text{offset}}=1297.7$).
* **Spline 3D:** 1.875 puntos 3D extraídos de `ai/fast_lane.ai` (5.757 metros).
* **Curvas Oficiales (`sections.ini`):** *Prima Variante*, *Curva Biassono*, *Variante della Roggia*, *Prima y Seconda Curva di Lesmo*, *Curva del Serraglio*, *Variante Ascari*, *Curva Parabolica*.
* **DRS:** 2 zonas DRS activas.

---

## 🎛️ Características Interactivas

* **Selector de Circuito:** Cambiá de circuito en tiempo real desde el menú superior.
* **Modo Dual en Canvas 2D:** Alterná entre la imagen oficial `map.png` con la trazada sobre el asfalto o la proyección isométrica matemática pura.
* **Modo Three.js 3D WebGL:** Cámara ortográfica isométrica 45°, vista cenital plana o perfil lateral de altimetría.
* **HUD de Telemetría:** Tacómetro de RPM hasta 12.400, velocidades de hasta 345 km/h, marchas, pedales en vivo, altimetría en metros y detección de curvas en tiempo real.

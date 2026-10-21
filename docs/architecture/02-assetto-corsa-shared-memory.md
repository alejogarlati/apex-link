# 🔬 Investigación Técnica: Assetto Corsa Shared Memory

Assetto Corsa implementa una arquitectura nativa de **Memoria Compartida (Shared Memory)** para comunicar la telemetría en tiempo real a aplicaciones externas en el sistema operativo Windows.

---

## 1. Funcionamiento del Mapped Memory File (MMF) en Windows

Assetto Corsa crea tres objetos de mapeo de archivos en la memoria de Windows (usando la API Win32 `OpenFileMappingW` o `CreateFileMappingW` con el namespace `Local\`):

1. `Local\acpmf_physics`
2. `Local\acpmf_graphic`
3. `Local\acpmf_static`

Cualquier proceso en la misma máquina con permisos estándar de usuario puede abrir estos objetos de memoria compartida en modo sólo lectura (`FILE_MAP_READ`), realizar un casting de puntero a la estructura C/C++ y leer los valores directamente con costo de CPU y latencia prácticamente cero (<0.01 ms).

---

## 2. Detalle de las Estructuras de Datos

### 2.1. `acpmf_physics` (Frecuencia: ~60 Hz - 100 Hz)
Contiene las variables dinámicas del vehículo calculadas por el motor de físicas de Kunos Simulazioni.

| Campo | Tipo C++ | Descripción / Unidad | Relevancia para el Proyecto |
| :--- | :--- | :--- | :--- |
| `packetId` | `int` | Contador secuencial de paquetes. | Detección de pérdida de frames. |
| `gas` | `float` | Posición del acelerador (0.0 a 1.0). | Gráficas de telemetría y live bar. |
| `brake` | `float` | Posición del freno (0.0 a 1.0). | Gráficas de telemetría y live bar. |
| `speedKmh` | `float` | Velocidad actual del auto en km/h. | Display F1 y análisis de velocidad punta. |
| `rpms` | `int` | Revoluciones por minuto actuales del motor. | Rev LEDs del volante F1. |
| `gear` | `int` | Marcha actual (`0` = Reversa, `1` = Neutral, `2` = 1ra marcha...). | Indicador de marcha central. |
| `steerAngle` | `float` | Ángulo de giro de las ruedas delanteras. | Análisis de sobreviraje/subviraje. |
| `tyrePressure[4]` | `float[4]` | Presión de cada neumático (FL, FR, RL, RR) en PSI. | Visualizador de 4 neumáticos en dashboard. |
| `tyreCoreTemperature[4]`| `float[4]` | Temperatura interna de cada neumático en °C. | Alertas térmicas de degradación. |
| `tyreWear[4]` | `float[4]` | Desgaste relativo del neumático (0.0 a 100.0). | Estrategia de carrera. |
| `gforce[3]` | `float[3]` | Fuerzas G instantáneas (X = Lateral, Y = Longitudinal, Z = Vertical). | Gráfico de G-Force / Fricción de curva. |
| `carCoordinates[3]` | `float[3]` | Coordenadas 3D del coche en el mundo virtual (X, Y, Z). | **Fundamental para dibujar el trazado y mapa.** |

---

### 2.2. `acpmf_graphic` (Frecuencia: ~10 Hz - 30 Hz)
Contiene datos de interfaz de usuario, cronometraje oficial y estado de carrera.

| Campo | Tipo C++ | Descripción | Relevancia para el Proyecto |
| :--- | :--- | :--- | :--- |
| `status` | `AC_STATUS` | `0` = Off, `1` = Replay, `2` = Live, `3` = Pause. | Gestión de estado del relay. |
| `currentTime` | `wchar_t[15]` | Tiempo de la vuelta actual (`01:23:456`). | Display del volante y live. |
| `lastTime` | `wchar_t[15]` | Tiempo de la última vuelta completada. | Registro de sesión. |
| `bestTime` | `wchar_t[15]` | Mejor tiempo de la sesión. | Comparador delta de vuelta. |
| `split` | `wchar_t[15]` | Tiempo del último sector o delta split. | Sector del display F1. |
| `completedLaps` | `int` | Cantidad de vueltas completadas. | Trigger para guardar la vuelta en DB. |
| `position` | `int` | Posición actual en la carrera (P1, P2, etc.). | Indicador de posición en display. |
| `flag` | `AC_FLAG_TYPE` | Ninguna, Verde, Azul, Amarilla, Negra, Cuadros. | Cambio dinámico de color en el display móvil. |
| `iCurrentTime` | `int` | Tiempo actual en milisegundos. | Cálculos precisos de delta. |
| `normalizedCarPosition`| `float` | Progreso de la vuelta (0.0 a 1.0). | Barra de progreso en el circuito. |

---

### 2.3. `acpmf_static` (Frecuencia: Lectura al inicio de sesión)
Contiene metadatos invariables del vehículo y del circuito.

| Campo | Tipo C++ | Descripción |
| :--- | :--- | :--- |
| `carModel` | `wchar_t[33]` | Nombre del coche (ej: `ks_ferrari_sf70h`, `tatuusfa01`). |
| `track` | `wchar_t[33]` | Nombre de la pista (ej: `monza`, `spa`, `silverstone`). |
| `trackConfiguration`| `wchar_t[33]` | Configuración o variante del circuito. |
| `maxRpm` | `int` | Límite máximo de corte de RPM (esencial para calibrar los Shift LEDs). |
| `maxFuel` | `float` | Capacidad máxima del tanque de combustible. |
| `sectorCount` | `int` | Cantidad de sectores que componen el circuito. |

---

## 3. Implementación del Lector en Node.js vs Python

### Opción A: Node.js (Recomendada para el stack web)
- Paquete: `assetto-corsa-shared-memory-reader` o mediante binding Win32 directo usando librerías de buffer o FFI.
- Ventaja: Se integra directamente con el servidor WebSocket en el mismo proceso de Node.js sin necesidad de pasos intermedios.

### Opción B: Script en Python
- Librería: `mmap` y módulo `struct` (estándar de Python).
- Ejemplo conceptual de lectura directa:
```python
import mmap
import struct

# Abre la memoria compartida de físicas
shm = mmap.mmap(-1, 0x1000, "Local\\acpmf_physics", access=mmap.ACCESS_READ)
# Lectura de velocidad (offset 28 float), rpms (offset 32 int), etc.
speed, rpms, gear = struct.unpack_from("fii", shm, 28)
```
- Ventaja: Extremadamente simple y robusto en caso de que se prefiera aislar la captura en un script Python de 80 líneas que emita JSON por WebSocket.

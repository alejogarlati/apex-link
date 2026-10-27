# 📱 Dash Mobile — F1 Steering Wheel Display (ApexLink)

Aplicación web orientada a dispositivos móviles (PWA) de alto rendimiento (60 FPS) que replica el display de instrumentos de un volante de Fórmula 1 / GT3 contemporáneo.

Diseñada para montarse físicamente sobre el volante de simracing y conectarse mediante **cable USB** a la PC del simulador sin latencia apreciable (<3ms).

---

## 🏎️ Características Visuales y Funcionales

* **Rev LEDs (Shift Lights):** 15 indicadores LED adaptativos que escalan desde el 70% hasta el 96% de las RPM máximas (`maxRpm`) con alerta destellante en azul en el momento óptimo de subir de marcha.
* **Gear & Speed Core:** Indicador gigante de marcha central (`R`, `N`, `1` a `8`) y velocímetro digital en km/h.
* **Live Delta Tracker:** Cálculo instantáneo de ventaja o desventaja respecto a la mejor vuelta en verde (`-0.342s`) o rojo (`+0.120s`).
* **Matrix Térmica de Neumáticos (4 Ruedas):** Muestra presión en PSI y temperatura del núcleo de goma con escala cromática (Azul frío, Verde óptimo, Amarillo advertencia, Rojo sobrecalentamiento).
* **Pedales Dinámicos:** Barras de porcentaje de aplicación de acelerador (*Throttle*) y freno (*Brake*).
* **Alertas en Pista & DRS:** Indicador de banderas de carrera (Verde, Amarilla) y estado de DRS disponible/activo.
* **WakeLock & Pantalla Completa:** Bloqueo de suspensión de pantalla para evitar que el teléfono se apague mientras se conduce.

---

## 🚀 Cómo Ejecutar en Desarrollo

### 1. Iniciar el Servidor de Telemetría (Mock o Real)
En una terminal:
```bash
cd server
pnpm install
pnpm mock
```

### 2. Iniciar el Display Móvil
En otra terminal:
```bash
cd dash-mobile
pnpm install
pnpm dev
```
La aplicación quedará disponible en `http://localhost:5173`.

---

## 🔌 Conexión al Teléfono Android vía USB (Cero Latencia)

1. Conecta el teléfono por cable USB a la PC con la opción **Depuración por USB** activada.
2. En la terminal de la PC ejecuta:
   ```bash
   adb reverse tcp:5173 tcp:5173
   adb reverse tcp:8080 tcp:8080
   ```
3. Abre Google Chrome en tu teléfono y navega a:
   ```
   http://localhost:5173
   ```
4. Presiona el botón de **Pantalla Completa** en la esquina superior derecha y coloca el teléfono en el volante. ¡Listo!

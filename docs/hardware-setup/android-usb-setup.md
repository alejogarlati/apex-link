# 📱 Conexión Android por Cable USB (Ultra Baja Latencia)

En un evento como la **FAPPE**, las redes WiFi suelen estar colapsadas por teléfonos del público, routers saturados o aislamiento de clientes (donde dos dispositivos conectados a la misma red no pueden hablar entre sí).

Para garantizar **0% de pérdida de paquetes y latencia menor a 3 milisegundos**, la conexión se realiza por **cable USB**.

---

## 1. El Mecanismo: `adb reverse`

El comando `adb reverse` de las herramientas de Android (Android Debug Bridge) permite redirigir conexiones de red desde el dispositivo móvil hacia la computadora anfitriona.

```
[ Teléfono Android ]                       [ PC Simulador ]
Navegador / App                               Relay Core
  ws://localhost:8080   ===(Cable USB)===>   ws://localhost:8080
```

Cuando la app en el teléfono solicita conectarse a `localhost:8080`, el daemon de ADB en el teléfono reenvía esos paquetes directamente a través del cable USB al puerto `8080` de la PC.

---

## 2. Guía Paso a Paso para el Setup del Teléfono

### 2.1. Habilitar Modo Desarrollador en Android
1. Ir a **Ajustes > Acerca del teléfono**.
2. Presionar **7 veces** consecutivas sobre **"Número de compilación"** hasta que el sistema indique: *"¡Ya eres desarrollador!"*.
3. Regresar a **Ajustes > Sistema / Ajustes adicionales > Opciones para desarrolladores**.
4. Activar la opción **"Depuración por USB" (USB Debugging)**.

### 2.2. Conexión a la PC
1. Conectar el teléfono a la PC mediante un cable USB (preferiblemente USB 3.0 / Tipo C de buena calidad).
2. En la pantalla del teléfono aparecerá el aviso: *"¿Permitir depuración por USB desde esta computadora?"*.
3. Marcar **"Permitir siempre desde este equipo"** y presionar **Aceptar**.

---

## 3. Scripts de Automatización (Un Clic)

Para que cualquiera en el equipo (o durante la presentación) pueda iniciar la conexión sin recordar comandos de consola, se crea un script en PowerShell / Bash:

### Script PowerShell: `start-usb-display.ps1`
```powershell
# Verifica que ADB esté disponible
if (-not (Get-Command adb -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] ADB no está instalado o no está en el PATH." -ForegroundColor Red
    Write-Host "Descargue Platform-Tools de Android e incorpórelo al PATH." -ForegroundColor Yellow
    exit 1
}

Write-Host "Buscando dispositivos Android conectados..." -ForegroundColor Cyan
$devices = adb devices | Select-String "device$"

if (-not $devices) {
    Write-Host "[ALERTA] No se detectó ningún teléfono conectado o falta autorizar la depuración." -ForegroundColor Red
    exit 1
}

Write-Host "Configurando reenvío de puerto USB con adb reverse..." -ForegroundColor Green
adb reverse tcp:8080 tcp:8080
adb reverse tcp:3000 tcp:3000

Write-Host "¡Listo! Abriendo el display de volante en Chrome Android..." -ForegroundColor Cyan
adb shell am start -a android.intent.action.VIEW -d "http://localhost:8080/dash"
```

---

## 4. Opciones de Pantalla Completa y "Keep Awake"

Para que el teléfono funcione como un volante profesional de F1 sin interrupciones:
1. **Evitar que la pantalla se apague:**
   - En Chrome/Web API se utiliza `navigator.wakeLock.request('screen')` para impedir que el display se suspenda durante la carrera.
2. **Modo Kiosco / Pantalla Completa:**
   - La PWA cuenta con un botón en pantalla o un detector de orientación apaisada (Landscape) para llamar a `document.documentElement.requestFullscreen()`.
   - Se ocultan la barra de estado y los botones de navegación de Android.

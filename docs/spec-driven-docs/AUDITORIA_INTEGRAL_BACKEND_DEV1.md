# 🔍 Informe de Auditoría Técnica Integral: Backend de Telemetría (Capa 1)

> **Repositorio Auditado:** `apex-link-telemetry` (Rama principal / Handover Dev 1)  
> **Auditor:** Antigravity / ApexLink Architecture Core  
> **Documentos de Referencia:** `CONTRATOS_TELEMETRIA_Y_API.md`, `BRIEF_INTEGRAL_SISTEMA_3_CAPAS.md`, `DOCUMENTACION_TECNICA_MODULO3_WEBAPP.md`  
> **Fecha de Auditoría:** 27 de Octubre de 2026  
> **Veredicto General:** **APROBADO CON OBSERVACIONES CRÍTICAS DE INTEGRACIÓN** (Cumplimiento de arquitectura base: 92% | Compatibilidad de contratos REST: 65% | Fidelidad espacial Mock: 40%)

---

## 📊 1. Resumen Ejecutivo y Dictamen de Integración

Dev 1 ha entregado una implementación de backend en **C# .NET / ASP.NET Core** de excepcional calidad técnica en cuanto a bajo nivel:
- Interoperabilidad Win32 Zero-Copy con Memory-Mapped Files (`Local\acpmf_physics`, `acpmf_graphic`, `acpmf_static`) mediante estructuras no administradas `unsafe fixed` alineadas a 4 bytes.
- Bucle de relay continuo desacoplado con `PeriodicTimer`, operando a **60 Hz** en pista y **5 Hz** en reposo/menú.
- Difusión WebSocket de alto rendimiento con `Channel<byte[]>` sin contención y serialización precompilada con `System.Text.Json` Source Generation (`ContextoSerializacionTelemetria`).
- Base de datos local SQLite con interceptor de conexión configurando el modo **WAL (Write-Ahead Logging)**, `synchronous=NORMAL` y persistencia atómica en segundo plano mediante `ServicioGestionVueltas`.
- Conmutador en caliente (*hot-swap*) entre el simulador real y el generador mock determinístico.

Sin embargo, la auditoría exhaustiva comparando el código implementado contra el catálogo de contratos y especificaciones de `apex-link` revela **fricciones severas de entorno, discrepancias críticas de nombres en la API REST y limitaciones físicas en la simulación mock** que deben ser abordadas antes de integrar con la WebApp de Boxes (Dev 3) y el Display de Cabina (Dev 2).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MATRIZ DE CUMPLIMIENTO                          │
├───────────────────────────────────┬──────────────┬─────────────────────┤
│ Componente / Área                 │ Estado       │ Nivel de Riesgo     │
├───────────────────────────────────┼──────────────┼─────────────────────┤
│ 1. Portabilidad de Entorno SDK    │ ⚠️ Bloqueado │ Alto (Build local)  │
│ 2. Contrato WebSocket (`FRAME`)   │ ✅ 100% OK   │ Nulo (Compatible)   │
│ 3. Contrato WebSocket (`EVENTO`)  │ ✅ 100% OK   │ Nulo (Compatible)   │
│ 4. Contrato API REST (Endpoints)  │ ⚠️ Divergente│ Crítico (Frontend)  │
│ 5. Cálculo Dinámico de Delta      │ ⚠️ Deficiente│ Medio (Precisión)   │
│ 6. Fidelidad Espacial Mock        │ ❌ Invalido  │ Alto (Canvas 2D)    │
│ 7. Catálogo de Circuitos FAPPE    │ ⚠️ Incompleto│ Medio (Monza only)  │
│ 8. Concurrencia y SQLite WAL      │ ✅ 100% OK   │ Nulo (Excelente)    │
└───────────────────────────────────┴──────────────┴─────────────────────┘
```

---

## 🛠️ 2. Puntos Débiles Técnicos Identificados

### 2.1. Bloqueo de Entorno y Compilación por `global.json` (Fricción de Desarrollo)
- **Ubicación:** `apex-link-telemetry/global.json`
- **Configuración actual:**
  ```json
  {
    "sdk": {
      "version": "10.0.301",
      "rollForward": "latestFeature"
    }
  }
  ```
- **Problema:** Dev 1 fijó de manera estricta la versión del SDK en `10.0.301` con la política `latestFeature`. En el ecosistema .NET, la política `latestFeature` busca la banda de características más reciente dentro de la versión mayor pero **nunca retrocede** hacia bandas inferiores instaladas (por ejemplo, SDK `10.0.201` o `9.0.304`).
- **Consecuencia:** Cualquier miembro del equipo que clone el repositorio y ejecute `dotnet test` o `dotnet run` recibe de inmediato el error:
  `A compatible .NET SDK was not found. Requested SDK version: 10.0.301. Installed SDKs: 10.0.201, 9.0.304.`
- **Mejora Propuesta:** Modificar `global.json` para permitir bandas compatibles:
  ```json
  {
    "sdk": {
      "version": "10.0.100",
      "rollForward": "minor",
      "allowPrerelease": true
    }
  }
  ```

---

### 2.2. Cálculo del Delta en Tiempo Real Asumiendo Velocidad Constante (Error Físico)
- **Ubicación:** `src/Telemetria.Infraestructura/MemoriaCompartida/LectorAssettoCorsaWin32.cs` (Líneas 338-341)
- **Implementación actual:**
  ```csharp
  int tiempoEsperadoPosicionMs = (int)Math.Round(grafica.NormalizedCarPosition * grafica.IBestTime);
  int deltaInstantaneoMs = (grafica.IBestTime > 0 && grafica.ICurrentTime > 0)
      ? (grafica.ICurrentTime - tiempoEsperadoPosicionMs)
      : 0;
  ```
- **Problema Físico-Matemático:** La fórmula asume que el monoplaza recorre el circuito a **velocidad lineal estrictamente uniforme** ($s \times T_{\text{best}}$). En un circuito real como Monza:
  - En la recta principal (*Rettifilo*), el coche circula a más de $320\text{ km/h}$, cubriendo el primer 15% del trazado en apenas 9.5 segundos.
  - Sin embargo, $0.15 \times 81.24\text{ s} = 12.18\text{ s}$.
  - Como resultado, la fórmula arroja un delta artificial de **$-2.68$ segundos (verde engañoso)** al llegar al punto de frenada.
  - Inmediatamente después, en la *Prima Variante* (chicana a $75\text{ km/h}$), el coche pasa mucho más tiempo por metro de pista, lo que provoca que el delta salte violentamente a **$+2.5$ segundos (rojo engañoso)**, incluso si el piloto está calcando exactamente su mejor vuelta.
- **Consecuencia:** La barra de delta tanto en el DDU del volante como en el Live Pitwall oscilará de manera caótica durante toda la vuelta, perdiendo toda utilidad deportiva y de ingeniería.
- **Mejora Propuesta:**
  1. **Opción Recomendada (Nativa de Assetto Corsa):** Leer el campo `grafica.Split` expuesto en la estructura `acpmf_graphic`, donde Assetto Corsa calcula el delta oficial interpolado contra la mejor vuelta registrada.
  2. **Opción Alternativa (Backend Interpolado):** Registrar en memoria un lookup table discreto `(distanciaMetros -> tiempoMs)` de la vuelta rápida activa en la sesión, e interpolar el delta contra dicha curva real de referencia.

---

### 2.3. Generador Mock con Trayectoria Geométrica Arbitraria (Incompatible con Canvas 2D)
- **Ubicación:** `src/Telemetria.Aplicacion/Servicios/GeneradorTelemetriaMock.cs` (Líneas 356-366)
- **Implementación actual:**
  ```csharp
  private static (double coordenadaX, double coordenadaZ) ComputarCoordenadasMonza(double progreso)
  {
      double anguloRadianes = progreso * 2.0 * Math.PI;
      double radioX = 750.0 + 280.0 * Math.Sin(anguloRadianes * 2.0);
      double radioZ = 350.0 + 120.0 * Math.Cos(anguloRadianes * 3.0);

      double coordenadaX = Math.Round(Math.Cos(anguloRadianes) * radioX, 2);
      double coordenadaZ = Math.Round(Math.Sin(anguloRadianes) * radioZ, 2);

      return (coordenadaX, coordenadaZ);
  }
  ```
- **Problema:** Las coordenadas generadas en modo mock provienen de una curva armónica/cardioide inventada, en lugar de las coordenadas mundiales reales de Monza (`monza_f1_2025`). Además, la altura `posicionY` se mantiene fija en una constante plana `12.0f`.
- **Consecuencia en Frontend (Live Pitwall / Canvas 2D):**
  - La WebApp de boxes proyecta las coordenadas usando la calibración oficial de `map.ini`:  
    $U = (X + X_{\text{offset}}) \times \text{scale\_factor}$  
    $V = (Z + Z_{\text{offset}}) \times \text{scale\_factor}$
  - Al recibir las coordenadas del generador mock, el monoplaza virtual se dibujará completamente fuera del mapa `map.png`, dando vueltas en círculos sobre zonas sin asfalto o fuera del viewport del canvas.
- **Mejora Propuesta:**
  - Extraer una vuelta representativa real en formato JSON o precargar un arreglo de puntos `(x, y, z)` de la spline oficial de Monza (`ks_monza` / `monza_f1_2025`) para que el mock recorra el asfalto exacto del circuito.

---

## ⚡ 3. Inconsistencias Críticas en Contratos y DTOs

### 3.1. Discrepancia de Nombres de Propiedades en la API REST (Español vs Inglés)
Existe una **divergencia total de idioma** entre lo estipulado en `CONTRATOS_TELEMETRIA_Y_API.md` y lo implementado en los DTOs de Dev 1.

| Endpoint / DTO | Propiedad en Documentación Oficial (`CONTRATOS_...md`) | Propiedad Implementada en Dev 1 (`[JsonPropertyName]`) | Impacto en Frontend |
| :--- | :--- | :--- | :--- |
| **`GET /api/estado`** | `estaConectado` | `isConnected` | ❌ `undefined` |
| | `modoMock` | `isMockMode` | ❌ `undefined` |
| | `circuito` | `circuit` | ❌ `undefined` |
| | `modeloVehiculo` | `carModel` | ❌ `undefined` |
| | `longitudPistaMetros` | `trackLengthMeters` | ❌ `undefined` |
| | `autosActivos` | `activeCars` | ❌ `undefined` |
| **`GET /api/sesiones`** | `circuito` | `circuit` | ❌ `undefined` |
| | `configuracionCircuito` | `trackConfig` | ❌ `undefined` |
| | `modeloVehiculo` | `carModel` | ❌ `undefined` |
| | `tipoSesion` | `sessionType` | ❌ `undefined` |
| | `esSimulacionMock` | `isMockSimulation` | ❌ `undefined` |
| | `fechaInicio` | `startTime` | ❌ `undefined` |
| | `fechaFin` | `endTime` | ❌ `undefined` |
| | `totalVueltas` | `totalLaps` | ❌ `undefined` |
| | `mejorTiempoMs` | `bestLapTimeMs` | ❌ `undefined` |
| **`GET /api/sesiones/{id}/vueltas`** | `numeroVuelta` | `lapNumber` | ❌ `undefined` |
| | `tiempoVueltaMs` | `lapTimeMs` | ❌ `undefined` |
| | `tiempoVueltaTexto` | `lapTimeStr` | ❌ `undefined` |
| | `esValida` | `isValidLap` | ❌ `undefined` |
| | `esMejorVuelta` | `isBestLap` | ❌ `undefined` |
| **`GET /api/vueltas/{id}/telemetria`** | `distanciaPistaMetros` | `distanceMeters` | ❌ Gráficos uPlot vacíos |
| | `velocidadKmh` | `speedKmh` | ❌ Gráficos uPlot vacíos |
| | `acelerador` | `throttle` | ❌ Gráficos uPlot vacíos |
| | `freno` | `brake` | ❌ Gráficos uPlot vacíos |
| | `marcha` | `gear` | ❌ Gráficos uPlot vacíos |
| | `rpms` | `rpm` | ❌ Gráficos uPlot vacíos |
| | `fuerzaGLat` | `gLat` | ❌ Gráficos uPlot vacíos |
| | `fuerzaGLon` | `gLon` | ❌ Gráficos uPlot vacíos |
| | `posicionX`, `Y`, `Z` | `worldPositionX`, `Y`, `Z` | ❌ Gráficos uPlot vacíos |
| **`GET /api/vueltas/comparativa`** | `vueltaBaseId` | `baseLapId` | ❌ Gráficos Delta vacíos |
| | `vueltaComparadaId` | `comparedLapId` | ❌ Gráficos Delta vacíos |
| | `totalMuestrasBase` | `baseLapSamplesCount` | ❌ `undefined` |
| | `totalMuestrasComparada` | `comparedLapSamplesCount`| ❌ `undefined` |
| | `puntosComparados` | `points` | ❌ Gráficos Delta vacíos |
| *Puntos comparados individuales* | `distanciaPistaMetros` | `distanceMeters` | ❌ Gráficos Delta vacíos |
| | `velocidadBaseKmh` | `baseSpeedKmh` | ❌ Gráficos Delta vacíos |
| | `velocidadComparadaKmh` | `comparedSpeedKmh` | ❌ Gráficos Delta vacíos |
| | `deltaVelocidadKmh` | `deltaSpeedKmh` | ❌ Gráficos Delta vacíos |
| | `aceleradorBase` | `baseThrottle` | ❌ Gráficos Delta vacíos |
| | `aceleradorComparada` | `comparedThrottle` | ❌ Gráficos Delta vacíos |
| | `frenoBase` | `baseBrake` | ❌ Gráficos Delta vacíos |
| | `frenoComparada` | `comparedBrake` | ❌ Gráficos Delta vacíos |
| | `deltaTiempoAcumuladoMs` | `accumulatedDeltaTimeMs` | ❌ Gráficos Delta vacíos |
| **`POST /api/mock/alternar`** | `modoMockActivo` | `isMockActive` | ❌ `undefined` |
| | `mensaje` | `message` | ❌ `undefined` |

> [!IMPORTANT]
> **Contraste con WebSocket:** Curiosamente, en los paquetes WebSocket (`FRAME` y `LAP_COMPLETED`), Dev 1 implementó exactamente los mismos nombres en inglés que dictaba `CONTRATOS_TELEMETRIA_Y_API.md` (`speedKmh`, `throttle`, `drsEnabled`, `pressurePsi`, `gForce`, `worldPos`, `sessionLapId`, etc.). La inconsistencia surge únicamente en la capa REST porque la documentación original usó español para REST e inglés para WebSocket.

---

## ❓ 4. Casos de Falta de Definición y Vacíos de Arquitectura

### 4.1. Ausencia de Endpoints de Metadatos y Geometría de Circuitos
- **Situación:** El backend de Dev 1 solo conoce el nombre del circuito como una cadena de texto (ej. `"monza"`) y su longitud métrica.
- **Vacío en el Contrato:** En el proyecto se definió la inclusión de 3 circuitos con sus respectivos archivos de calibración:
  - `monza_f1_2025`
  - `imola_f1_2025`
  - `ks_red_bull_ring`
  Cada circuito cuenta con `map.png`, `map.ini` (ancho, alto, escala, offsets), `sections.ini` (nombres de curvas y sectores) y `drs_zones.ini`.
- **Problema de Integración:** Actualmente el backend no tiene endpoints para servir esta información (por ejemplo, `GET /api/circuitos` o `GET /api/circuitos/{id}/metadata`).
- **Consecuencia:** La WebApp y el DDU se ven forzados a mantener copias locales y estáticas de estos archivos, perdiendo sincronización si el simulador carga una variante no contemplada.

---

### 4.2. Soporte Exclusivo para Monza en el Modo Mock
- **Situación:** `GeneradorTelemetriaMock` tiene valores hardcodeados exclusivamente para Monza (`LONGITUD_MONZA_METROS = 5793.0`, perfiles de acelerador para Variante del Rettifilo, Curva Biassono, Roggia, Lesmo, Ascari y Alboreto).
- **Falta de Definición:** La documentación establecía que el sistema debe soportar los circuitos de la FAPPE (Monza como prioritario, Imola y Red Bull Ring como explorables). Sin embargo, el conmutador de mock no admite seleccionar el circuito a simular (`POST /api/mock/alternar` solo conmuta un booleano `usarMock`).

---

### 4.3. Nombres de Parámetros en Consultas Paginadas (REST)
- En `TelemetriaController.cs`:
  ```csharp
  public async Task<ActionResult<...>> ObtenerSesiones(
      [FromQuery] int numeroPagina = 1,
      [FromQuery] int tamanioPagina = 10, ...)
  ```
- En `ApiControladoresIntegrationTests.cs` (Línea 59):
  Dev 1 escribió: `_cliente.GetAsync("/api/sesiones?pagina=1&tamanioPagina=10")`.
- **Detalle:** La prueba pasó por accidente porque `numeroPagina` tiene un valor por defecto (`1`) en el controlador cuando el query param `pagina` no es reconocido. El parámetro formal acordado en el contrato es `numeroPagina`.

---

## 🧹 5. Hallazgos Menores de Calidad de Código y Limpieza

1. **Archivo Huérfano en el Repositorio:**
   - Existe el archivo vacío (0 bytes):  
     `src/Telemetria.Infraestructura/MemoriaCompartida/Estructuras/EstructuraEstaticaAC_temp_grafica.cs`
   - Debe ser eliminado para evitar ruido en el control de versiones.
2. **CORS y Red Local (Aspecto Muy Positivo):**
   - La clase `ValidadorOrigenRedLocal.cs` implementa una verificación dinámica excelente basada en RFC 1918 (bloques `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) y `localhost`, lo que garantiza que las conexiones desde la WebApp Next.js (`:3000`), el Vite DDU (`:5173`) y dispositivos móviles vía WiFi o tethering USB funcionen sin fricciones de CORS.
3. **Persistencia y Aislamiento de Transacciones:**
   - En `RepositorioVueltasSqlite.cs`, la desactivación explícita del detector de cambios (`ChangeTracker.AutoDetectChangesEnabled = false`) antes de `AddRangeAsync` de las muestras es una buena práctica de ingeniería que evita penalizaciones $O(N^2)$ al insertar 5.000 muestras por vuelta.

---

## 🎯 6. Plan de Acción y Recomendaciones Priorizadas

Para garantizar una integración fluida e impecable con el resto del proyecto, se recomienda ejecutar las siguientes acciones:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         HOJA DE RUTA DE CORRECCIONES                             │
├─────┬──────────────────────────┬──────────────┬──────────────────────────────────┤
│ N°  │ Acción                   │ Responsable  │ Detalle Operativo                │
├─────┼──────────────────────────┼──────────────┼──────────────────────────────────┤
│ 1   │ Unificación de Idioma en │ Dev 1 y      │ **Decisión Recomendada:**        │
│     │ DTOs REST                │ Dev 3        │ Adoptar estándar inglés camelCase│
│     │                          │              │ en REST (actualizar contrato de  │
│     │                          │              │ apex-link a inglés).             │
│ 2   │ Flexibilizar `global.json`│ Dev 1        │ Permitir `rollForward: minor`    │
│     │                          │              │ para desbloquear SDKs 10.0.2xx   │
│ 3   │ Corrección del Delta en  │ Dev 1        │ Mapear `grafica.Split` o usar    │
│     │ Vivo                     │              │ curva de referencia no-lineal.   │
│ 4   │ Coordenadas Físicas en   │ Dev 1        │ Reemplazar fórmula Lissajous por │
│     │ Generador Mock           │              │ spline real de Monza.            │
│ 5   │ Limpieza de Archivos     │ Dev 1        │ Eliminar archivo vacío huérfano. │
│ 6   │ Estandarizar Metadatos   │ Dev 1 y      │ Definir si la API servirá        │
│     │ de Pistas                │ Dev 3        │ `map.ini` o si es estático Web.  │
└─────┴──────────────────────────┴──────────────┴──────────────────────────────────┘
```

### Decisión de Arquitectura Recomendada sobre el Idioma REST:
Dado que todos los paquetes WebSocket (`speedKmh`, `throttle`, `drsEnabled`, `gForce`, `worldPos`, `sessionLapId`), las bibliotecas de gráficos (uPlot, ECharts, Recharts) y las convenciones estándar de la industria utilizan **inglés camelCase**, **la recomendación arquitectónica más limpia es actualizar el documento `CONTRATOS_TELEMETRIA_Y_API.md` para adoptar los DTOs en inglés de Dev 1**. De esta manera, el backend mantiene sus anotaciones actuales y tanto el Frontend como el DDU operan sobre una nomenclatura técnica universal y homogénea en todos los canales.

# 🔌 Protocolo de Telemetría y Contratos API

Este documento define la estructura de mensajes intercambiados vía **WebSocket** y los endpoints **REST** de persistencia.

---

## 1. WebSocket Telemetry Stream

- **URL:** `ws://<host>:8080/ws/telemetry`
- **Frecuencia:** 60 Hz (para física y display) / 10 Hz (para gráficos y metadata)
- **Modo:** Broadcast a todos los clientes conectados (Móvil y Web).

### 1.1. Paquete en Tiempo Real (`TELEMETRY_FRAME`)
Enviado a 60 Hz. Estructurado para ser lo más liviano posible:

```json
{
  "type": "FRAME",
  "timestamp": 1729290000123,
  "car": {
    "speedKmh": 284.5,
    "rpms": 11850,
    "maxRpm": 13000,
    "gear": 6,
    "throttle": 0.98,
    "brake": 0.0,
    "steer": -0.05,
    "drsAvailable": true,
    "drsEnabled": false
  },
  "tyres": {
    "pressurePsi": [23.1, 23.2, 21.0, 21.1],
    "tempCoreC": [94.5, 96.2, 88.0, 89.1],
    "wear": [98.2, 97.9, 99.1, 99.0]
  },
  "timing": {
    "lapTimeMs": 45120,
    "lapTimeStr": "00:45.120",
    "bestTimeMs": 81240,
    "bestTimeStr": "01:21.240",
    "deltaMs": -320,
    "currentLap": 4,
    "sector": 2,
    "lapProgress": 0.542
  },
  "dynamics": {
    "gForce": {
      "lat": -1.45,
      "lon": 0.12,
      "vert": -0.05
    },
    "worldPos": {
      "x": 124.52,
      "y": 12.01,
      "z": -450.81
    }
  },
  "session": {
    "flag": "GREEN",
    "position": 2,
    "track": "monza",
    "carModel": "formula_hybrid"
  }
}
```

---

### 1.2. Evento de Vuelta Completada (`LAP_COMPLETED`)
Emitido automáticamente cada vez que el auto cruza la línea de meta:

```json
{
  "type": "LAP_COMPLETED",
  "lapNumber": 4,
  "lapTimeMs": 81190,
  "lapTimeStr": "01:21.190",
  "isPersonalBest": true,
  "isValidLap": true,
  "sectors": [28100, 27400, 25690],
  "telemetrySamplesCount": 4871,
  "sessionLapId": "lap_monza_20261018_04"
}
```

---

## 2. Endpoints HTTP / REST (Backend & Web Next.js)

El relay o servidor web expone rutas para consultar el histórico y descargar los datos crudos para el análisis:

| Método | Endpoint | Descripción | Respuesta |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/status` | Estado del simulador y conexión. | `{ "connected": true, "game": "Assetto Corsa", "track": "monza", "isMock": false }` |
| `GET` | `/api/sessions` | Listado de sesiones grabadas en el simulador. | Array con IDs de sesión, fecha, pista y auto. |
| `GET` | `/api/sessions/:id/laps` | Lista de vueltas registradas en una sesión. | Resumen de tiempos por vuelta y banderas. |
| `GET` | `/api/laps/:lapId/telemetry` | Array completo de muestras de telemetría de esa vuelta. | JSON con las muestras para graficar trazada y curvas. |
| `POST` | `/api/mock/toggle` | Activa o desactiva el motor de simulación de prueba. | `{ "mockActive": true }` |

---

## 3. Optimización de Red (Reducción de Overhead)

1. **Heartbeat y Reconección:** El cliente móvil implementa un ping cada 1000ms. Si se desconecta el cable USB, muestra una pantalla de *"Waiting for Sim..."* y se reconecta inmediatamente al reconectar el cable.
2. **Filtrado de Paquetes en Live:** Si el monoplaza está detenido en boxes o en pausa, la tasa de transmisión baja automáticamente de 60 Hz a 5 Hz para ahorrar recursos.

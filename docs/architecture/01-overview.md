# 🏛️ Visión Integral, Concepto y Arquitectura del Sistema (Overview)

> **Proyecto:** Sistema Integral de Telemetría y Análisis de Rendimiento en Pista para SimRacing  
> **Ámbito:** Proyecto Final / Presentación FAPPE 2026  
> **Audiencia:** Jurado Evaluador de FAPPE, Docentes Universitarios, Ingenieros de Software y Usuarios de SimRacing

---

## 1. La Problemática en SimRacing y Motorsport Amateur

En el automovilismo de competición contemporáneo (Fórmula 1, WEC, IndyCar), la telemetría no es un accesorio cosmético: **es la herramienta nuclear que decide carreras**. Un monoplaza de F1 cuenta con más de 300 sensores que transmiten datos por segundo para que tanto el piloto en el volante como una brigada de ingenieros en el muro de boxes (*pitwall*) tomen decisiones críticas en fracciones de segundo.

Sin embargo, en el mundo del **SimRacing competitivo y de formación**:
1. **Sobrecarga cognitiva del piloto y campo visual recortado:** El piloto depende del HUD del propio juego en pantalla única, el cual suele ser invasivo, tapar la visión del vértice de curva (*apex*) o forzar al ojo a buscar datos periféricos como marchas o tiempos en vez de fijar la vista en el punto de frenada.
2. **Volantes profesionales prohibitivos:** Un volante de simulación réplica de F1 con pantalla LCD integrada (como un Fanatec Podium, Cube Controls o Moza FSR) tiene costos que oscilan entre **$700 USD y $2.000 USD**, lo que resulta inaccesible para la gran mayoría de estudiantes y entusiastas.
3. **Ausencia de análisis post-sesión accesible y orientado a la técnica de manejo:** Las herramientas profesionales de análisis existentes (como MoTeC i2Pro) fueron diseñadas en la década de los 90 para ingenieros aeroespaciales y de competición: requieren exportar manualmente archivos `.ld`, configuraciones complejas de canales matemáticos y ofrecen interfaces crípticas poco pedagógicas. El piloto amateur no logra responder rápidamente preguntas básicas como: *¿Dónde freno antes? ¿Estoy haciendo trail-braking correctamente? ¿Estoy sobrecalentando el neumático delantero derecho por exceso de ángulo de giro?*
4. **Falta del rol de "Ingeniero de Carrera" colaborativo:** En sesiones de práctica o eventos con público/jurado, el acompañante se limita a ser un espectador pasivo en vez de poder monitorear el desgaste del coche o aconsejar al piloto en tiempo real.

---

## 2. El Concepto del Software y la Propuesta de Valor Agregado

Este proyecto introduce un **ecosistema de software en tiempo real y post-sesión**, desacoplado y de costo cero en hardware adicional (reutilizando cualquier smartphone Android existente):

```mermaid
mindmap
  root((Ecosistema de Telemetría))
    Piloto en Pista
      Inmersión total sin HUD en pantalla
      Display F1 en volante con Shift LEDs
      Información periférica instantánea
      Cero latencia vía USB
    Ingeniero de Carrera en Boxes
      Monitoreo Live en tiempo real
      Diagnóstico de desgaste y temperaturas
      Gestión de delta de tiempos y stints
    Análisis Post-Sesión
      Desmitificación de MoTeC
      Superposición de trazadas sobre circuito
      Comparativa intuitiva de acelerador y freno
      Detección automática de errores de pilotaje
```

### 2.1. Ejes de Valor Agregado del Proyecto

* **Democratización de Hardware (Smartphone repurposing):** Convierte cualquier teléfono inteligente en desuso o secundario en una pantalla de telemetría de competición con refresco de 60 FPS, conectada por un simple cable USB con latencia inferior a los 3 milisegundos, compitiendo de igual a igual con volantes comerciales de gama alta.
* **Telemetría Didáctica e Intuitiva:** Sustituye los gráficos áridos de MoTeC por visualizaciones modernas tipo *F1 TV Broadcast*: mapas de calor sobre el circuito (zonas rojas de frenada profunda, amarillas de transición/trail-braking, verdes de aceleración total) y gráficas sincronizadas donde un clic en cualquier curva de velocidad resalta el punto exacto en el mapa 2D.
* **Doble Experiencia Interactiva para la FAPPE (Factor Wow):** No es solo sentarse a dar vueltas en un simulador; es una **demostración de ingeniería colaborativa en vivo**. Mientras un evaluador conduce en el habitáculo sintiendo la respuesta visual de los RPM LEDs en el volante, otro integrante o miembro del jurado oficia de **Ingeniero de Pista** desde una laptop externa viendo el desgaste térmico de las gomas y el ritmo de carrera en tiempo real.

---

## 3. Modelo Operativo: Los Tres Momentos del Usuario

El ciclo de uso del software está pensado de punta a punta:

```mermaid
sequenceDiagram
    autonumber
    actor Piloto as 🏎️ Piloto en Simulador
    participant AC as 🎮 Assetto Corsa
    participant Relay as ⚙️ Core Relay (PC)
    participant Android as 📱 F1 Steering Display
    participant WebLive as 🖥️ Next.js Live Pitwall
    participant WebPost as 📊 Next.js Post-Session
    actor Ingeniero as 👨‍💻 Ingeniero / Jurado

    Note over Piloto,AC: MOMENTO 1: EN CARRERA (LIVE IN-COCKPIT)
    Piloto->>AC: Conduce (Aceleración, Freno, Cambios)
    AC->>Relay: Escribe telemetría en Memoria Compartida (60 Hz)
    Relay->>Android: Emisión por USB de RPMs, Marcha, Deltas, Banderas
    Android-->>Piloto: Feedback visual instantáneo (Shift LEDs al corte)
    Relay->>WebLive: Emisión por WebSocket a Boxes
    WebLive-->>Ingeniero: Muestra telemetría en vivo, mapa y desgaste de neumáticos

    Note over Piloto,AC: MOMENTO 2: CIERRE DE VUELTA (DATA HARVESTING)
    Piloto->>AC: Cruza la línea de meta
    AC->>Relay: Flag de vuelta completada + tiempo oficial
    Relay->>Relay: Valida vuelta y guarda telemetría completa en Base de Datos

    Note over Ingeniero,WebPost: MOMENTO 3: ANÁLISIS DE RENDIMIENTO (DEBRIEF)
    Ingeniero->>WebPost: Abre la sesión en la web
    WebPost->>WebPost: Superpone vuelta actual vs Mejor vuelta histórica
    WebPost-->>Ingeniero: Expone mapa de calor, telemetría superpuesta y pérdidas de tiempo
```

1. **Momento 1: En Carrera (In-Cockpit Live):** El piloto conduce sin distracciones. En su volante, el display móvil le indica el momento milimétrico de cambiar de marcha a través de los Rev LEDs, el delta de tiempo con su mejor marca y el estado térmico de los frenos y neumáticos.
2. **Momento 2: Cierre de Vuelta y Captura:** Al cruzar la meta, el Core Relay detecta el pulso de fin de vuelta, extrae los miles de puntos de datos acumulados (fuerzas G, coordenadas espaciales, inputs de pedales) y los consolida en una estructura indexada de sesión.
3. **Momento 3: Debrief de Ingeniería (Post-Session):** Piloto e ingeniero abren la aplicación Next.js y observan la comparativa de la última vuelta contra la vuelta rápida: se visualiza exactamente cuántos metros antes se frenó en una chicana, si hubo bloqueo de ruedas o si se abrió el acelerador demasiado tarde en la salida de curva.

---

## 4. Arquitectura de Software y Desglose de Componentes

Para lograr robustez, desacoplamiento y cero impacto en los recursos gráficos del juego, el sistema se divide en **tres capas independientes**:

```mermaid
flowchart TB
    subgraph Capa1 ["CAPA 1: ADQUISICIÓN Y PERSISTENCIA (Simulador Host)"]
        direction TB
        AC_Game["Assetto Corsa Engine\n(Física C++ @ 333Hz)"]
        
        subgraph SharedMem ["Windows Shared Memory MMF"]
            P_Phys["acpmf_physics\n(RPMS, Gear, Speed, G-Force, Tyres, Coords)"]
            P_Graph["acpmf_graphic\n(Lap Time, Best, Delta, Flags, Position)"]
            P_Stat["acpmf_static\n(Max RPM, Car Model, Track Name, Sectors)"]
        end
        
        AC_Game --> SharedMem
        
        subgraph CoreService ["Telemetry Relay Core (:8080)"]
            Reader["MMF Poller & Stream Decoder (60 Hz)"]
            MockGen["Deterministic Mock Engine (Modo Desarrollo/Offline)"]
            StateMgr["Session State Machine (Pit / Stint / Lap Detection)"]
            WSServer["High-Throughput WebSocket Server"]
            StorageMgr["Storage Engine (SQLite / Compact JSON Lake)"]
            
            Reader --> StateMgr
            MockGen -.->|Fallback flag| StateMgr
            StateMgr --> WSServer
            StateMgr --> StorageMgr
        end
        
        SharedMem --> Reader
    end

    subgraph Capa2 ["CAPA 2: CLIENTE EN VOLANTE (Android USB Display)"]
        direction TB
        subgraph PhoneDevice ["Dispositivo Android en Volante"]
            PWA_Engine["F1 Steering Wheel Web Engine\n(Hardware Accelerated Canvas / SVG)"]
            RevLEDs["Rev LEDs Controller (Adaptive RPM Shift Array)"]
            GearWidget["High-Visibility Gear & Speed Block"]
            DeltaWidget["Live Delta Tracker (+/- Color Coded)"]
            TyreWidget["4-Wheel Pressure & Thermal Matrix"]
            
            PWA_Engine --> RevLEDs
            PWA_Engine --> GearWidget
            PWA_Engine --> DeltaWidget
            PWA_Engine --> TyreWidget
        end
    end

    subgraph Capa3 ["CAPA 3: PLATAFORMA DE INGENIERÍA (Web Next.js)"]
        direction TB
        subgraph WebStation ["Estación de Boxes (Laptop / Monitor Externo)"]
            LiveWall["Módulo 1: Live Pitwall\n(Dashboard Boxes, Pedales en Vivo, G-G Diagram)"]
            TrackMapper["Módulo 2: 2D Track Geometry Engine\n(Reconstrucción de circuito por Coordenadas X/Z)"]
            CompareChart["Módulo 3: Lap Telemetry Synchronizer\n(Curvas Velocidad/Acelerador/Freno vs Distancia)"]
            SessionExplorer["Módulo 4: Explorador de Sesiones & Base de Datos"]
        end
    end

    WSServer -->|"Cable USB (ADB Reverse tcp:8080) | Latencia < 3ms"| PWA_Engine
    WSServer -->|"WebSocket LAN / Localhost"| LiveWall
    StorageMgr -->|"REST API / Server Actions"| SessionExplorer
    SessionExplorer --> TrackMapper
    SessionExplorer --> CompareChart
```

### 4.1. Capa de Adquisición y Persistencia (Backend Relay)
- **Tecnología:** Node.js v22 (con bibliotecas de lectura Win32 MMF) o daemon en Python.
- **Principio de Diseño:** Lectura no bloqueante. Se lee la memoria compartida mediante punteros nativos de Windows, garantizando que el consumo de procesador sea inferior al 1.5% del CPU para no quitarle recursos al cálculo de físicas ni a la GPU del simulador.
- **Motor Mock de Telemetría:** Un generador incorporado capaz de reproducir con precisión milimétrica una vuelta sintética pregrabada en un circuito (como Monza o Spa). Permite a los desarrolladores de frontend y móvil trabajar sin necesidad de tener el simulador abierto.

### 4.2. Capa de Instrumentación In-Cockpit (F1 Steering Wheel Display)
- **Tecnología:** PWA optimizada para ejecución en navegador móvil Chrome con aceleración por hardware (Canvas 2D / CSS GPU layers) a 60 FPS fijos.
- **Ergonomía Visual:**
  - **Paleta de Alto Contraste:** Fondos oscuros absolutos (`#000000`) ideales para paneles OLED/AMOLED, eliminando reflejos indeseados.
  - **Algoritmo Adaptativo de Shift Lights:** La escala de luces no es fija; lee el `maxRpm` de la memoria estática del auto actual y calibra automáticamente el 80% (verde), 90% (rojo) y 97% (azul destellante de corte) para el cambio de marcha perfecto.
  - **Manejo de Ciclo de Vida Móvil:** Invocación de la `Screen WakeLock API` para impedir que el teléfono suspenda la pantalla tras inactividad táctil.

### 4.3. Capa de Ingeniería y Análisis (Next.js Telemetry Platform)
- **Tecnología:** Next.js (App Router), TailwindCSS, Recharts / uPlot, Lucide Icons.
- **Capacidades Analíticas:**
  - **Normalización de Dominio (Distancia vs Tiempo):** En ingeniería de pista, las telemetrías nunca se comparan por tiempo (porque una vuelta más lenta desfasa los puntos de la pista). El sistema normaliza todas las muestras en función de la **distancia recorrida en metros ($0$ a $L_{pista}$)**, permitiendo que el punto de frenada de dos vueltas coincida exactamente en el mismo metro de la pista.
  - **Reconstrucción Geométrica del Circuito:** El sistema toma las coordenadas espaciales $(X, Z)$ registradas por el physics engine y genera el dibujo vectorial del circuito en tiempo real, trazando un gradiente de color según la velocidad o la intensidad de frenada.

---

## 5. Especificaciones de Calidad y Rendimiento

| Métrica / Parámetro | Objetivo de Diseño | Justificación Técnica |
| :--- | :--- | :--- |
| **Latencia Display Volante** | $< 5\text{ ms}$ | El ojo humano percibe retrasos mayores a 16ms entre el sonido del motor y el LED de RPM. |
| **Frecuencia de Muestreo** | $60\text{ Hz}$ en física | Captura detalles sutiles de inputs (pulsos de ABS, correcciones rápidas de dirección). |
| **Consumo de CPU en Simulador** | $< 2\%$ | No debe producir caídas de frames (*stuttering*) en Assetto Corsa. |
| **Independencia de Red Externa** | $100\%$ Local / Offline | La presentación en la FAPPE no puede depender de acceso a Internet ni de redes WiFi públicas. |
| **Tiempo de Recuperación por Desconexión** | $< 1\text{ segundo}$ | Si se mueve el cable USB durante el manejo, la interfaz debe reanudarse al instante sin intervención manual. |

---

## 6. Impacto Académico y Defensa del Proyecto

Para la presentación ante los evaluadores de la FAPPE, este desarrollo integra múltiples competencias troncales de la carrera:

1. **Sistemas Operativos y Bajo Nivel:** Uso de memoria compartida (*Shared Memory MMF*), sincronización de procesos y llamadas nativas Win32.
2. **Redes y Comunicaciones de Tiempo Real:** Protocolos WebSocket sobre enlace físico ADB USB, serialización de datos compacta y gestión de contrapresión (*backpressure*).
3. **Ingeniería de Software y Arquitectura:** Desacoplamiento en microservicios/módulos especializados, patrones publicador-suscriptor y diseño orientado a contratos API.
4. **Desarrollo Web Moderno y UX:** Aplicaciones reactivas de alto rendimiento, aceleración gráfica por GPU en entornos web y diseño de dashboards de ingeniería con análisis de datos.

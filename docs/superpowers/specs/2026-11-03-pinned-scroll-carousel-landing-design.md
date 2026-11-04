# Design Doc: Pinned Vertical Scroll Carousel para Secciones de Landing (ApexLink)

## 1. Intent & Context
El usuario solicitó aplicar la misma animación que se utilizó en la landing de **trace-studio** a los componentes de cada sección de la landing de **ApexLink**, especificando:
- **No tocar el Hero** (el Hero y el TopNav quedan 100% intactos).
- Aplicar el **Enfoque 3 (Carrusel Pinneado Vertical con GSAP ScrollTrigger)** a las secciones debajo del Hero.

## 2. Metas & Anti-Metas
- **Metas**:
  - Replicar la arquitectura de `PainPoints.tsx` y `ProcessTimeline.tsx` de `trace-studio` en las secciones interactivas clave de la landing de ApexLink:
    1. `FeaturesGrid.tsx` (6 características de telemetría e instrumental).
    2. `QuickStartSteps.tsx` (3 pasos de arranque rápido).
  - Implementar pinning de sección (`pin: true`, `pinSpacing: true`, `scrub: 0.6`), snapping automático a cada paso, transiciones verticales con desenfoque dinámico (`filter: blur(...)`, `scale`, `y: -75` a `0`), barra de progreso continua con marcadores de paso y luz ambiental reactiva al step activo.
  - Adaptar la paleta estética a Motorsport / BMW M: acentos rojo M (`#e22718`), azul M (`#0066b1`, `#1c69d4`), verde telemetría (`#0fa336`) y superficies cockpit.
  - Mantener accesibilidad y compatibilidad con SSR en Next.js App Router mediante `useGSAP` y `ScrollTrigger.refresh()`.
- **Anti-Metas**:
  - NO modificar el componente `Hero` ni sus animaciones en `page.tsx`.
  - NO alterar la navegación superior (`header`).
  - NO introducir dependencias pesadas adicionales (se utiliza el GSAP + ScrollTrigger ya instalado en el proyecto).

## 3. Approaches Considerados
1. **Enfoque 1 (SpotlightCards con hover de cursor + scroll reveal)**: Mantener grilla estática y sumar seguimiento de cursor. Descartado por el usuario en favor del carrusel pinneado.
2. **Enfoque 2 (Simple scroll stagger)**: Animaciones simples de fade y translate. Descartado por no tener el impacto de pinning.
3. **Enfoque 3 (Carrusel Pinneado Vertical estilo Trace-Studio) [SELECCIONADO]**:
   - `FeaturesGrid`: Se transforma en un carrusel pinneado vertical de 6 pasos de telemetría. Mientras el usuario scrollea, la pantalla se fija suavemente y transicionan los 6 módulos (DDU, Live Pitwall, Laboratorio 2D, Inspector de Curvas, Métricas, Compatibilidad) con blur, elevación, barra de progreso interactiva y rayo de luz focal.
   - `QuickStartSteps`: Se transforma en un carrusel pinneado vertical de 3 pasos de puesta en marcha (Abrir ApexLink -> Salir a pista -> Ver telemetría en tiempo real) con marcadores secuenciales y sincronización de scroll.
   - `CtaBand` & `Footer`: Cierran la landing con fluidez tras salir de los contenedores pinneados.

## 4. Arquitectura Técnica de los Componentes
### A. `FeaturesGrid.tsx`
- **Refs**: `pinWrapperRef`, `itemsRef`, `progressBarRef`, `spotlightRef`.
- **Estado**: `activeStep` (0 a 5).
- **Timeline GSAP**:
  - `ScrollTrigger`: `trigger: pinWrapper`, `start: "top 20%"`, `end: "+=2600"`, `pin: true`, `scrub: 0.6`, `snap: 1 / 5`.
  - Loop de transiciones: de ítem `i` a `i+1` animando `currentItem` (`y: -75, opacity: 0, scale: 0.96, filter: "blur(6px)"`) y `nextItem` (`y: 0, opacity: 1, scale: 1, filter: "blur(0px)"`).
  - `onUpdate`: actualiza ancho de `progressBarRef` y posición `y` de `spotlightRef` con glow dinámico en rojo/azul M.

### B. `QuickStartSteps.tsx`
- **Refs**: `pinWrapperRef`, `itemsRef`, `progressBarRef`, `spotlightRef`.
- **Estado**: `activeStep` (0 a 2).
- **Timeline GSAP**:
  - `ScrollTrigger`: `trigger: pinWrapper`, `start: "top 22%"`, `end: "+=1800"`, `pin: true`, `scrub: 0.6`, `snap: 1 / 2`.
  - Transición fluida entre los 3 pasos con numeración gigante (`01`, `02`, `03`) e íconos temáticos de simracing.

### C. `page.tsx`
- Hero y TopNav se conservan tal cual.
- Asegurar `ScrollTrigger.refresh()` tras el montaje para calcular adecuadamente las posiciones pinneadas en la cascada del DOM.

## 5. Criterios de Aceptación & Verificación
- El Hero no sufre modificaciones de layout ni de animaciones.
- Al scrollear hasta `FeaturesGrid`, el contenedor se ancla en pantalla (`pin`) y el scroll avanza secuencialmente por las 6 herramientas de pista con desenfoque progresivo y barra de avance.
- Al scrollear hasta `QuickStartSteps`, el contenedor se ancla y avanza por los 3 pasos de inicio rápido.
- No hay desbordamientos horizontales ni bloqueos de scroll al llegar al final de cada carrusel.
- Build sin errores de TypeScript ni de Next.js (`pnpm run build` o `npm run build`).

# Plan de Implementación: Sistema UI/UX Profesional y Autenticación de Producción

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar ApexLink en una plataforma web de grado profesional, eliminando todos los alternadores y atajos de prototipo/MVP, estableciendo un sistema de componentes UI reutilizables (`Button`, `Input`, `Skeleton`, `EmptyState`, `Badge`, `Tooltip`), integrando notificaciones Toast, navegabilidad con Avatar Dropdown, indicadores de carga globales, páginas de resiliencia (`error.tsx`, `not-found.tsx`), autenticación real con backend .NET 10 y PostgreSQL, y protección estricta de rutas.

**Architecture:** Se crea una capa sólida de primitivas UI en `web/src/components/ui/` utilizando `clsx` y `tailwind-merge` (`cn`). La navegación superior se refactoriza con un componente `UserNavDropdown` estándar y accesible. Se implementa un `ToastProvider` global en el layout raíz para feedback reactivo y una `TopProgressBar` para transiciones de ruta. En el backend (.NET 10 Kestrel), se expone el endpoint `POST /api/auth/login` validando hashes BCrypt contra PostgreSQL 16. La página `/login` se convierte en un formulario estricto de credenciales y el layout de `/app` aplica guardia de sesión para usuarios no autenticados.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript 5, Tailwind CSS 4, Lucide Icons, ASP.NET Core (.NET 10), PostgreSQL 16 (`Npgsql`, `BCrypt.Net-Next`).

---

## Global Constraints

- Cumplir estrictamente con las reglas de trabajo en disco de `GEMINI.md`: lectura fresca antes de editar, preservación de avances del usuario y verificación de diffs.
- Cero tolerancia a botones o banners de alternancia artificial de usuarios en vistas de producción (`layout.tsx`, `perfil/page.tsx`, `login/page.tsx`).
- Cumplimiento de pautas de accesibilidad básica (WCAG AA): contraste de color legible sobre fondos oscuros (`#000000`, `#0d0d0d`, `#141414`), anillos de foco visibles (`focus-visible:ring-2 focus-visible:ring-[#0066b1]`), soporte de teclado (tecla `Escape` para cerrar menús/modales).
- Cero saltos de contenido (Zero CLS): uso de `Skeleton` loaders que respeten el espacio y dimensiones exactas de las tarjetas y tablas.
- La suite de pruebas de .NET 10 debe pasar al 100% y la compilación de Next.js (`next build`) debe finalizar con 0 errores TypeScript.

## Review Focus

1. **User Menu Dropdown accesible:** Debe cerrar al hacer clic afuera (click-outside), al presionar la tecla `Escape` o al navegar, mostrando avatar con iniciales y anillo de categoría.
2. **Skeleton Shimmer vs Spinners:** Al recargar páginas o demorarse la respuesta de la API, deben renderizarse esqueletos visuales con pulsación sutil en lugar de spinners flotantes desalineados.
3. **Flujo de Toast Notifications:** Toda acción exitosa (login, logout, guardado de ajustes, copia de telemetría) o fallo de red debe disparar un toast discreto con auto-descarte a los 4 segundos.
4. **Protección de Rutas (`/app/*`):** El acceso a cualquier ruta de `/app` sin token en `localStorage` debe redirigir inmediatamente a `/login`.
5. **Formulario de Login Real:** Inputs con placeholders realistas, toggle para ver/ocultar contraseña, spinner integrado en el botón (`isSubmitting`) y banner de error con diseño accesible.

---

## Estructura de Tareas de Implementación

### Task 1: Primitivas Reutilizables de UI (`web/src/components/ui/`)
**Files:**
- Create: `web/src/components/ui/Button.tsx`
- Create: `web/src/components/ui/Input.tsx`
- Create: `web/src/components/ui/Skeleton.tsx`
- Create: `web/src/components/ui/Badge.tsx`
- Create: `web/src/components/ui/Card.tsx`
- Create: `web/src/components/ui/EmptyState.tsx`
- Create: `web/src/components/ui/Tooltip.tsx`

**Interfaces:**
- Consumes: `cn` de `@/lib/utils`, Lucide Icons.
- Produces: Biblioteca de componentes atómicos cohesivos con el diseño automotriz (Porsche GT3 / BMW M Power).

- [ ] **Step 1: Implementar `Button.tsx`**
  Variantes: `primary` (azul `#0066b1`), `secondary` (`#1a1a1a`), `danger` (`#e22718`), `ghost`, `outline`. Tamaños: `sm`, `md`, `lg`. Soporte para `isLoading` (spinner integrado desactivando el botón) e `icon`.
- [ ] **Step 2: Implementar `Input.tsx`**
  Soporte para `label`, `error`, `helperText`, ícono izquierdo/derecho, estados de foco y estilos monoespaciados opcionales.
- [ ] **Step 3: Implementar `Skeleton.tsx`**
  Contenedor flexible con animación `animate-pulse` y gradiente oscuro de brillo sutil para evitar CLS.
- [ ] **Step 4: Implementar `Badge.tsx`**
  Badges semánticos (`success`, `warning`, `danger`, `info`, `neutral`, `m-power`).
- [ ] **Step 5: Implementar `EmptyState.tsx`**
  Estructura para estados vacíos: ícono contenedor centrado, título en mayúsculas, descripción de contexto y botón de acción opcional.
- [ ] **Step 6: Implementar `Tooltip.tsx`**
  Componente ligero de micro-educación que despliega descripción técnica en hover/focus.
- [ ] **Step 7: Verificar compilación con `npm --prefix web run build`.**

---

### Task 2: Sistema Global de Notificaciones Flotantes (Toasts)
**Files:**
- Create: `web/src/components/ui/Toast.tsx`
- Create: `web/src/context/ToastContext.tsx`
- Modify: `web/src/app/layout.tsx`

**Interfaces:**
- Consumes: `ToastContext`.
- Produces: Hook `useToast()` con métodos `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`.

- [ ] **Step 1: Crear `Toast.tsx`**
  Renderiza notificaciones flotantes apilables en la esquina inferior derecha con franja de acento según severidad, título, descripción, barra de progreso temporal y botón de descarte.
- [ ] **Step 2: Crear `ToastContext.tsx`**
  Gestor de estado con cola de toasts y temporizador automático de 4.000 ms.
- [ ] **Step 3: Integrar `ToastProvider` en `web/src/app/layout.tsx`.**
- [ ] **Step 4: Verificar funcionamiento.**

---

### Task 3: Navegación de Producción y User Menu Dropdown en Header
**Files:**
- Create: `web/src/components/layout/UserNavDropdown.tsx`
- Modify: `web/src/app/app/layout.tsx`

**Interfaces:**
- Consumes: `obtenerSesionLocal()`, `cerrarSesion()`, `useToast()`.
- Produces: Menú de usuario estándar de producción en el header.

- [ ] **Step 1: Crear `UserNavDropdown.tsx`**
  - Botón de avatar con iniciales del piloto y anillo coloreado según nivel (`Alien F1` = oro/azul, `GT3 Pro-Am` = rojo).
  - Menú desplegable con listener de clic externo y tecla `Escape`.
  - Header del menú con nombre, email, auto y Apex Rating actual.
  - Accesos directos a "Mi Perfil & Rating" (`/app/perfil`), "Ajustes de Boxes" (`/app/ajustes`).
  - Botón de "Cerrar Sesión" con descarte de token y redirección a `/login`.
- [ ] **Step 2: Refactorizar `web/src/app/app/layout.tsx`:**
  - Eliminar los botones de conmutar piloto `[AG_PRO]` vs `[AS_GT3]`.
  - Integrar `UserNavDropdown` en el extremo superior derecho.
  - Agregar guardia de sesión en el layout de `/app`: si `!estaAutenticado()`, redirigir inmediatamente a `/login`.
- [ ] **Step 3: Probar apertura, cierre y navegación del dropdown.**

---

### Task 4: Feedback de Carga Global y Páginas de Resiliencia
**Files:**
- Create: `web/src/components/layout/TopProgressBar.tsx`
- Create: `web/src/app/loading.tsx`
- Create: `web/src/app/error.tsx`
- Create: `web/src/app/not-found.tsx`

**Interfaces:**
- Consumes: Next.js App Router hooks (`usePathname`, `useSearchParams`).
- Produces: Feedback continuo de navegación y páginas de fallback accesibles.

- [ ] **Step 1: Crear `TopProgressBar.tsx`**
  Barra delgada de carga superior animada en la parte más alta de la pantalla ante cambios de ruta.
- [ ] **Step 2: Crear `web/src/app/loading.tsx`**
  Pantalla de carga global con skeleton visual mientras se hidrata la aplicación.
- [ ] **Step 3: Crear `web/src/app/error.tsx`**
  Error Boundary elegante con diseño temático de telemetría de boxes ("Anomalía en Telemetría de Boxes"), visualización del error y botón `reset()` para reintentar sin recargar todo el sitio.
- [ ] **Step 4: Crear `web/src/app/not-found.tsx`**
  Página 404 tematizada ("Fuera de Pista - Sector No Encontrado") con botón de retorno al Dashboard.

---

### Task 5: Backend .NET 10 - Endpoint `POST /api/auth/login` con PostgreSQL y Hashes BCrypt
**Files:**
- Create: `backend/src/Telemetria.Aplicacion/Dtos/Requests/LoginRequest.cs` (en `apex-link-telemetry`)
- Create: `backend/src/Telemetria.Aplicacion/Dtos/Responses/LoginRespuestaDto.cs` (en `apex-link-telemetry`)
- Create: `backend/src/Telemetria.Aplicacion/Contratos/IAutenticadorUsuarios.cs` (en `apex-link-telemetry`)
- Create: `backend/src/Telemetria.Infraestructura/Seguridad/AutenticadorUsuariosPostgreSql.cs` (en `apex-link-telemetry`)
- Create: `backend/src/Telemetria.Api/Controladores/AuthController.cs` (en `apex-link-telemetry`)
- Modify: `backend/src/Telemetria.Infraestructura/Telemetria.Infraestructura.csproj` (agregar `BCrypt.Net-Next`)
- Modify: `backend/src/Telemetria.Api/Configuracion/InyeccionDependenciasExtensiones.cs`
- Create/Modify: Tests de integración en `Telemetria.Api.IntegrationTests`

**Interfaces:**
- Consumes: Endpoint `POST /api/auth/login`.
- Produces: `LoginRespuestaDto` (Token JWT/sesión, perfil consolidado del piloto) o HTTP 401 si las credenciales fallan.

- [ ] **Step 1: Escribir test de integración fallido en `Telemetria.Api.IntegrationTests` para `POST /api/auth/login` (Red).**
- [ ] **Step 2: Agregar paquete `BCrypt.Net-Next` en `Telemetria.Infraestructura`.**
- [ ] **Step 3: Implementar DTOs y contrato `IAutenticadorUsuarios`.**
- [ ] **Step 4: Implementar `AutenticadorUsuariosPostgreSql.cs` con consulta a PostgreSQL `usuarios` y validación de hash BCrypt.**
- [ ] **Step 5: Implementar `AuthController.cs` exponiendo `[HttpPost("login")]`.**
- [ ] **Step 6: Registrar servicios en DI y correr `dotnet test` (Green).**

---

### Task 6: Frontend - Cliente de Auth y Rediseño de `/login` de Producción
**Files:**
- Modify: `web/src/types/api.ts`
- Modify: `web/src/lib/apiClient.ts`
- Modify: `web/src/lib/auth.ts`
- Modify: `web/src/app/(auth)/login/page.tsx`

**Interfaces:**
- Consumes: Endpoint `POST /api/auth/login`, componentes `Button` e `Input`, `useToast()`.
- Produces: Flujo de login de producción seguro y estricto.

- [ ] **Step 1: Agregar interfaces `LoginApiRequest` y `LoginRespuestaApiDto` en `types/api.ts`.**
- [ ] **Step 2: Agregar `autenticarUsuario()` en `lib/apiClient.ts`.**
- [ ] **Step 3: Refactorizar `lib/auth.ts`:**
  - Eliminar conmutadores artificiales (`iniciarSesionComo`, `iniciarSesionInvitado`).
  - Implementar `iniciarSesion(email, password)` asíncrono con guardado en `localStorage`.
- [ ] **Step 4: Rediseñar completamente `web/src/app/(auth)/login/page.tsx`:**
  - Eliminar las tarjetas de 1-clic y botones de autocompletado de prueba.
  - Input `email` con placeholder descriptivo (`agarlati@apexlink.io`).
  - Input `password` con botón de visibilidad (ojo abrir/cerrar).
  - Checkbox "Recordar en esta cabina".
  - Botón `Button` con spinner `isLoading` y texto "Autenticando en boxes...".
  - Alerta de error estilizada con `aria-live="assertive"` ante fallo de credenciales.
  - Enlace a recuperación de contraseña.

---

### Task 7: Estandarización de Vistas Clave (Dashboard, Sessions, Perfil)
**Files:**
- Modify: `web/src/app/app/page.tsx` (Dashboard)
- Modify: `web/src/app/app/sessions/page.tsx`
- Modify: `web/src/app/app/perfil/page.tsx`

**Interfaces:**
- Consumes: `Skeleton`, `EmptyState`, `Tooltip`, `Badge`, `useToast`.
- Produces: Vistas consistentes, sin parpadeos y sin controles artificiales.

- [ ] **Step 1: Estandarizar `web/src/app/app/page.tsx` (Dashboard):**
  - Reemplazar textos de carga planos por `Skeleton` cards de métricas de telemetría y AI Race Coach.
  - Agregar tooltips explicativos a "Trail Braking", "Consistencia" y "Apex Rating".
- [ ] **Step 2: Estandarizar `web/src/app/app/sessions/page.tsx`:**
  - Mostrar `Skeleton` en la tabla de tandas mientras consulta a la API.
  - Integrar `EmptyState` cuando no haya tandas para un filtro.
  - Mejorar paginador indicando "Mostrando X de Y tandas oficiales".
- [ ] **Step 3: Estandarizar `web/src/app/app/perfil/page.tsx`:**
  - Eliminar el banner superior de "Conmutar perfil".
  - Mostrar exclusivamente la telemetría del piloto autenticado con estado de carga `Skeleton`.

---

### Task 8: Verificación End-to-End y Cierre
**Files:**
- Workspace global (`apex-link` y `apex-link-telemetry`).

- [ ] **Step 1: Ejecutar suite de pruebas completa en .NET (`dotnet test Telemetria.sln`).**
- [ ] **Step 2: Ejecutar compilación de Next.js (`npm --prefix web run build`) verificando 0 errores TypeScript.**
- [ ] **Step 3: Probar flujo de autenticación con `agarlati@apexlink.io` y con `asalas@apexlink.io`.**
- [ ] **Step 4: Probar logout, persistencia tras F5 y redirección forzosa al intentar entrar a `/app` deslogueado.**
- [ ] **Step 5: Inspeccionar `git diff` para asegurar cumplimiento estricto de `GEMINI.md`.**

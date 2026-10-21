# 🎪 Checklist de Puesta en Escena para la FAPPE

Guía operativa para el día de la presentación y montaje del stand del simulador.

---

## 1. Inventario de Hardware

| Ítem | Encargado | Estado | Notas |
| :--- | :--- | :--- | :--- |
| **PC Gamer / Laptop potente** | Dev 1 | [ ] | Con Assetto Corsa instalado y probado a 60 FPS estables. |
| **Volante y Pedalera** (G29 / T300 / similar) | Dev 1 | [ ] | Base, volante con soporte y cables de fuente y USB. |
| **Teléfono Android para Display** | Dev 2 | [ ] | Pantalla AMOLED preferente, batería al 100%, modo desarrollador ON. |
| **Soporte de celular para el volante** | Dev 2 | [ ] | Impresión 3D, soporte magnético o cinta doble faz de alta resistencia. |
| **Cable USB-C a USB-A (Largo, 1.5m - 2m)**| Dev 2 | [ ] | Cable reforzado con soporte de datos para que el giro del volante no tire del cable. |
| **Segunda Pantalla / Laptop para la Web**| Dev 3 | [ ] | Para que el público y jurado vean los gráficos sin tapar al piloto. |
| **Zapatilla / Prolongador eléctrico** | Todo el equipo| [ ] | Mínimo 4 tomas (PC, Monitor, Volante, Celular). |

---

## 2. Preparación del Software Pre-Evento

- [ ] **Modo Avión + Depuración USB activada** en el celular para que no entren llamadas ni notificaciones de WhatsApp durante la prueba.
- [ ] **Brillo de pantalla al máximo** y timeout de pantalla configurado en 30 minutos por seguridad (además de la API de WakeLock).
- [ ] **Cacheo offline de la PWA** para que cargue instantáneamente incluso si no hay conexión local.
- [ ] **Copia de seguridad en pendrive** con:
  - Repositorio completo con dependencias instaladas (`node_modules`).
  - Instalador de Platform-Tools de Android (ADB).
  - Vueltas grabadas de prueba (Mock Data) para modo demostración.

---

## 3. Guion de Demostración para el Jurado (Pitch de 3 Minutos)

1. **Minuto 1 (El Problema y la Solución):**
   - *"En el automovilismo profesional y el simracing de alto nivel, la telemetría en tiempo real define carreras. Desarrollamos un ecosistema completo de bajo costo que transforma cualquier simulador en una plataforma de competición profesional con pantalla de volante integrada y estación de telemetría de boxes."*
2. **Minuto 2 (Demostración en Vivo):**
   - Invitamos a un miembro del jurado (o manejamos nosotros):
   - Mostrar el funcionamiento de los **Rev LEDs y el delta de vuelta** en el volante por USB (destacar la latencia nula).
   - Mostrar en la segunda pantalla cómo el **ingeniero de pista** monitorea la aceleración, frenado y desgaste de neumáticos en vivo.
3. **Minuto 3 (Análisis Post-Sesión & Cierre):**
   - Cruzar la línea de meta:
   - Ir a la web en Next.js, abrir la vuelta recién terminada y mostrar la **gráfica de telemetría y el mapa de calor de la trazada**.
   - Comparar la vuelta contra el récord de la pista para evidenciar dónde se perdió tiempo.

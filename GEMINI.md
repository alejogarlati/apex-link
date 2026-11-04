# Reglas de Trabajo y Concurrencia

## Preservación estricta de avances del usuario
1. **Lectura fresca en disco:** Antes de modificar cualquier archivo, leé siempre su estado actual en disco (`read_file` o inspección de diff). Nunca asumas que el archivo sigue igual que en turnos anteriores.
2. **Respeto a cambios en vivo:** Si el usuario modificó código, rutas, nombres de archivos, assets o estilos (cambios no commiteados o recientes), esos avances son la verdad absoluta (*ground truth*). Jamás los reviertas, sobrescribas ni descartes.
3. **Verificación post-cambio:** Tras realizar cualquier edición, verificá el `git diff` del archivo para asegurar que los cambios que introdujo el usuario sigan intactos.

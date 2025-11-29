# Guía de Pruebas - Sistema de Notificaciones CopyVet

## Requisitos Previos

- Servidor XAMPP ejecutándose
- Base de datos CopyVet con tabla `notificaciones` creada
- Al menos dos usuarios creados en el sistema
- La aplicación React compilada y ejecutándose

## Test 1: Verificar Base de Datos

### Paso 1: Confirmar tabla existe

```sql
DESC notificaciones;
```

**Esperado:** Muestra las columnas de la tabla

### Paso 2: Verificar indices

```sql
SHOW INDEX FROM notificaciones;
```

**Esperado:** Muestra al menos dos índices:

- `idx_usuario_leida` (id_usuario, estado_leida)
- `idx_tipo_fecha` (tipo, fecha_evento)

---

## Test 2: Prueba de Notificación al Login

### Paso 1: Acceder a la aplicación

1. Navegar a `http://localhost/copyvet/appCopyVet/`
2. Click en "Login" o ir a `/user/login`

### Paso 2: Ingresar credenciales

- Email: `veterinario@example.com` (o cualquier usuario válido)
- Password: `[contraseña correcta]`

### Paso 3: Verificar generación de notificación

1. Esperar a ser redirigido a la página principal
2. Observar el ícono de campana (🔔) en la esquina superior derecha
3. El badge debe mostrar "1" (una notificación no leída)

### Paso 4: Ver la notificación

1. Click en el ícono de campana
2. Debe aparecer una notificación con:
   - Ícono: 🔐 (login)
   - Texto: "Usuario [Nombre] inició sesión"
   - Color: Azul (importancia normal)
   - Timestamp: hace unos segundos

### Paso 5: Marcar como leída

1. Click en la notificación
2. El punto rojo debe desaparecer
3. El badge debe cambiar a "0"
4. Debe aparecer un Snackbar verde confirmando

**Esperado:** ✅ Notificación se marca como leída correctamente

---

## Test 3: Prueba de Notificación de Cambio de Estado

### Paso 1: Preparar datos

1. Acceder como usuario con rol Veterinario/Administrador
2. Ir a Tickets (click en "Listas" → "Tickets")
3. Seleccionar un ticket existente O crear uno nuevo

### Paso 2: Cambiar estado del ticket

1. Click en el ticket para abrir detalles
2. Buscar el campo "Estado" (desplegable)
3. Cambiar a otro estado (ej: Abierto → En proceso)
4. Click en "Guardar" o "Actualizar"

### Paso 3: Verificar notificación generada

1. Esperar a que se guarde
2. Observar el ícono de campana
3. El badge debe incrementar en 1

### Paso 4: Ver detalles de la notificación

1. Click en el ícono de campana
2. Debe aparecer una notificación con:
   - Ícono: 🎫 (ticket)
   - Texto: "El ticket ha cambiado de estado: [Estado Anterior] → [Estado Nuevo]"
   - Responsable: [Tu usuario]
   - Importancia: Alta (rojo) si es "Urgente" o "En proceso", Normal (azul) si es otro

**Esperado:** ✅ Notificación de cambio de estado se genera correctamente

---

## Test 4: Filtrado en Panel de Notificaciones

### Paso 1: Generar múltiples notificaciones

1. Hacer login (genera notificación)
2. Cambiar estado de ticket (genera otra notificación)
3. Cambiar estado de otro ticket (genera otra)
4. Badge debe mostrar "3" (o más)

### Paso 2: Probar filtro "Todas"

1. Click en ícono de campana
2. Click en chip "Todas"
3. Deben mostrarse todas las notificaciones

### Paso 3: Probar filtro "No leídas"

1. Marcar una notificación como leída
2. Click en chip "No leídas"
3. Solo deben mostrarse las notificaciones sin leer
4. Badge debe mostrar solo las no leídas

**Esperado:** ✅ Filtros funcionan correctamente

---

## Test 5: Marcar Todas como Leídas

### Paso 1: Generar notificaciones

1. Hacer login (genera una)
2. Cambiar estado de ticket (genera otra)
3. Badge debe mostrar "2" (2 no leídas)

### Paso 2: Usar botón "Marcar todas como leídas"

1. Click en ícono de campana para abrir panel
2. Click en el ícono de doble check en la esquina superior derecha
3. Esperar confirmación

### Paso 3: Verificar

1. Badge debe cambiar a "0"
2. Chip "No leídas" debe mostrar "(0)"
3. Al actualizar la página, el badge sigue siendo "0"

**Esperado:** ✅ Todas las notificaciones se marcan como leídas

---

## Test 6: Auto-refresh de Notificaciones

### Paso 1: Preparar

1. Abrir dos pestañas de navegador (Tab A y Tab B)
2. Ambas logueadas con el mismo usuario
3. En ambas abrir el panel de notificaciones

### Paso 2: Generar notificación en Tab A

1. En Tab A, cambiar estado de un ticket
2. Esperar que aparezca notificación en Tab A (inmediato)

### Paso 3: Verificar auto-sync en Tab B

1. En Tab B, esperar máximo 30 segundos
2. El badge debe actualizarse automáticamente
3. Al abrir panel, debe mostrar la notificación

**Esperado:** ✅ Auto-refresh funciona cada 30 segundos

---

## Test 7: Visualización Responsive

### Paso 1: Pantalla de escritorio

1. Verificar que NotificationPanel es visible
2. Ícono de campana con badge visible
3. Panel abre correctamente

### Paso 2: Pantalla pequeña (mobile)

1. Redimensionar ventana a < 960px
2. NotificationPanel debe desaparecer o cambiar de posición
3. Badge aún accesible desde menú

**Esperado:** ✅ Responsive design funciona

---

## Test 8: Persistencia en Base de Datos

### Paso 1: Generar notificaciones

1. Login → genera notificación tipo "login"
2. Cambiar estado de ticket → genera notificación tipo "ticket_estado"

### Paso 2: Verificar en BD

```sql
SELECT * FROM notificaciones WHERE id_usuario = 1 ORDER BY fecha_evento DESC;
```

**Esperado:** Debe mostrar:

- Una notificación tipo "login" con estado_leida = 0
- Una notificación tipo "ticket_estado" con estado_leida = 0
- Ambas con fecha_evento reciente

### Paso 3: Marcar como leída en UI

1. Marcar una notificación como leída en la interfaz

### Paso 4: Verificar cambio en BD

```sql
SELECT * FROM notificaciones WHERE id_notificacion = X;
```

**Esperado:** `estado_leida` debe cambiar a 1

---

## Test 9: Internacionalización

### Paso 1: Verificar idioma español

1. Ícono de campana debe mostrar "Notificaciones"
2. Botón debe decir "Marcar como leída"
3. Filtro debe mostrar "No leídas"

### Paso 2: Cambiar a inglés

1. Click en selector de idioma (arriba a la derecha)
2. Seleccionar "English"
3. Volver a abrir panel de notificaciones

### Paso 3: Verificar traducción

1. Ícono campana debe mostrar "Notifications"
2. Botón debe decir "Mark as read"
3. Filtro debe mostrar "Unread"

**Esperado:** ✅ Textos se actualizan correctamente

---

## Test 10: Manejo de Errores

### Paso 1: Simular error de red

1. Abrir DevTools (F12)
2. Network tab → Throttling → Offline
3. Click en ícono de campana
4. Debe mostrar spinner de carga, luego error o retry

### Paso 2: Recuperación de error

1. Volver a Throttling → Online
2. Esperar auto-refresh (30s) o refrescar página
3. Las notificaciones deben cargarse

**Esperado:** ✅ Manejo graceful de errores de red

---

## Test 11: Seguridad - Notificaciones de Otro Usuario

### Paso 1: Obtener ID de notificación ajena

1. En BD: `SELECT id_notificacion FROM notificaciones WHERE id_usuario != 1 LIMIT 1;`
2. Anotar el ID (ej: 5)

### Paso 2: Intentar acceso directo como Usuario 1

1. Abrir console del navegador (F12)
2. Ejecutar:

```javascript
import NotificacionService from "./src/services/NotificacionService.js";
NotificacionService.get(5);
```

### Paso 3: Intentar marcar ajena como leída

```javascript
NotificacionService.marcarComoLeida(5, 1);
```

**Esperado:** ✅ Backend rechaza con error de autorización

---

## Test 12: Limpiar Notificaciones Antiguas

### Paso 1: Crear notificación antigua

```sql
INSERT INTO notificaciones
(tipo, descripcion, id_usuario, estado_leida, importancia, fecha_evento)
VALUES ('test', 'Notificación antigua', 1, TRUE, 'normal', DATE_SUB(NOW(), INTERVAL 31 DAY));
```

### Paso 2: Ejecutar limpieza

```php
$model = new NotificacionModel();
$model->limpiarAntiguas(30); // Elimina notificaciones leídas > 30 días
```

### Paso 3: Verificar eliminación

```sql
SELECT * FROM notificaciones WHERE tipo = 'test';
```

**Esperado:** ✅ Notificación antigua se eliminó

---

## Checklist de Validación Final

- [ ] Las notificaciones de login se generan automáticamente
- [ ] Las notificaciones de cambio de estado se generan automáticamente
- [ ] El badge muestra el contador correcto de no leídas
- [ ] Click en notificación la marca como leída
- [ ] Botón "Marcar todas como leídas" funciona
- [ ] Filtros "Todas" y "No leídas" funcionan
- [ ] Auto-refresh cada 30 segundos funciona
- [ ] Responsivo en móvil/tablet
- [ ] Traducciones en español e inglés correctas
- [ ] Datos persisten en BD
- [ ] Seguridad: no acceso a notificaciones ajenas
- [ ] Manejo de errores sin crashes

---

## Reportar Bugs

Si algo no funciona:

1. Abrir DevTools (F12)
2. Ir a Console y anotar errores
3. Ir a Network tab y verificar requests
4. Ir a Application → LocalStorage y verificar token
5. Reportar con screenshot de error

---

## Rollback (Si es necesario)

Si necesitas revertir los cambios:

### Archivo Index.php

Eliminar las líneas:

```php
require_once "models/NotificacionModel.php";
require_once "controllers/NotificacionController.php";
```

### Base de Datos

```sql
DROP TABLE IF EXISTS notificaciones;
```

### Archivos a Eliminar

- `/models/NotificacionModel.php`
- `/controllers/NotificacionController.php`
- `/appCopyVet/src/services/NotificacionService.js`
- `/appCopyVet/src/components/Notifications/` (carpeta completa)

### Revertir Header.jsx

Eliminar línea:

```javascript
import NotificationPanel from "../Notifications/NotificationPanel";
```

Y en el Toolbar, eliminar:

```jsx
<NotificationPanel />
```

---

## Performance Notes

### Métricas Esperadas

- Carga inicial del panel: < 500ms
- Auto-refresh cada 30s: < 100ms
- Marca como leída: < 200ms
- Animación badge: Suave a 60fps

### Optimizaciones Aplicadas

- Índices en BD para queries rápidas
- Polling de 30s (balance entre real-time y performance)
- Memoization en componentes React
- CSS optimizado para animaciones

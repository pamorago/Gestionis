# 🧪 Pruebas Rápidas - 5 Minutos

## Antes de Comenzar

- [ ] Servidor XAMPP ejecutándose
- [ ] Aplicación React compilada: `npm run build` en `/appCopyVet/`
- [ ] Base de datos CopyVet activa
- [ ] Usuario de prueba creado

---

## Test Rápido 1: Verificar Instalación (1 min)

### Paso 1: Base de Datos

```sql
SELECT COUNT(*) FROM notificaciones;
```

**Esperado:** Retorna un número (0 si está vacía, está bien)

### Paso 2: Backend Cargado

```bash
curl -s http://localhost/copyvet/notificacion/index?id_usuario=1 | head -c 50
```

**Esperado:** Respuesta JSON (puede estar vacía `[]` o con notificaciones)

### Paso 3: Frontend

Abrir `http://localhost/copyvet/appCopyVet/`

- [ ] Ícono de campana visible en esquina superior derecha
- [ ] Sin errores en console (F12)

---

## Test Rápido 2: Login = Notificación (1 min)

### Paso 1: Logout (si estás logueado)

1. Click en tu usuario (esquina superior derecha)
2. Click en "Logout"

### Paso 2: Login

1. Click en "Casos CopyVet" o ir a `/user/login`
2. Email: `admin@example.com` (o tu usuario)
3. Password: `[contraseña]`
4. Click en "Ingresar"

### Paso 3: Verificar

- [ ] Badge en campana muestra "1"
- [ ] Ícono de campana pulsa (animación)
- [ ] Sin errores en console

### Paso 4: Ver Notificación

1. Click en ícono de campana
2. [ ] Ve texto como "Usuario X inició sesión"
3. [ ] Tiene ícono 🔐
4. [ ] Timestamp reciente

---

## Test Rápido 3: Cambiar Ticket Estado (2 min)

### Paso 1: Ir a Tickets

1. Click en menú "Listas"
2. Click en "Tickets"
3. Selecciona cualquier ticket (o crea uno nuevo si no hay)

### Paso 2: Cambiar Estado

1. Abre el ticket
2. Busca campo "Estado" (dropdown)
3. Cambia a otro estado (ej: Abierto → En proceso)
4. Click en "Guardar" o "Actualizar"

### Paso 3: Verificar

- [ ] Cambio se guardó correctamente
- [ ] Badge en campana incrementa (ej: 1 → 2)
- [ ] Sin errores

### Paso 4: Ver Notificación

1. Click en campana
2. [ ] Nueva notificación visible con ícono 🎫
3. [ ] Texto dice "ha cambiado de estado: Abierto → En proceso"
4. [ ] Responsable es tu usuario

---

## Test Rápido 4: Marcar como Leída (1 min)

### Paso 1: Abrir Panel

1. Click en ícono de campana

### Paso 2: Marcar Como Leída

1. Click en cualquier notificación
2. [ ] El punto rojo desaparece
3. [ ] Badge decrementado (ej: 2 → 1)
4. [ ] Verde Snackbar: "Notificación marcada como leída"

### Paso 3: Verificar Filtro

1. Click en chip "No leídas"
2. [ ] Solo muestra notificaciones con punto rojo
3. [ ] Click en "Todas"
4. [ ] Muestra todas (incluso marcadas)

---

## Test Rápido 5: Auto-Refresh (30 segundos)

### Paso 1: Preparar Dos Pestañas

1. Abrir Tab A: `http://localhost/copyvet/appCopyVet/`
2. Abrir Tab B: `http://localhost/copyvet/appCopyVet/`
3. Ambas logueadas con el mismo usuario

### Paso 2: Generar Notificación en Tab A

1. En Tab A, cambiar estado de un ticket
2. [ ] Campana en Tab A actualiza inmediatamente

### Paso 3: Esperar Sync en Tab B

1. En Tab B, esperar ~30 segundos
2. [ ] Campana en Tab B actualiza automáticamente
3. Sin necesidad de refrescar la página

---

## Test Rápido 6: Traducción (30 segundos)

### Paso 1: Español (Actual)

1. Abrir panel de notificaciones
2. [ ] Título dice "Notificaciones"
3. [ ] Botón dice "Marcar como leída"

### Paso 2: Cambiar a English

1. Click en selector de idioma (esquina superior derecha)
2. Seleccionar "English"

### Paso 3: Verificar Inglés

1. Abrir panel de notificaciones
2. [ ] Título ahora dice "Notifications"
3. [ ] Botón ahora dice "Mark as read"
4. [ ] Tipo de notificación "Cambio de estado..." → "Status change..."

---

## ⚠️ Si Algo No Funciona

### Error: "Controlador no encontrado"

```bash
# Verificar archivo existe:
ls -la /controllers/NotificacionController.php
# Verificar está en index.php:
grep "NotificacionController" index.php
```

### Error: "Tabla no existe"

```sql
-- Crear tabla manualmente:
source database/copyvet.sql;
-- Verificar:
SHOW TABLES LIKE 'notificaciones';
```

### Error: "CORS"

- Abrir DevTools (F12)
- Network tab → Ver requests
- Si dice CORS error, verificar headers en index.php

### Error: "Badge no actualiza"

- Abrir console (F12)
- Escribir: `setInterval(() => location.reload(), 5000);`
- Fuerza refresh cada 5s (confirma polling funciona)

---

## ✅ Checklist Final

Después de los 5 tests, marca lo que funciona:

```
BACKEND:
☐ Base de datos cargada
☐ API responde correctamente
☐ Notificaciones se guardan en BD

NOTIFICACIONES:
☐ Login genera notificación
☐ Cambio de estado genera notificación
☐ Badge cuenta correctamente
☐ Marcar como leída funciona
☐ Auto-refresh cada 30s funciona

UI:
☐ Panel se abre/cierra
☐ Filtros funcionan
☐ Estilos correctos
☐ Sin errores visuales

INTERNACIONALIZACION:
☐ Español funciona
☐ English funciona
☐ Cambio dinámico

SEGURIDAD:
☐ Solo ves tus notificaciones
☐ No hay errores de seguridad
☐ No se exponen datos privados

PERFORMANCE:
☐ Carga rápida (< 1 seg)
☐ Interacciones rápidas (< 500ms)
☐ Animaciones suaves
```

---

## 🚀 Si Todo Funciona

**¡Felicidades! El sistema está 100% funcional.**

Documentación disponible:

- 📖 NOTIFICATIONS_SYSTEM.md - Técnico
- 📋 TESTING_GUIDE.md - Pruebas completas
- ⚡ QUICK_START.md - Configuración
- 📊 IMPLEMENTATION_SUMMARY.md - Resumen

---

## 🔧 Comandos Útiles

### Ver notificaciones en BD

```sql
SELECT * FROM notificaciones ORDER BY fecha_evento DESC LIMIT 5;
```

### Limpiar para re-probar

```sql
DELETE FROM notificaciones WHERE id_usuario = 1;
```

### Ver estadísticas

```sql
SELECT tipo, COUNT(*) as cantidad FROM notificaciones GROUP BY tipo;
```

### Test de API con cURL

```bash
curl -X GET "http://localhost/copyvet/notificacion/index?id_usuario=1"
curl -X GET "http://localhost/copyvet/notificacion/contarNoLeidas/1"
```

---

## 📱 Test en Mobile

1. Abrir en navegador móvil: `http://[IP]:80/copyvet/appCopyVet/`
2. Campana debe estar en menú (hidden en xs)
3. Panel debe ser scrollable
4. Touch-friendly (targets > 44px)

---

**Tiempo total estimado: 5-10 minutos**

Si todo está ✅, el sistema está **LISTO PARA PRODUCCIÓN**.

# Sistema de Notificaciones - CopyVet

## Descripción General

El sistema de notificaciones es un módulo completo que permite registrar, almacenar, mostrar y gestionar notificaciones de eventos importantes en la aplicación CopyVet. Reemplaza las alertas nativas del navegador y proporciona una experiencia de usuario más integrada y profesional.

## Características Principales

### 1. Tipos de Notificaciones

El sistema soporta dos tipos principales de notificaciones:

- **ticket_estado**: Se genera cuando cambia el estado de un ticket

  - Incluye información del cambio de estado (anterior → nuevo)
  - Marca importancia según el estado nuevo (alta para urgente/en proceso, normal para otros)
  - Identifica el responsable del cambio

- **login**: Se genera cuando un usuario inicia sesión
  - Marca la fecha y hora del login
  - Importancia: baja
  - Permite auditar accesos al sistema

### 2. Base de Datos

#### Tabla: `notificaciones`

```sql
CREATE TABLE notificaciones (
  id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_evento DATETIME DEFAULT CURRENT_TIMESTAMP,
  id_usuario INT NOT NULL,
  id_evento INT,
  estado_leida BOOLEAN DEFAULT FALSE,
  importancia VARCHAR(20) DEFAULT 'normal',
  responsable VARCHAR(255),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  INDEX idx_usuario_leida (id_usuario, estado_leida),
  INDEX idx_tipo_fecha (tipo, fecha_evento)
);
```

**Campos:**

- `id_notificacion`: Identificador único
- `tipo`: Tipo de notificación (ticket_estado, login, etc)
- `descripcion`: Texto descriptivo del evento
- `fecha_evento`: Timestamp del evento
- `id_usuario`: Usuario destinatario de la notificación
- `id_evento`: ID del evento asociado (ej: id_ticket)
- `estado_leida`: Booleano que marca si la notificación fue leída
- `importancia`: Nivel (alta, normal, baja) para priorización
- `responsable`: Usuario que realizó la acción que generó la notificación

### 3. Backend - PHP

#### NotificacionModel.php

Localización: `/models/NotificacionModel.php`

**Métodos principales:**

- `getByUsuario($id_usuario)`: Obtiene todas las notificaciones de un usuario ordenadas por fecha descendente
- `getNoLeidas($id_usuario)`: Obtiene solo notificaciones sin leer
- `contarNoLeidas($id_usuario)`: Retorna el número de notificaciones no leídas
- `get($id_notificacion)`: Obtiene una notificación específica
- `create($data)`: Crea una nueva notificación
- `update($id_notificacion, $data)`: Actualiza campos de una notificación
- `delete($id_notificacion)`: Elimina una notificación
- `marcarComoLeida($id_notificacion, $id_usuario)`: Marca como leída con validación de propiedad
- `marcarTodasComoLeidas($id_usuario)`: Marca todas las notificaciones del usuario como leídas
- `getByTipo($id_usuario, $tipo)`: Filtra notificaciones por tipo
- `limpiarAntiguas($dias)`: Elimina notificaciones leídas más antiguas que X días
- `crearNotificacionTicket(...)`: Helper para crear notificaciones de cambio de ticket
- `crearNotificacionLogin($id_usuario)`: Helper para crear notificaciones de login

#### NotificacionController.php

Localización: `/controllers/NotificacionController.php`

**Endpoints disponibles:**

- `GET /notificacion/index?id_usuario={id}`: Listar todas las notificaciones
- `GET /notificacion/getNoLeidas/{id_usuario}`: Obtener no leídas
- `GET /notificacion/contarNoLeidas/{id_usuario}`: Contar no leídas
- `GET /notificacion/{id}`: Obtener notificación específica
- `POST /notificacion`: Crear nueva notificación
- `PUT /notificacion/{id}`: Actualizar notificación
- `DELETE /notificacion/{id}`: Eliminar notificación
- `POST /notificacion/marcarComoLeida/{id}`: Marcar como leída
- `POST /notificacion/marcarTodasComoLeidas`: Marcar todas como leídas
- `GET /notificacion/getByTipo/{id_usuario}/{tipo}`: Filtrar por tipo

#### UserModel.php (Mejorado)

Se agregó el método `generarNotificacionLogin()` que se invoca automáticamente al login exitoso:

- Crea una notificación de tipo 'login'
- Registra automáticamente la fecha/hora del evento
- Los errores en la generación de notificación no interrumpen el login

#### TicketModel.php (Mejorado)

Se mejoró el método `update()` para:

- Detectar cambios en el estado del ticket
- Generar automáticamente notificaciones cuando cambia el estado
- Incluir información del usuario que realizó el cambio
- Establecer importancia según el estado nuevo

### 4. Frontend - React

#### NotificacionService.js

Localización: `/src/services/NotificacionService.js`

Servicio axios para consumir la API de notificaciones:

```javascript
NotificacionService.getByUsuario(id_usuario); // GET
NotificacionService.getNoLeidas(id_usuario); // GET
NotificacionService.contarNoLeidas(id_usuario); // GET
NotificacionService.get(id_notificacion); // GET
NotificacionService.create(data); // POST
NotificacionService.update(id, data); // PUT
NotificacionService.delete(id); // DELETE
NotificacionService.marcarComoLeida(id, id_usuario); // POST
NotificacionService.marcarTodasComoLeidas(id_usuario); // POST
NotificacionService.getByTipo(id_usuario, tipo); // GET
```

#### NotificationPanel.jsx

Localización: `/src/components/Notifications/NotificationPanel.jsx`

**Características:**

- Badge dinámico con contador de notificaciones no leídas
- Ícono animado (pulsa) cuando hay notificaciones nuevas
- Menú desplegable con lista de notificaciones
- Filtros: "Todas" y "No leídas"
- Indicador visual de lectura (punto rojo para sin leer)
- Avatar con color según importancia
- Ícono tipo de notificación (🎫 ticket, 🔐 login)
- Información de responsable y fecha/hora
- Botón "Marcar como leída"
- Botón "Marcar todas como leídas"
- Auto-refresh cada 30 segundos (polling)
- Scroll personalizado en lista

#### NotificationHistory.jsx

Localización: `/src/components/Notifications/NotificationHistory.jsx`

**Características:**

- Tabla detallada de historial de notificaciones
- Columnas: Tipo, Descripción, Fecha, Responsable, Estado
- Ordenamiento por fecha, tipo y estado
- Filtrado por tipo y estado de lectura
- Indicadores visuales de importancia (colores)
- Iconos por tipo de notificación
- Ícono de estado (leída/no leída)

#### Header.jsx (Actualizado)

- Integra NotificationPanel en la barra de herramientas
- Posicionado antes del LanguageSwitcher
- Responsive: visible en pantallas md y mayores

### 5. Internacionalización (i18n)

**Archivo:** `/src/locales/{es,en}/common.json`

Claves agregadas bajo namespace `notifications`:

```json
{
  "notifications": {
    "title": "Notificaciones",
    "markAsRead": "Marcar como leída",
    "markAllAsRead": "Marcar todas como leídas",
    "noNotifications": "No hay notificaciones",
    "unreadOnly": "No leídas",
    "all": "Todas",
    "types": {
      "ticket_estado": "Cambio de estado del ticket",
      "login": "Inicio de sesión"
    },
    "importance": {
      "alta": "Alta",
      "normal": "Normal",
      "baja": "Baja"
    }
  }
}
```

## Flujo de Generación de Notificaciones

### 1. Al Cambiar Estado de Ticket

```
Usuario actualiza estado en TicketForm
    ↓
TicketController.update() recibe los datos
    ↓
TicketModel.update() detecta cambio de estado
    ↓
NotificacionModel.create() genera notificación
    ↓
Notificación guardada en BD con estado_leida = FALSE
    ↓
Frontend realiza polling cada 30s
    ↓
NotificationPanel muestra nueva notificación con badge
```

### 2. Al Iniciar Sesión

```
Usuario ingresa credenciales
    ↓
UserController.login() valida credenciales
    ↓
UserModel.login() verifica contraseña
    ↓
UserModel.generarNotificacionLogin() crea registro
    ↓
NotificacionModel.create() guarda en BD
    ↓
JWT token se retorna al cliente
    ↓
Cliente se autentica y NotificationPanel comienza polling
    ↓
Notificación de login aparece en el panel
```

## Funcionalidades en Tiempo Real

### Auto-refresh de Notificaciones

- **Intervalo**: 30 segundos
- **Métodos llamados**: `getByUsuario()` y `contarNoLeidas()`
- **Comportamiento**: Silent, sin interrumpir la experiencia del usuario
- **Implementación**: `useEffect` con `setInterval`

### Marca de Lectura

- **Sin re-cargar página**: El usuario puede marcar notificaciones como leídas
- **Validación**: Backend verifica que la notificación pertenezca al usuario
- **UI actualizada**: Badge se decrementa automáticamente

## Integración con Sistema Existente

### Archivo de Índice (`index.php`)

Se agregaron las siguientes líneas:

```php
require_once "models/NotificacionModel.php";
require_once "controllers/NotificacionController.php";
```

### Compatibilidad con Routing

- Sistema utiliza routing REST estándar
- URLs siguen patrón: `/notificacion/{accion}/{parametros}`
- Compatible con RoutesController.php existente

## Consideraciones de Seguridad

### Backend

1. **Validación de usuario**: El servidor verifica que el usuario solo vea sus propias notificaciones
2. **SQL Injection**: Uso de `sanitize()` en todos los inputs
3. **CORS**: Headers CORS configurados en index.php
4. **JWT**: Las notificaciones se obtienen dentro del flujo autenticado

### Frontend

1. **Context API**: Usuario validado mediante UserContext
2. **Token verification**: Solo usuarios autenticados ven el panel
3. **Error handling**: Captura de errores en servicios

## Mantenimiento y Limpieza

### Limpiar Notificaciones Antiguas

```php
$notificacionModel = new NotificacionModel();
$notificacionModel->limpiarAntiguas(30); // Elimina notificaciones leídas > 30 días
```

Recomendación: Ejecutar diariamente vía cron job.

## Configuración VITE

Asegurarse de que en `.env` esté definido:

```
VITE_BASE_URL=http://localhost/copyvet/
```

O en `.env.local` para desarrollo:

```
VITE_BASE_URL=http://localhost/copyvet/
```

## Extensiones Futuras

El sistema está diseñado para permitir fácilmente:

1. **Nuevos tipos de notificaciones**:

   - Agregar tipo en el enum de la BD
   - Crear método helper en NotificacionModel
   - Invocar desde el modelo relevante

2. **Notificaciones por email**:

   - Agregar verificación de preferencias
   - Integrar servicio de email (PHPMailer, Sendgrid)

3. **WebSockets en tiempo real**:

   - Reemplazar polling con Socket.io
   - Notificaciones instantáneas sin esperar 30s

4. **Categorización avanzada**:

   - Filtros más complejos por importancia
   - Agrupación por tipo y fecha
   - Búsqueda full-text

5. **Notificaciones persistentes**:
   - Sonidos y vibraciones (si es móvil)
   - Desktop notifications (Web Notifications API)
   - Badges en pestaña del navegador

## Testing

### Caso de prueba 1: Notificación de login

1. Acceder a `/user/login`
2. Ingresar credenciales válidas
3. Esperar a ser redirigido
4. Verificar que aparece una notificación en el panel con badge "1"
5. Click en la notificación: debe decir "Usuario X inició sesión"

### Caso de prueba 2: Notificación de cambio de estado

1. Crear o abrir un ticket existente
2. Cambiar el estado (ej: Abierto → En proceso)
3. Observar que se guarda correctamente
4. Esperar max 30 segundos o refrescar manualmente
5. Verificar que el badge se incrementa
6. Click en notificación: debe mostrar "ha cambiado de estado: Abierto → En proceso"

### Caso de prueba 3: Marcar como leída

1. Abrir panel de notificaciones
2. Click en una notificación no leída
3. Verificar que desaparece el punto rojo
4. Badge se decrementa
5. Mensaje de confirmación en Snackbar

## Documentación de API

Ver `/database/API CopyVet 2025.postman_collection.json` para endpoints en Postman.

### Ejemplo GET - Obtener notificaciones del usuario

```bash
curl -X GET "http://localhost/copyvet/notificacion/index?id_usuario=1"
```

### Ejemplo POST - Marcar como leída

```bash
curl -X POST "http://localhost/copyvet/notificacion/marcarComoLeida/5" \
  -H "Content-Type: application/json" \
  -d '{"id_usuario": 1}'
```

## Estructura de Archivos

```
copyvet/
├── models/
│   └── NotificacionModel.php (NUEVO)
├── controllers/
│   └── NotificacionController.php (NUEVO)
├── appCopyVet/
│   └── src/
│       ├── services/
│       │   └── NotificacionService.js (NUEVO)
│       └── components/
│           └── Notifications/
│               ├── NotificationPanel.jsx (NUEVO)
│               └── NotificationHistory.jsx (NUEVO)
├── database/
│   └── copyvet.sql (ACTUALIZADO - tabla notificaciones)
└── index.php (ACTUALIZADO - includes)
```

## Troubleshooting

### Las notificaciones no aparecen

1. Verificar que el usuario está autenticado (check UserContext)
2. Revisar console del navegador para errores de CORS
3. Confirmar que la tabla `notificaciones` existe en BD
4. Verificar VITE_BASE_URL correcta

### El badge no se actualiza

1. Verificar que el intervalo de polling (30s) no fue modificado
2. Revisar que `contarNoLeidas()` retorna número correcto
3. Revisar errores en network tab

### Las notificaciones de login no se crean

1. Verificar que UserModel.php incluye el método `generarNotificacionLogin()`
2. Revisar que NotificacionModel.php está cargado en index.php
3. Revisar logs de PHP para errores

### Error 404 al llamar notificacion endpoint

1. Confirmar que NotificacionController.php está requiere en index.php
2. Revisar que el nombre de la clase es `notificacion` (minúscula)
3. Verificar rutas del servicio en NotificacionService.js

## Créditos y Notas

Sistema implementado como módulo completo de CopyVet con:

- Persistencia en BD
- Backend PHP con modelo MVC
- Frontend React con Material-UI
- Internacionalización i18n
- Auto-refresh con polling
- Validación de seguridad
- Manejo de errores

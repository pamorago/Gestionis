# 🏗️ Arquitectura del Sistema de Notificaciones

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENTE (React SPA)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Header Component                          │   │
│  │  ┌────────────────────────────────────────────────────────┐  │   │
│  │  │         NotificationPanel Component                  │  │   │
│  │  │  ┌───────────────┐  ┌──────────────┐ ┌──────────────┐ │  │   │
│  │  │  │  Badge Icon   │  │  Dropdown    │ │  Menu Items  │ │  │   │
│  │  │  │  (contador)   │  │   (30 items) │ │  (filter)    │ │  │   │
│  │  │  └───────────────┘  └──────────────┘ └──────────────┘ │  │   │
│  │  │        ↑                                                │  │   │
│  │  │    Auto-refresh cada 30s                               │  │   │
│  │  └────────────────────────────────────────────────────────┘  │   │
│  │                           ↑                                    │   │
│  │                           │ (polling)                          │   │
│  └───────────────────────────┼────────────────────────────────────┘   │
│                              │                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │         NotificacionService (axios client)                 │   │
│  │  - getByUsuario()          - contarNoLeidas()             │   │
│  │  - marcarComoLeida()       - marcarTodasComoLeidas()      │   │
│  │  - getByTipo()             - create/update/delete         │   │
│  └────────────────────┬───────────────────────────────────────┘   │
│                       │                                            │
│                       │ HTTP REST                                  │
│                       │                                            │
│                       ▼                                            │
│                    Network                                         │
│                       │                                            │
│                       ▼                                            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   CORS Headers        SSL/TLS            JWT Token
```

## Diagrama del Backend (PHP MVC)

```
┌────────────────────────────────────────────────────────────────┐
│                    SERVIDOR (PHP/Apache)                       │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              index.php (Punto de Entrada)               │  │
│  │  - require_once NotificacionModel.php                  │  │
│  │  - require_once NotificacionController.php             │  │
│  │  - CORS Headers                                        │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                     │
│                           │ request                             │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         RoutesController (Router)                       │  │
│  │  Mapea: /notificacion/[action]/[params]                │  │
│  │  Rutas:                                                 │  │
│  │    /notificacion/index?id_usuario=X                    │  │
│  │    /notificacion/contarNoLeidas/X                      │  │
│  │    /notificacion/marcarComoLeida/X                     │  │
│  │    /notificacion/{id}                                  │  │
│  │    /notificacion (POST, PUT, DELETE)                   │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │       NotificacionController (API Endpoints)            │  │
│  │  Métodos públicos:                                      │  │
│  │  - index()          - getNoLeidas($id)                 │  │
│  │  - contarNoLeidas($id)  - get($id)                     │  │
│  │  - create()         - update($id)                      │  │
│  │  - delete($id)      - marcarComoLeida($id)             │  │
│  │  - marcarTodasComoLeidas()  - getByTipo($id, $tipo)    │  │
│  │                                                         │  │
│  │  Responsabilidades:                                    │  │
│  │  - Validar entrada                                     │  │
│  │  - Llamar Model                                        │  │
│  │  - Formatear respuesta JSON                            │  │
│  │  - Manejar errores                                     │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                     │
│         ┌─────────────────┼─────────────────┐                  │
│         │                 │                 │                  │
│         ▼                 ▼                 ▼                  │
│  ┌─────────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ UserModel       │ │ TicketModel  │ │ otros Models │        │
│  │ .login()        │ │ .update()    │ │              │        │
│  │ (genera login   │ │ (genera      │ │              │        │
│  │  notification)  │ │  notif de    │ │              │        │
│  │                 │ │  estado)     │ │              │        │
│  └────────┬────────┘ └──────┬───────┘ └──────────────┘        │
│           │                 │                                   │
│           └────────┬────────┘                                   │
│                    │                                            │
│                    │ instancia                                  │
│                    ▼                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │       NotificacionModel (Business Logic)                │  │
│  │                                                         │  │
│  │  Métodos de Consulta:                                  │  │
│  │  - all()                  - get($id)                   │  │
│  │  - getByUsuario($id)      - getNoLeidas($id)           │  │
│  │  - contarNoLeidas($id)    - getByTipo($id, $tipo)      │  │
│  │                                                         │  │
│  │  Métodos de Mutación:                                  │  │
│  │  - create($data)      - update($id, $data)             │  │
│  │  - delete($id)        - marcarComoLeida($id, $user)    │  │
│  │  - marcarTodasComoLeidas($id)                          │  │
│  │                                                         │  │
│  │  Métodos Especiales:                                   │  │
│  │  - crearNotificacionTicket(...)                        │  │
│  │  - crearNotificacionLogin($id)                         │  │
│  │  - limpiarAntiguas($dias)                              │  │
│  │                                                         │  │
│  │  Validaciones:                                         │  │
│  │  - sanitize() en todos inputs                          │  │
│  │  - Verificación de propiedad del usuario               │  │
│  │  - Manejo de excepciones                               │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                     │
│                           │ prepared statements                 │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         MySqlConnect (Database Connection)              │  │
│  │  - executeSQL($query)                                   │  │
│  │  - executeSQL_DML($query)                               │  │
│  │  - executeSQL_DML_last($query) [retorna ID]             │  │
│  │  - sanitize($string)                                    │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                     │
│                           ▼                                     │
└────────────────────────────────────────────────────────────────┘
                           │
                           │ SQL
                           ▼
        ┌──────────────────────────────────────┐
        │   MySQL Server (copyvet database)     │
        │                                       │
        │   notificaciones table                │
        │   - id_notificacion (PK)             │
        │   - tipo                             │
        │   - descripcion                      │
        │   - fecha_evento                     │
        │   - id_usuario (FK)                  │
        │   - id_evento                        │
        │   - estado_leida                     │
        │   - importancia                      │
        │   - responsable                      │
        │                                       │
        │   Índices:                            │
        │   - idx_usuario_leida                │
        │   - idx_tipo_fecha                   │
        └──────────────────────────────────────┘
```

## Diagrama de Flujo - Notificación de Login

```
                        Usuario
                           │
                           │ email + password
                           ▼
                  UserController.login()
                           │
                           ├─ Validar credenciales
                           │
                           ▼
                  UserModel.login()
                           │
                  ├─ password_verify()
                  │
                  ├─ get($user_id) [usuario completo]
                  │
                  ├─ generarNotificacionLogin($usuario)
                  │        │
                  │        ├─ NotificacionModel instantiate
                  │        │
                  │        ├─ create($datosNotificacion)
                  │        │        │
                  │        │        ├─ INSERT INTO notificaciones
                  │        │        │        (tipo='login', ...)
                  │        │        │
                  │        │        └─ Return id_notificacion
                  │        │
                  │        └─ error_log() [si hay error]
                  │
                  ├─ JWT::encode() [token generation]
                  │
                  └─ Return JWT token
                           │
                           │ token
                           ▼
                        Cliente
                           │
                           │ Guardar token
                           │
                           ▼
                  UserContext.setUser(token)
                           │
                           │ Re-render
                           ▼
              NotificationPanel useEffect()
                           │
                           ├─ cargarNotificaciones()
                           │
                           ├─ NotificacionService.getByUsuario(id)
                           │
                           ├─ GET /notificacion/index?id_usuario=1
                           │
                           └─ Retorna array con notificación nueva
                                    │
                                    ▼
                           setNotificaciones([...])
                                    │
                                    ▼
                           setNoLeidas(1)
                                    │
                                    ▼
                     Badge muestra "1"
                     Ícono pulsa
```

## Diagrama de Flujo - Cambio de Estado de Ticket

```
                        Usuario
                           │
                     Abre formulario ticket
                           │
                      Estado: Abierto → En proceso
                           │
                      Click "Guardar"
                           │
                           ▼
                 TicketController.update($id)
                           │
                ├─ $request->getJSON()
                │
                └─ TicketModel.update($id, $data)
                           │
                    ├─ SELECT * FROM tickets WHERE id=$id
                    │        (obtiene estado_anterior = 'Abierto')
                    │
                    ├─ Deteccion: estado_anterior != estado_nuevo
                    │   ('Abierto' != 'En proceso') ✓ TRUE
                    │
                    ├─ UPDATE tickets SET id_estado='En proceso'
                    │
                    ├─ crearNotificacion()
                    │        │
                    │        ├─ NotificacionModel instantiate
                    │        │
                    │        ├─ Construir $datosNotificacion
                    │        │  - tipo: 'ticket_estado'
                    │        │  - descripcion: 'Abierto → En proceso'
                    │        │  - importancia: 'normal'
                    │        │  - responsable: 'Usuario X'
                    │        │  - id_usuario: [usuario creador/asignado]
                    │        │  - id_evento: $id_ticket
                    │        │
                    │        └─ create($datosNotificacion)
                    │                │
                    │                └─ INSERT INTO notificaciones
                    │                     (tipo, descripcion, ...)
                    │
                    └─ Return success
                           │
                           │ JSON respuesta
                           ▼
                    Frontend recibi respuesta
                           │
                    ├─ Guardar éxito
                    │
                    └─ Snackbar: "Cambio guardado"
                           │
                      Esperar ~30 segundos
                      (polling interval)
                           │
                           ▼
                NotificationPanel.setInterval()
                  cargarNotificaciones()
                           │
              NotificacionService.getByUsuario(id)
                           │
                 GET /notificacion/index?id_usuario=1
                           │
                    NotificacionController.index()
                           │
                NotificacionModel.getByUsuario(1)
                           │
                SELECT * FROM notificaciones
                WHERE id_usuario=1
                ORDER BY fecha_evento DESC
                           │
         [Incluye notif de 'Abierto → En proceso']
                           │
                           ▼
                    Frontend recibe array
                           │
              setNotificaciones([...])
              setNoLeidas(contador)
                           │
                           ▼
         Badge incrementa (ej: 1 → 2)
         Ícono pulsa
```

## Diagrama de Seguridad

```
┌────────────────────────────────────────────────────────┐
│                  Security Layers                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Frontend (React):                                    │
│  ┌──────────────────────────────────────────────────┐ │
│  │ - UserContext valida JWT                       │ │
│  │ - Solo usuarios autenticados ven panel         │ │
│  │ - No se exponen tokens en localStorage inseguro│ │
│  └──────────────────────────────────────────────────┘ │
│                      ↓                                 │
│  Transport (HTTP):                                    │
│  ┌──────────────────────────────────────────────────┐ │
│  │ - HTTPS en producción (SSL/TLS)                 │ │
│  │ - CORS headers validados                       │ │
│  │ - Headers de seguridad (HSTS, X-Frame-Options) │ │
│  └──────────────────────────────────────────────────┘ │
│                      ↓                                 │
│  Backend (PHP):                                       │
│  ┌──────────────────────────────────────────────────┐ │
│  │ - Validación de entrada (sanitize)             │ │
│  │ - Prepared statements (no SQL injection)        │ │
│  │ - Verificación de autorización (¿es tu notif?)│ │
│  │ - Error handling sin revelar detalles          │ │
│  └──────────────────────────────────────────────────┘ │
│                      ↓                                 │
│  Database (MySQL):                                    │
│  ┌──────────────────────────────────────────────────┐ │
│  │ - FK constraint en id_usuario                  │ │
│  │ - Índices para queries rápidas y seguras       │ │
│  │ - No almacena passwords de notificaciones      │ │
│  │ - Backup automático (recomendado)              │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Diagrama de Base de Datos

```
    usuarios                          notificaciones
    ┌─────────────┐                  ┌──────────────────────┐
    │ id_usuario  │◄─────────────────│ id_usuario (FK)      │
    │ nombre      │                  │                      │
    │ email       │                  │ id_notificacion (PK) │
    │ ...         │                  │ tipo                 │
    └─────────────┘                  │ descripcion          │
                                     │ fecha_evento         │
                                     │ id_evento            │
                                     │ estado_leida         │
                                     │ importancia          │
                                     │ responsable          │
                                     └──────────────────────┘
                                              ▲
                                              │
                                              │ Índices:
                                              │ - idx_usuario_leida
                                              │ - idx_tipo_fecha
```

## Diagrama de i18n

```
┌─────────────────────────────────────────────────────┐
│              i18next Architecture                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Header Language Selector                          │
│           │                                        │
│           ├─ Español ─────┐                       │
│           └─ English ────┐ │                       │
│                          │ │                       │
│                          ▼ ▼                       │
│                   useTranslation()                 │
│                   i18next.changeLanguage()         │
│                          │                         │
│         ┌────────────────┼────────────────┐        │
│         │                │                │        │
│         ▼                ▼                ▼        │
│  /locales/es/    /locales/en/     notification  │
│   common.json     common.json       strings     │
│                                                   │
│   {                {                            │
│    "notifications  "notifications             │
│     ": {           ": {                         │
│      "title":      "title":                     │
│      "Notif..."    "Notif..."                   │
│      "types": {    "types": {                   │
│       "ticket      "ticket                      │
│        _estado":   _estado":                     │
│       "Cambio..."  "Status"                      │
│    }}}}         }}}}                            │
│         │                │                       │
│         └────────────────┼─────────────────┐     │
│                          │                 │     │
│                          ▼                 ▼     │
│              NotificationPanel Component         │
│              Renderiza con t()                  │
│              language={es|en}                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Diagrama de Estados (NotificationPanel)

```
┌──────────────────────────────────────────────────┐
│          Notification Panel States               │
├──────────────────────────────────────────────────┤
│                                                  │
│                    INIT                         │
│                     │                           │
│                     │ useEffect                 │
│                     │ cargarNotificaciones()    │
│                     ▼                           │
│              ┌────────────────┐                │
│              │ LOADING        │                │
│              │ setLoading=T   │                │
│              └────────┬───────┘                │
│                       │ API response           │
│                       ▼                        │
│              ┌────────────────┐                │
│              │ LOADED         │                │
│              │ setLoading=F   │                │
│              │ setNotif=[...]  │               │
│              │ setNoLeidas=N   │               │
│              └────────┬───────┘                │
│                       │                        │
│       ┌───────────────┼───────────────┐        │
│       │               │               │        │
│       ▼               ▼               ▼        │
│   Click notif   Filter cambio   Polling      │
│   │             │               │             │
│   ▼             ▼               ▼             │
│ MARKING      FILTERING      REFRESHING       │
│ │            │               │               │
│ ▼            ▼               ▼               │
│ API          UI update   setTimeout()        │
│ │            │               │               │
│ └─────┬──────┘               │               │
│       │                       │               │
│       │◄──────────────────────┘               │
│       │                                       │
│       ▼                                       │
│   IDLE (listo para próximo evento)           │
│                                              │
│   Polling cada 30s ────────┐                 │
│                            │                 │
│                            ▼                 │
│                     REFRESHING               │
│                                              │
└──────────────────────────────────────────────┘
```

---

Este diagrama muestra cómo todos los componentes trabajan juntos para entregar un sistema de notificaciones robusto, seguro y performante.

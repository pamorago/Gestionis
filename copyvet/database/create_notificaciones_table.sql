-- Script para crear tabla notificaciones (si no existe)

USE copyvet;

-- Crear tabla si no existe
CREATE TABLE IF NOT EXISTS notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_evento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    id_evento INT NULL,
    estado_leida BOOLEAN NOT NULL DEFAULT FALSE,
    importancia VARCHAR(20) DEFAULT 'normal',
    responsable VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_usuario_leida ON notificaciones(id_usuario, estado_leida);
CREATE INDEX IF NOT EXISTS idx_tipo_fecha ON notificaciones(tipo, fecha_evento);

-- Insertar datos de prueba (solo si no existen)
INSERT INTO notificaciones (tipo, descripcion, fecha_evento, id_usuario, id_evento, estado_leida, importancia, responsable) 
SELECT 'ticket_estado', 'El ticket #1 ha cambiado de estado: Abierto → En proceso', DATE_SUB(NOW(), INTERVAL 12 HOUR), 3, 1, FALSE, 'alta', 'Carlos Méndez'
WHERE NOT EXISTS (SELECT 1 FROM notificaciones WHERE tipo='ticket_estado' AND id_usuario=3 AND id_evento=1 LIMIT 1);

INSERT INTO notificaciones (tipo, descripcion, fecha_evento, id_usuario, id_evento, estado_leida, importancia, responsable) 
SELECT 'ticket_estado', 'El ticket #1 ha cambiado de estado: Abierto → En proceso', DATE_SUB(NOW(), INTERVAL 12 HOUR), 1, 1, FALSE, 'alta', 'Carlos Méndez'
WHERE NOT EXISTS (SELECT 1 FROM notificaciones WHERE tipo='ticket_estado' AND id_usuario=1 AND id_evento=1 LIMIT 1);

INSERT INTO notificaciones (tipo, descripcion, fecha_evento, id_usuario, id_evento, estado_leida, importancia, responsable) 
SELECT 'ticket_estado', 'El ticket #2 ha cambiado de estado: En proceso → Cerrado', DATE_SUB(NOW(), INTERVAL 6 HOUR), 4, 2, TRUE, 'normal', 'Ana Gómez'
WHERE NOT EXISTS (SELECT 1 FROM notificaciones WHERE tipo='ticket_estado' AND id_usuario=4 AND id_evento=2 LIMIT 1);

INSERT INTO notificaciones (tipo, descripcion, fecha_evento, id_usuario, id_evento, estado_leida, importancia, responsable) 
SELECT 'ticket_estado', 'El ticket #2 ha cambiado de estado: En proceso → Cerrado', DATE_SUB(NOW(), INTERVAL 6 HOUR), 2, 2, TRUE, 'normal', 'Ana Gómez'
WHERE NOT EXISTS (SELECT 1 FROM notificaciones WHERE tipo='ticket_estado' AND id_usuario=2 AND id_evento=2 LIMIT 1);

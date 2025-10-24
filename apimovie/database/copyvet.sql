-- ======================================================
-- SCRIPT SQL FINAL - SISTEMA DE TICKETS VETERINARIA
-- ======================================================

CREATE DATABASE IF NOT EXISTS copyvet;
USE copyvet;

-- ======================================================
-- TABLA: roles
-- ======================================================
CREATE TABLE roles (
    id_rol INT(11) PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50)
) ENGINE=InnoDB;

INSERT INTO roles (nombre_rol) VALUES 
('Administrador'),
('Técnico'),
('Cliente');

-- ======================================================
-- TABLA: usuarios
-- ======================================================
CREATE TABLE usuarios (
    id_usuario INT(11) PRIMARY KEY AUTO_INCREMENT,
    nombre_completo VARCHAR(100),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    id_rol INT(11),
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
) ENGINE=InnoDB;

INSERT INTO usuarios (nombre_completo, correo, telefono, id_rol) VALUES
('Laura Ramírez', 'laura.ramirez@copyvet.com', '8888-1111', 1),
('Carlos Méndez', 'carlos.mendez@copyvet.com', '8888-2222', 2),
('Ana Gómez', 'ana.gomez@copyvet.com', '8888-3333', 2),
('Luis Pérez', 'luis.perez@copyvet.com', '8888-4444', 2),
('María López', 'maria.lopez@gmail.com', '8888-5555', 3),
('Pedro Jiménez', 'pedro.jimenez@gmail.com', '8888-6666', 3);


-- ======================================================
-- TABLA: mascotas
-- ======================================================
CREATE TABLE mascotas (
    id_mascota INT(11) PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    edad INT(11),
    especie VARCHAR(50),
    raza VARCHAR(50),
    id_responsable INT(11),
    nombre_responsable VARCHAR(100),
    correo_responsable VARCHAR(100),
    telefono_responsable VARCHAR(20)
) ENGINE=InnoDB;

INSERT INTO mascotas (nombre, edad, especie, raza, id_responsable, nombre_responsable, correo_responsable, telefono_responsable) VALUES
('Max', 3, 'Perro', 'Labrador', 5, 'María López', 'maria.lopez@gmail.com', '8888-5555'),
('Luna', 2, 'Gato', 'Siamés', 6, 'Pedro Jiménez', 'pedro.jimenez@gmail.com', '8888-6666'),
('Rocky', 5, 'Perro', 'Bulldog', 5, 'María López', 'maria.lopez@gmail.com', '8888-5555'),
('Milo', 1, 'Conejo', 'Mini Lop', 6, 'Pedro Jiménez', 'pedro.jimenez@gmail.com', '8888-6666');


-- ======================================================
-- TABLA: sla
-- ======================================================
CREATE TABLE sla (
    id_sla INT(11) PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(100),
    tiempo_minutos INT(11),
    tiempo_resolucion INT(11)
) ENGINE=InnoDB;
INSERT INTO sla (descripcion, tiempo_minutos, tiempo_resolucion) VALUES
('Urgente', 10, 240),
('Alta Prioridad', 30, 480),
('Normal', 60, 1440),
('Baja Prioridad', 120, 2880);

-- ======================================================
-- TABLA: categorias
-- ======================================================
CREATE TABLE categorias (
    id_categoria INT(11) PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(50),
    id_sla INT(11),
    FOREIGN KEY (id_sla) REFERENCES sla(id_sla)
) ENGINE=InnoDB;

INSERT INTO categorias (nombre_categoria, id_sla) VALUES
('Vacunación', 3),
('Cirugía menor', 2),
('Desparasitación', 4),
('Consulta general', 3);
-- ======================================================
-- TABLA: estadosticket
-- ======================================================
CREATE TABLE estadosticket (
    id_estado INT(11) PRIMARY KEY AUTO_INCREMENT,
    nombre_estado VARCHAR(50)
) ENGINE=InnoDB;

INSERT INTO estadosticket (nombre_estado) VALUES
('Abierto'),
('En proceso'),
('Cerrado'),
('Cancelado');
-- ======================================================
-- TABLA: tickets
-- ======================================================
CREATE TABLE tickets (
    id_ticket INT(11) PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100),
    descripcion TEXT,
    fecha_creacion DATETIME,
    fecha_cita DATETIME,
    id_estado INT(11),
    id_categoria INT(11),
    id_mascota INT(11),
    id_creado_por_usuario INT(11),
    id_asignado_a_usuario INT(11),
    FOREIGN KEY (id_estado) REFERENCES estadosticket(id_estado),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_mascota) REFERENCES mascotas(id_mascota),
    FOREIGN KEY (id_creado_por_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_asignado_a_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB;

INSERT INTO tickets (titulo, descripcion, fecha_creacion, fecha_cita, id_estado, id_categoria, id_mascota, id_creado_por_usuario, id_asignado_a_usuario) VALUES
('Vacunación anual para Max', 'Aplicar vacuna antirrábica y revisión general', '2025-10-01 09:00:00', '2025-10-03 10:00:00', 1, 1, 1, 5, 2),
('Revisión quirúrgica de Luna', 'Revisar sutura tras operación reciente', '2025-10-05 11:00:00', '2025-10-07 14:00:00', 2, 2, 2, 6, 3),
('Desparasitación de Rocky', 'Aplicar tratamiento oral y tópico', '2025-10-08 08:30:00', '2025-10-09 09:00:00', 1, 3, 3, 5, 4),
('Consulta general para Milo', 'Chequeo anual, peso y limpieza de orejas', '2025-10-10 13:00:00', '2025-10-12 10:30:00', 3, 4, 4, 6, 3),
('Vacunación adicional', 'Vacuna contra parvovirus', '2025-10-11 10:00:00', '2025-10-13 09:00:00', 1, 1, 1, 5, 2);

-- ======================================================
-- TABLA: historico (antes seguimiento)
-- ======================================================
CREATE TABLE historico (
    id_historico INT(11) PRIMARY KEY AUTO_INCREMENT,
    id_ticket INT(11),
    fecha DATETIME,
    comentario TEXT,
    estado VARCHAR(50),
    id_usuario INT(11),
    FOREIGN KEY (id_ticket) REFERENCES tickets(id_ticket),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB;

INSERT INTO historico (id_ticket, fecha, comentario, estado, id_usuario) VALUES
(1, '2025-10-01 09:30:00', 'Ticket creado por cliente', 'Abierto', 5),
(1, '2025-10-02 10:00:00', 'Asignado a técnico Carlos Méndez', 'En proceso', 1),
(2, '2025-10-05 11:30:00', 'Ticket creado y asignado a Ana Gómez', 'En proceso', 6),
(3, '2025-10-08 08:45:00', 'Cliente solicita revisión adicional', 'Abierto', 5),
(4, '2025-10-10 14:00:00', 'Consulta completada y cerrada', 'Cerrado', 3),
(5, '2025-10-11 11:00:00', 'Vacunación pendiente', 'Abierto', 5);


-- ======================================================
-- Vistas paar vete 
-- ======================================================
-- 🔹 VISTA: Listado de Técnicos
CREATE OR REPLACE VIEW vista_tecnicos AS
SELECT 
    u.id_usuario AS id_tecnico,
    u.nombre_completo AS nombre_tecnico,
    u.correo,
    COUNT(t.id_ticket) AS tickets_asignados
FROM usuarios u
LEFT JOIN tickets t ON u.id_usuario = t.id_asignado_a_usuario
WHERE u.id_rol = 2
GROUP BY u.id_usuario;

-- 🔹 VISTA: Detalle de Técnico
CREATE OR REPLACE VIEW vista_detalle_tecnico AS
SELECT 
    u.id_usuario AS id_tecnico,
    u.nombre_completo,
    u.correo,
    u.telefono,
    COUNT(t.id_ticket) AS total_tickets,
    SUM(CASE WHEN e.nombre_estado = 'Cerrado' THEN 1 ELSE 0 END) AS tickets_cerrados,
    SUM(CASE WHEN e.nombre_estado = 'En proceso' THEN 1 ELSE 0 END) AS tickets_en_proceso
FROM usuarios u
LEFT JOIN tickets t ON u.id_usuario = t.id_asignado_a_usuario
LEFT JOIN estadosticket e ON e.id_estado = t.id_estado
WHERE u.id_rol = 2
GROUP BY u.id_usuario;

-- 🔹 VISTA: Listado de Categorías
CREATE OR REPLACE VIEW vista_categorias AS
SELECT 
    c.id_categoria,
    c.nombre_categoria,
    s.descripcion AS sla_tipo,
    CONCAT(s.tiempo_minutos, ' min / ', s.tiempo_resolucion, ' min') AS tiempos_sla
FROM categorias c
JOIN sla s ON c.id_sla = s.id_sla;

-- 🔹 VISTA: Detalle de Categoría
CREATE OR REPLACE VIEW vista_detalle_categoria AS
SELECT 
    c.id_categoria,
    c.nombre_categoria,
    s.descripcion AS sla_descripcion,
    s.tiempo_minutos,
    s.tiempo_resolucion
FROM categorias c
JOIN sla s ON c.id_sla = s.id_sla;

-- 🔹 VISTA: Listado de Tickets (para todos los roles)
CREATE OR REPLACE VIEW vista_tickets AS
SELECT 
    t.id_ticket,
    t.titulo,
    e.nombre_estado,
    c.nombre_categoria,
    m.nombre AS mascota,
    u1.nombre_completo AS creado_por,
    u2.nombre_completo AS asignado_a,
    t.fecha_creacion,
    t.fecha_cita
FROM tickets t
JOIN estadosticket e ON e.id_estado = t.id_estado
JOIN categorias c ON c.id_categoria = t.id_categoria
JOIN mascotas m ON m.id_mascota = t.id_mascota
JOIN usuarios u1 ON u1.id_usuario = t.id_creado_por_usuario
JOIN usuarios u2 ON u2.id_usuario = t.id_asignado_a_usuario;

-- 🔹 VISTA: Detalle de Ticket (con SLA)
CREATE OR REPLACE VIEW vista_detalle_ticket AS
SELECT 
    t.id_ticket,
    t.titulo,
    t.descripcion,
    e.nombre_estado,
    c.nombre_categoria,
    s.descripcion AS sla_tipo,
    s.tiempo_minutos,
    s.tiempo_resolucion,
    u1.nombre_completo AS cliente,
    u2.nombre_completo AS tecnico_asignado,
    m.nombre AS mascota,
    m.especie,
    m.raza,
    t.fecha_creacion,
    t.fecha_cita
FROM tickets t
JOIN estadosticket e ON e.id_estado = t.id_estado
JOIN categorias c ON c.id_categoria = t.id_categoria
JOIN sla s ON s.id_sla = c.id_sla
JOIN usuarios u1 ON u1.id_usuario = t.id_creado_por_usuario
JOIN usuarios u2 ON u2.id_usuario = t.id_asignado_a_usuario
JOIN mascotas m ON m.id_mascota = t.id_mascota;

-- 🔹 VISTA: Vista de Asignaciones (para tablero o calendario)
CREATE OR REPLACE VIEW vista_asignaciones AS
SELECT 
    t.id_ticket,
    t.titulo,
    c.nombre_categoria,
    e.nombre_estado,
    t.fecha_cita,
    TIMESTAMPDIFF(MINUTE, NOW(), t.fecha_cita) AS minutos_restantes,
    u2.nombre_completo AS tecnico_asignado
FROM tickets t
JOIN categorias c ON c.id_categoria = t.id_categoria
JOIN estadosticket e ON e.id_estado = t.id_estado
JOIN usuarios u2 ON u2.id_usuario = t.id_asignado_a_usuario
ORDER BY t.fecha_cita ASC;

-- ======================================================
-- Select segun el rol
-- ======================================================

-- 🔸 ADMINISTRADOR: Ver todos los tickets
SELECT * FROM vista_tickets;

-- 🔸 CLIENTE: Ver solo tickets creados por él
-- (Reemplazar ? por el id del usuario logueado)
SELECT * FROM vista_tickets WHERE cliente = (
    SELECT nombre_completo FROM usuarios WHERE id_usuario = ?
);

-- 🔸 TÉCNICO: Ver solo tickets asignados a él
SELECT * FROM vista_tickets WHERE tecnico = (
    SELECT nombre_completo FROM usuarios WHERE id_usuario = ?
);

-- 🔸 DETALLE de ticket (para vista individual)
SELECT * FROM vista_detalle_ticket WHERE id_ticket = ?;

-- 🔸 LISTADO de técnicos
SELECT * FROM vista_tecnicos;

-- 🔸 DETALLE de técnico
SELECT * FROM vista_detalle_tecnico WHERE id_tecnico = ?;

-- 🔸 LISTADO de categorías
SELECT * FROM vista_categorias;

-- 🔸 DETALLE de categoría
SELECT * FROM vista_detalle_categoria WHERE id_categoria = ?;

-- 🔸 VISTA de asignaciones por técnico
SELECT * FROM vista_asignaciones WHERE tecnico_asignado = (
    SELECT nombre_completo FROM usuarios WHERE id_usuario = ?
);
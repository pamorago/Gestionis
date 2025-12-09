-- ======================================================
-- SCRIPT SQL FINAL - SISTEMA DE TICKETS VETERINARIA
-- ======================================================
CREATE DATABASE IF NOT EXISTS copyvet;

USE copyvet;

-- Desactivar verificaciones de claves foráneas
SET
    FOREIGN_KEY_CHECKS = 0;

-- Eliminar tablas existentes en orden inverso (debido a las relaciones)
DROP TABLE IF EXISTS historico;

DROP TABLE IF EXISTS ticketimage;

DROP TABLE IF EXISTS tickets;

DROP TABLE IF EXISTS mascotas;

DROP TABLE IF EXISTS veterinario_especialidades;

DROP TABLE IF EXISTS categoria_especialidades;

DROP TABLE IF EXISTS categoria_etiquetas;

DROP TABLE IF EXISTS especialidades;

DROP TABLE IF EXISTS etiquetas;

DROP TABLE IF EXISTS categorias;

DROP TABLE IF EXISTS sla;

DROP TABLE IF EXISTS estadosticket;

DROP TABLE IF EXISTS usuarios;

DROP TABLE IF EXISTS roles;

DROP TABLE IF EXISTS notificaciones;

-- ======================================================
-- TABLA: roles
-- ======================================================
CREATE TABLE
    roles (
        id_rol INT (11) PRIMARY KEY AUTO_INCREMENT,
        nombre_rol VARCHAR(50)
    ) ENGINE = InnoDB;

INSERT INTO
    roles (nombre_rol)
VALUES
    ('Administrador'),
    ('Veterinario'),
    ('Asistente'),
    ('Cliente');

-- ======================================================
-- TABLA: usuarios
-- ======================================================
CREATE TABLE
    usuarios (
        id_usuario INT (11) PRIMARY KEY AUTO_INCREMENT,
        nombre_completo VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        id_rol INT (11),
        estado BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (id_rol) REFERENCES roles (id_rol)
    ) ENGINE = InnoDB;

INSERT INTO
    usuarios (
        nombre_completo,
        email,
        password,
        telefono,
        id_rol,
        estado
    )
VALUES
    (
        'Root Admin',
        'admin@copyvet.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '2456-7891',
        1,
        TRUE
    ), -- Admin - password: 123456
    (
        'Carlos Méndez',
        'carlos.mendez@copyvet.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '8712-3456',
        2,
        TRUE
    ), -- Veterinario Carlos - password: 123456
    (
        'Ana Gómez',
        'ana.gomez@copyvet.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '7234-5678',
        2,
        TRUE
    ), -- Veterinario Ana - password: 123456
    (
        'Ricardo Soto',
        'ricardo.soto@copyvet.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '6345-2891',
        2,
        TRUE
    ), -- Veterinario Ricardo - password: 123456
    (
        'Sofia Torres',
        'sofia.torres@copyvet.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '8923-4567',
        2,
        TRUE
    ), -- Veterinario Sofia - password: 123456
    (
        'Mario Castro',
        'mario.castro@copyvet.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '7156-8923',
        2,
        TRUE
    ), -- Veterinario Mario - password: 123456
    (
        'Luis Pérez',
        'luis.perez@copyvet.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '6478-1234',
        3,
        TRUE
    ), -- Asistente Luis - password: 123456
    (
        'Patricia Morales',
        'patricia.morales@copyvet.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '8234-5679',
        3,
        TRUE
    ), -- Asistente Patricia - password: 123456
    (
        'Jorge Fernández',
        'jorge.fernandez@copyvet.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '7891-2345',
        3,
        TRUE
    ), -- Asistente Jorge - password: 123456
    (
        'Daniela Ruiz',
        'daniela.ruiz@copyvet.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '6123-8945',
        3,
        TRUE
    ), -- Asistente Daniela - password: 123456
    (
        'Miguel Ángel Cruz',
        'miguel.cruz@copyvet.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '8567-3421',
        3,
        TRUE
    ), -- Asistente Miguel - password: 123456
    (
        'María López',
        'maria.lopez@gmail.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '7345-6789',
        4,
        TRUE
    ), -- Cliente María - password: 123456
    (
        'Pedro Jiménez',
        'pedro.jimenez@gmail.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '6891-2347',
        4,
        TRUE
    ), -- Cliente Pedro - password: 123456
    (
        'Carmen Rojas',
        'carmen.rojas@gmail.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '8912-4568',
        4,
        TRUE
    ), -- Cliente Carmen - password: 123456
    (
        'Juan Vargas',
        'juan.vargas@gmail.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '7234-8916',
        4,
        TRUE
    ), -- Cliente Juan - password: 123456
    (
        'Ana Martinez',
        'ana.martinez@gmail.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '6456-1237',
        4,
        TRUE
    ), -- Cliente Ana Martinez - password: 123456
    (
        'Roberto Sánchez',
        'roberto.sanchez@gmail.com',
        '$2y$10$sOpWtrplKHktfSrEsBhYDOCrDH.mS3jkVh8odd6qRGI0NxIEU/EwO',
        '8678-9123',
        4,
        TRUE
    );

-- Cliente Roberto - password: 123456
-- ======================================================
-- TABLA: mascotas
-- ======================================================
CREATE TABLE
    mascotas (
        id_mascota INT (11) PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(50),
        edad INT (11),
        especie VARCHAR(50),
        raza VARCHAR(50),
        id_responsable INT (11),
        nombre_responsable VARCHAR(100),
        correo_responsable VARCHAR(100),
        telefono_responsable VARCHAR(20)
    ) ENGINE = InnoDB;

INSERT INTO
    mascotas (
        nombre,
        edad,
        especie,
        raza,
        id_responsable,
        nombre_responsable,
        correo_responsable,
        telefono_responsable
    )
VALUES
    (
        'Max',
        3,
        'Perro',
        'Labrador',
        5,
        'María López',
        'maria.lopez@gmail.com',
        '8888-5555'
    ),
    (
        'Luna',
        2,
        'Gato',
        'Siamés',
        10,
        'Carmen Rojas',
        'carmen.rojas@gmail.com',
        '8888-1010'
    ),
    (
        'Rocky',
        5,
        'Perro',
        'Bulldog',
        11,
        'Juan Vargas',
        'juan.vargas@gmail.com',
        '8888-1212'
    ),
    (
        'Milo',
        1,
        'Conejo',
        'Mini Lop',
        6,
        'Pedro Jiménez',
        'pedro.jimenez@gmail.com',
        '8888-6666'
    ),
    (
        'Nina',
        4,
        'Gato',
        'Persa',
        12,
        'Ana Martinez',
        'ana.martinez@gmail.com',
        '8888-1414'
    ),
    (
        'Toby',
        2,
        'Perro',
        'Golden Retriever',
        13,
        'Roberto Sánchez',
        'roberto.sanchez@gmail.com',
        '8888-1616'
    ),
    (
        'Bella',
        3,
        'Gato',
        'Maine Coon',
        10,
        'Carmen Rojas',
        'carmen.rojas@gmail.com',
        '8888-1010'
    ),
    (
        'Zeus',
        5,
        'Perro',
        'Pastor Alemán',
        11,
        'Juan Vargas',
        'juan.vargas@gmail.com',
        '8888-1212'
    ),
    (
        'Lucas',
        2,
        'Perro',
        'Poodle',
        12,
        'Ana Martinez',
        'ana.martinez@gmail.com',
        '8888-1414'
    ),
    (
        'Coco',
        1,
        'Ave',
        'Loro Gris',
        13,
        'Roberto Sánchez',
        'roberto.sanchez@gmail.com',
        '8888-1616'
    );

-- ======================================================
-- TABLA: sla
-- ======================================================
CREATE TABLE
    sla (
        id_sla INT (11) PRIMARY KEY AUTO_INCREMENT,
        descripcion VARCHAR(100),
        tiempo_minutos INT (11),
        tiempo_resolucion INT (11)
    ) ENGINE = InnoDB;

INSERT INTO
    sla (descripcion, tiempo_minutos, tiempo_resolucion)
VALUES
    ('Urgente', 10, 120),
    ('Alta Prioridad', 30, 240),
    ('Normal', 60, 480),
    ('Baja Prioridad', 120, 720);

-- ======================================================
-- TABLA: categorias
-- ======================================================
CREATE TABLE
    categorias (
        id_categoria INT (11) PRIMARY KEY AUTO_INCREMENT,
        nombre_categoria VARCHAR(50),
        id_sla INT (11),
        FOREIGN KEY (id_sla) REFERENCES sla (id_sla)
    ) ENGINE = InnoDB;

INSERT INTO
    categorias (nombre_categoria, id_sla)
VALUES
    ('Vacunación', 3),
    ('Cirugía menor', 2),
    ('Desparasitación', 4),
    ('Consulta general', 3),
    ('Emergencia', 1), -- Urgente
    ('Cirugía mayor', 1), -- Urgente
    ('Especies Exóticas', 2),
    ('Dermatología', 3),
    ('Traumatología', 2),
    ('Control rutinario', 4);

-- ======================================================
-- TABLA: etiquetas
-- ======================================================
CREATE TABLE
    etiquetas (
        id_etiqueta INT (11) PRIMARY KEY AUTO_INCREMENT,
        nombre_etiqueta VARCHAR(50) NOT NULL UNIQUE
    ) ENGINE = InnoDB;

INSERT INTO
    etiquetas (nombre_etiqueta)
VALUES
    ('Urgente'),
    ('Programable'),
    ('Preventivo'),
    ('Tratamiento'),
    ('Seguimiento'),
    ('Emergencia');

-- ======================================================
-- TABLA: especialidades
-- ======================================================
CREATE TABLE
    especialidades (
        id_especialidad INT (11) PRIMARY KEY AUTO_INCREMENT,
        nombre_especialidad VARCHAR(50) NOT NULL UNIQUE
    ) ENGINE = InnoDB;

INSERT INTO
    especialidades (nombre_especialidad)
VALUES
    ('Cirugía General'),
    ('Medicina Interna'),
    ('Dermatología'),
    ('Traumatología'),
    ('Especies Exóticas'),
    ('Oncología'),
    ('Cardiología');

-- ======================================================
-- TABLA: veterinario_especialidades (relación muchos a muchos)
-- ======================================================
CREATE TABLE
    veterinario_especialidades (
        id_veterinario INT (11),
        id_especialidad INT (11),
        PRIMARY KEY (id_veterinario, id_especialidad),
        FOREIGN KEY (id_veterinario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (id_especialidad) REFERENCES especialidades (id_especialidad) ON DELETE CASCADE
    ) ENGINE = InnoDB;

-- Asignar especialidades a veterinarios
-- Carlos Méndez (id=2): Cirugía General
-- Ana Gómez (id=3): Medicina Interna
-- Ricardo Soto (id=4): Dermatología
-- Sofia Torres (id=5): Especies Exóticas
-- Mario Castro (id=6): Traumatología
INSERT INTO
    veterinario_especialidades (id_veterinario, id_especialidad)
VALUES
    (2, 1), -- Carlos: Cirugía General
    (3, 2), -- Ana: Medicina Interna
    (4, 3), -- Ricardo: Dermatología
    (5, 5), -- Sofia: Especies Exóticas
    (6, 4);

-- Mario: Traumatología
-- ======================================================
-- TABLA: categoria_etiquetas (relación muchos a muchos)
-- ======================================================
CREATE TABLE
    categoria_etiquetas (
        id_categoria INT (11),
        id_etiqueta INT (11),
        PRIMARY KEY (id_categoria, id_etiqueta),
        FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria) ON DELETE CASCADE,
        FOREIGN KEY (id_etiqueta) REFERENCES etiquetas (id_etiqueta) ON DELETE CASCADE
    ) ENGINE = InnoDB;

-- Datos de ejemplo para categoria_etiquetas
INSERT INTO
    categoria_etiquetas (id_categoria, id_etiqueta)
VALUES
    -- Vacunación: Preventivo, Programable
    (1, 3),
    (1, 2),
    -- Cirugía menor: Tratamiento, Programable
    (2, 4),
    (2, 2),
    -- Desparasitación: Preventivo, Programable
    (3, 3),
    (3, 2),
    -- Consulta general: Programable, Seguimiento
    (4, 2),
    (4, 5),
    -- Emergencia: Urgente, Emergencia
    (5, 1),
    (5, 6),
    -- Cirugía mayor: Urgente, Tratamiento
    (6, 1),
    (6, 4),
    -- Especies Exóticas: Tratamiento, Programable
    (7, 4),
    (7, 2),
    -- Dermatología: Tratamiento, Seguimiento
    (8, 4),
    (8, 5),
    -- Traumatología: Urgente, Tratamiento
    (9, 1),
    (9, 4),
    -- Control rutinario: Preventivo, Programable
    (10, 3),
    (10, 2);

-- ======================================================
-- TABLA: categoria_especialidades (relación muchos a muchos)
-- ======================================================
CREATE TABLE
    categoria_especialidades (
        id_categoria INT (11),
        id_especialidad INT (11),
        PRIMARY KEY (id_categoria, id_especialidad),
        FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria) ON DELETE CASCADE,
        FOREIGN KEY (id_especialidad) REFERENCES especialidades (id_especialidad) ON DELETE CASCADE
    ) ENGINE = InnoDB;

-- Datos de ejemplo para categoria_especialidades
INSERT INTO
    categoria_especialidades (id_categoria, id_especialidad)
VALUES
    -- Vacunación: Medicina Interna
    (1, 2),
    -- Cirugía menor: Cirugía General
    (2, 1),
    -- Desparasitación: Medicina Interna
    (3, 2),
    -- Consulta general: Medicina Interna
    (4, 2),
    -- Emergencia: Medicina Interna, Cirugía General
    (5, 2),
    (5, 1),
    -- Cirugía mayor: Cirugía General
    (6, 1),
    -- Especies Exóticas: Especies Exóticas
    (7, 5),
    -- Dermatología: Dermatología
    (8, 3),
    -- Traumatología: Traumatología, Cirugía General
    (9, 4),
    (9, 1),
    -- Control rutinario: Medicina Interna
    (10, 2);

-- ======================================================
-- TABLA: estadosticket
-- ======================================================
CREATE TABLE
    estadosticket (
        id_estado INT (11) PRIMARY KEY AUTO_INCREMENT,
        nombre_estado VARCHAR(50)
    ) ENGINE = InnoDB;

INSERT INTO
    estadosticket (nombre_estado)
VALUES
    ('Abierto'),
    ('En proceso'),
    ('Cerrado'),
    ('Cancelado');

-- ======================================================
-- TABLA: tickets
-- ======================================================
CREATE TABLE
    tickets (
        id_ticket INT (11) PRIMARY KEY AUTO_INCREMENT,
        titulo VARCHAR(100),
        descripcion TEXT,
        fecha_creacion DATETIME,
        fecha_cita DATETIME,
        id_estado INT (11),
        id_categoria INT (11),
        id_mascota INT (11),
        id_creado_por_usuario INT (11),
        id_asignado_a_usuario INT (11),
        FOREIGN KEY (id_estado) REFERENCES estadosticket (id_estado),
        FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria),
        FOREIGN KEY (id_mascota) REFERENCES mascotas (id_mascota),
        FOREIGN KEY (id_creado_por_usuario) REFERENCES usuarios (id_usuario),
        FOREIGN KEY (id_asignado_a_usuario) REFERENCES usuarios (id_usuario)
    ) ENGINE = InnoDB;

INSERT INTO
    tickets (
        titulo,
        descripcion,
        fecha_creacion,
        fecha_cita,
        id_estado,
        id_categoria,
        id_mascota,
        id_creado_por_usuario,
        id_asignado_a_usuario
    )
VALUES
    (
        'Vacunación anual para Max',
        'Aplicar vacuna antirrábica y revisión general',
        '2025-10-24 09:00:00',
        '2025-10-26 10:00:00',
        2,
        1,
        1,
        12,
        3
    ), -- Categoría Vacunación → Ana (Medicina Interna)
    (
        'Revisión quirúrgica de Luna',
        'Revisar sutura tras operación reciente',
        '2025-10-05 11:00:00',
        '2025-10-07 14:00:00',
        2,
        2,
        2,
        13,
        2
    ), -- Categoría Cirugía menor → Carlos (Cirugía General)
    (
        'Emergencia - Accidente Zeus',
        'Fractura en pata trasera, requiere atención inmediata',
        '2025-10-08 15:30:00',
        '2025-10-08 16:00:00',
        2,
        5,
        8,
        14,
        2
    ), -- Categoría Emergencia → Carlos (Cirugía General para fractura)
    (
        'Consulta Dermatológica Nina',
        'Presenta manchas en la piel y pérdida de pelo',
        '2025-10-09 10:00:00',
        '2025-10-10 11:30:00',
        1,
        8,
        5,
        15,
        4
    ), -- Categoría Dermatología → Ricardo (Dermatología)
    (
        'Revisión Coco - Especies Exóticas',
        'Control rutinario y revisión de pico',
        '2025-10-10 14:00:00',
        '2025-10-11 15:00:00',
        2,
        7,
        10,
        16,
        5
    ), -- Categoría Especies Exóticas → Sofia (Especies Exóticas)
    (
        'Cirugía Mayor - Bella',
        'Extracción de tumor en abdomen',
        '2025-10-11 08:00:00',
        '2025-10-11 09:00:00',
        2,
        6,
        7,
        13,
        2
    ), -- Categoría Cirugía mayor → Carlos (Cirugía General)
    (
        'Control rutinario Lucas',
        'Chequeo general y vacunas pendientes',
        '2025-10-12 11:00:00',
        '2025-10-14 14:00:00',
        1,
        10,
        9,
        15,
        3
    ), -- Categoría Control rutinario → Ana (Medicina Interna)
    (
        'Emergencia - Toby intoxicación',
        'Ingesta de sustancia tóxica, vómitos frecuentes',
        '2025-10-12 20:00:00',
        '2025-10-12 20:15:00',
        2,
        5,
        6,
        14,
        3
    ), -- Categoría Emergencia → Ana (Medicina Interna)
    (
        'Control Dermatológico Luna',
        'Revisión por alergia en piel',
        '2025-10-01 13:00:00',
        '2025-10-02 15:00:00',
        3,
        8,
        2,
        13,
        4
    ), -- Categoría Dermatología → Ricardo (Dermatología)
    (
        'Cirugía Milo - Esterilización',
        'Procedimiento de esterilización programado',
        '2025-10-02 09:00:00',
        '2025-10-03 11:00:00',
        4,
        2,
        4,
        12,
        2
    ), -- Categoría Cirugía menor → Carlos (Cirugía General)
    (
        'Vacunación Rocky',
        'Vacuna contra rabia',
        '2025-10-03 14:00:00',
        '2025-10-04 16:00:00',
        3,
        1,
        3,
        15,
        3
    ), -- Categoría Vacunación → Ana (Medicina Interna)
    (
        'Emergencia Nina - Accidente',
        'Caída desde altura',
        '2025-10-05 19:00:00',
        '2025-10-05 19:15:00',
        3,
        5,
        5,
        15,
        3
    ), -- Categoría Emergencia → Ana (Medicina Interna para caída)
    (
        'Control Coco - Pruebas sangre',
        'Exámenes de rutina',
        '2025-10-06 10:00:00',
        '2025-10-07 11:00:00',
        4,
        7,
        10,
        16,
        5
    );

-- Categoría Especies Exóticas → Sofia (Especies Exóticas)
-- ======================================================
-- TABLA: ticketimage
-- ======================================================
CREATE TABLE
    ticketimage (
        id_imagen INT (11) PRIMARY KEY AUTO_INCREMENT,
        id_ticket INT (11),
        imagen VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_ticket) REFERENCES tickets (id_ticket)
    ) ENGINE = InnoDB;

INSERT INTO
    ticketimage (id_ticket, imagen, created_at)
VALUES
    (
        1,
        'consulta-veterinaria-1.jpg',
        '2025-10-02 10:30:00'
    ), -- Consulta General Max - En proceso
    (2, 'post operatoria.jpg', '2025-10-05 12:00:00'), -- Revisión Postoperatoria Bella - En proceso
    (3, 'fractura simba.jpg', '2025-10-08 16:30:00'), -- Emergencia Fractura Simba - En proceso
    (
        4,
        'CopyVetRadiografiaNina.jpeg',
        '2025-10-09 10:30:00'
    ), -- Consulta Dermatológica Nina - En proceso
    (
        5,
        'CopyVetConsultaExotica.jpg',
        '2025-10-10 14:30:00'
    ), -- Revisión Coco - En proceso
    (6, 'boxer como nuevo.jpg', '2025-10-11 08:45:00'), -- Cirugía Mayor Bella - En proceso
    (
        8,
        'perico coco vomito.jpg',
        '2025-10-12 20:30:00'
    ), -- Emergencia Intoxicación Coco - En proceso
    (
        9,
        'CopyVetDermatologiaLuna.jpg',
        '2025-10-01 13:30:00'
    ), -- Control Dermatológico Luna - Cerrado
    (
        11,
        'CopyVetVacunacionRocky.jpeg',
        '2025-10-03 14:30:00'
    ), -- Vacunación Rocky - Cerrado
    (
        12,
        'CopyVetRadiografiaNina.jpeg',
        '2025-10-05 11:30:00'
    );

-- Revisión quirúrgica Luna - Cerrado
;

-- ======================================================
-- TABLA: historico
-- ======================================================
CREATE TABLE
    historico (
        id_historico INT (11) PRIMARY KEY AUTO_INCREMENT,
        id_ticket INT (11),
        fecha DATETIME,
        comentario TEXT,
        estado VARCHAR(50),
        id_usuario INT (11),
        FOREIGN KEY (id_ticket) REFERENCES tickets (id_ticket),
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
    ) ENGINE = InnoDB;

INSERT INTO
    historico (id_ticket, fecha, comentario, estado, id_usuario)
VALUES
    (
        1,
        '2025-10-01 09:30:00',
        'Ticket creado por cliente',
        'Abierto',
        5
    ),
    (
        1,
        '2025-10-02 10:00:00',
        'Asignado a veterinario Carlos Méndez',
        'En proceso',
        1
    ),
    (
        2,
        '2025-10-05 11:30:00',
        'Ticket creado y asignado a Ana Gómez',
        'En proceso',
        10
    ),
    (
        3,
        '2025-10-08 15:30:00',
        'Emergencia reportada - Fractura',
        'Abierto',
        11
    ),
    (
        3,
        '2025-10-08 15:35:00',
        'Asignado a Dr. Mario Castro - Traumatología',
        'En proceso',
        1
    ),
    (
        3,
        '2025-10-08 16:00:00',
        'Inicio de atención de emergencia',
        'En proceso',
        7
    ),
    (
        4,
        '2025-10-09 10:00:00',
        'Consulta dermatológica agendada',
        'Abierto',
        12
    ),
    (
        4,
        '2025-10-09 10:15:00',
        'Asignado a Dr. Ricardo Soto',
        'En proceso',
        1
    ),
    (
        5,
        '2025-10-10 14:00:00',
        'Revisión de ave exótica agendada',
        'Abierto',
        13
    ),
    (
        5,
        '2025-10-10 14:15:00',
        'Asignado a Dra. Sofia Torres - Especies Exóticas',
        'En proceso',
        1
    ),
    (
        6,
        '2025-10-11 08:00:00',
        'Ingreso para cirugía mayor',
        'Abierto',
        10
    ),
    (
        6,
        '2025-10-11 08:15:00',
        'Preparación para cirugía - Dr. Carlos Méndez',
        'En proceso',
        2
    ),
    (
        7,
        '2025-10-12 11:00:00',
        'Agendamiento control rutinario',
        'Abierto',
        12
    ),
    (
        8,
        '2025-10-12 20:00:00',
        'Emergencia por intoxicación reportada',
        'Abierto',
        13
    ),
    (
        8,
        '2025-10-12 20:05:00',
        'Asignado urgentemente a Dr. Carlos Méndez',
        'En proceso',
        1
    ),
    (
        8,
        '2025-10-12 20:15:00',
        'Inicio de tratamiento de emergencia',
        'En proceso',
        2
    ),
    (
        9,
        '2025-10-01 13:00:00',
        'Solicitud de control dermatológico',
        'Abierto',
        10
    ),
    (
        9,
        '2025-10-01 14:00:00',
        'Asignado a Dr. Ricardo Soto para atención',
        'En proceso',
        4
    ),
    (
        9,
        '2025-10-02 15:00:00',
        'Tratamiento completado, sin reacciones alérgicas',
        'Cerrado',
        4
    ),
    (
        10,
        '2025-10-02 09:00:00',
        'Programación de cirugía',
        'Abierto',
        6
    ),
    (
        10,
        '2025-10-02 10:00:00',
        'Cancelado por solicitud del cliente - Reprogramar',
        'Cancelado',
        6
    ),
    (
        11,
        '2025-10-03 14:00:00',
        'Ingreso para vacunación',
        'Abierto',
        11
    ),
    (
        11,
        '2025-10-03 15:00:00',
        'Iniciando proceso de vacunación - Dra. Ana Gómez',
        'En proceso',
        3
    ),
    (
        11,
        '2025-10-04 16:30:00',
        'Vacuna aplicada, sin reacciones adversas',
        'Cerrado',
        3
    ),
    (
        12,
        '2025-10-05 19:00:00',
        'Ingreso por emergencia',
        'Abierto',
        12
    ),
    (
        12,
        '2025-10-05 19:15:00',
        'Atención iniciada por Dr. Mario Castro',
        'En proceso',
        7
    ),
    (
        12,
        '2025-10-05 20:30:00',
        'Tratamiento completado, radiografías normales',
        'Cerrado',
        7
    ),
    (
        13,
        '2025-10-06 10:00:00',
        'Programación de exámenes',
        'Abierto',
        13
    ),
    (
        13,
        '2025-10-06 11:00:00',
        'Cancelado - Ave presenta síntomas de estrés',
        'Cancelado',
        5
    );

-- ======================================================
-- TABLA: notificaciones
-- ======================================================
CREATE TABLE
    notificaciones (
        id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL, -- Ej: 'ticket_estado', 'login'
        descripcion TEXT NOT NULL,
        fecha_evento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        id_usuario INT NOT NULL, -- Usuario destinatario
        id_evento INT NULL, -- ID del ticket u otro evento relacionado
        estado_leida BOOLEAN NOT NULL DEFAULT FALSE, -- FALSE = no leída, TRUE = leída
        importancia VARCHAR(20) DEFAULT 'normal', -- Ej: 'normal', 'alta', 'baja'
        responsable VARCHAR(100) DEFAULT NULL, -- Usuario responsable del cambio (opcional)
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
    );

CREATE INDEX idx_usuario_leida ON notificaciones (id_usuario, estado_leida);

CREATE INDEX idx_tipo_fecha ON notificaciones (tipo, fecha_evento);

-- ======================================================
-- DATOS DE PRUEBA: notificaciones
-- ======================================================
INSERT INTO
    notificaciones (
        tipo,
        descripcion,
        fecha_evento,
        id_usuario,
        id_evento,
        estado_leida,
        importancia,
        responsable
    )
SELECT
    'ticket_estado',
    'El ticket #1 ha cambiado de estado: Abierto → En proceso',
    (CURRENT_TIMESTAMP - INTERVAL 12 HOUR),
    3,
    1,
    FALSE,
    'alta',
    'Carlos Méndez'
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            notificaciones
        WHERE
            tipo = 'ticket_estado'
            AND id_usuario = 3
            AND id_evento = 1
        LIMIT
            1
    );

INSERT INTO
    notificaciones (
        tipo,
        descripcion,
        fecha_evento,
        id_usuario,
        id_evento,
        estado_leida,
        importancia,
        responsable
    )
SELECT
    'ticket_estado',
    'El ticket #1 ha cambiado de estado: Abierto → En proceso',
    (CURRENT_TIMESTAMP - INTERVAL 12 HOUR),
    1,
    1,
    FALSE,
    'alta',
    'Carlos Méndez'
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            notificaciones
        WHERE
            tipo = 'ticket_estado'
            AND id_usuario = 1
            AND id_evento = 1
        LIMIT
            1
    );

INSERT INTO
    notificaciones (
        tipo,
        descripcion,
        fecha_evento,
        id_usuario,
        id_evento,
        estado_leida,
        importancia,
        responsable
    )
SELECT
    'ticket_estado',
    'El ticket #2 ha cambiado de estado: En proceso → Cerrado',
    (CURRENT_TIMESTAMP - INTERVAL 6 HOUR),
    4,
    2,
    TRUE,
    'normal',
    'Ana Gómez'
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            notificaciones
        WHERE
            tipo = 'ticket_estado'
            AND id_usuario = 4
            AND id_evento = 2
        LIMIT
            1
    );

INSERT INTO
    notificaciones (
        tipo,
        descripcion,
        fecha_evento,
        id_usuario,
        id_evento,
        estado_leida,
        importancia,
        responsable
    )
SELECT
    'ticket_estado',
    'El ticket #2 ha cambiado de estado: En proceso → Cerrado',
    (CURRENT_TIMESTAMP - INTERVAL 6 HOUR),
    2,
    2,
    TRUE,
    'normal',
    'Ana Gómez'
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            notificaciones
        WHERE
            tipo = 'ticket_estado'
            AND id_usuario = 2
            AND id_evento = 2
        LIMIT
            1
    );

-- ======================================================
-- AGREGAR CAMPOS DE VALORACION A TICKETS
-- ======================================================
-- Agregar columnas de valoracion a la tabla tickets
ALTER TABLE tickets
ADD COLUMN valoracion INT DEFAULT NULL COMMENT 'Valoracion del servicio (1-5 estrellas)',
ADD COLUMN comentario_valoracion TEXT DEFAULT NULL COMMENT 'Comentario opcional del cliente sobre el servicio',
ADD COLUMN fecha_valoracion DATETIME DEFAULT NULL COMMENT 'Fecha y hora en que se realizo la valoracion';

-- Agregar restriccion para que la valoracion sea entre 1 y 5
ALTER TABLE tickets ADD CONSTRAINT chk_valoracion CHECK (
    valoracion IS NULL
    OR (
        valoracion >= 1
        AND valoracion <= 5
    )
);

-- ======================================================
-- AGREGAR VALORACIONES A TICKETS CERRADOS
-- ======================================================
-- Actualizar tickets cerrados (estado = 3) con valoraciones aleatorias
UPDATE tickets
SET
    valoracion = 5,
    comentario_valoracion = 'Excelente servicio, muy profesional y atento. Mi mascota se recuperó rápidamente.',
    fecha_valoracion = fecha_creacion + INTERVAL 5 DAY
WHERE
    id_ticket = 9
    AND id_estado = 3;

UPDATE tickets
SET
    valoracion = 4,
    comentario_valoracion = 'Buen servicio, aunque tuve que esperar un poco más de lo esperado.',
    fecha_valoracion = fecha_creacion + INTERVAL 3 DAY
WHERE
    id_ticket = 11
    AND id_estado = 3;

UPDATE tickets
SET
    valoracion = 5,
    comentario_valoracion = 'Muy satisfecho con la atención recibida. El veterinario explicó todo claramente.',
    fecha_valoracion = fecha_creacion + INTERVAL 4 DAY
WHERE
    id_ticket = 12
    AND id_estado = 3;

-- ======================================================
-- REACTIVAR VERIFICACIONES DE CLAVES FORÁNEAS
-- ======================================================
SET
    FOREIGN_KEY_CHECKS = 1;
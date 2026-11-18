/* =====================================================
   Base de datos: Cine (SQL Server / T-SQL)
   Modelo relacional normalizado
   ===================================================== */

IF DB_ID('Cine') IS NULL
    CREATE DATABASE Cine;
GO

USE Cine;
GO

/* Borrado seguro al volver a ejecutar el script */
IF OBJECT_ID('dbo.Entrada', 'U') IS NOT NULL DROP TABLE dbo.Entrada;
IF OBJECT_ID('dbo.Venta', 'U') IS NOT NULL DROP TABLE dbo.Venta;
IF OBJECT_ID('dbo.Elenco', 'U') IS NOT NULL DROP TABLE dbo.Elenco;
IF OBJECT_ID('dbo.Funciones', 'U') IS NOT NULL DROP TABLE dbo.Funciones;
IF OBJECT_ID('dbo.Peliculas', 'U') IS NOT NULL DROP TABLE dbo.Peliculas;
IF OBJECT_ID('dbo.Sala_Cine', 'U') IS NOT NULL DROP TABLE dbo.Sala_Cine;
IF OBJECT_ID('dbo.Tipo_Entrada', 'U') IS NOT NULL DROP TABLE dbo.Tipo_Entrada;
IF OBJECT_ID('dbo.Usuario', 'U') IS NOT NULL DROP TABLE dbo.Usuario;
IF OBJECT_ID('dbo.Actores', 'U') IS NOT NULL DROP TABLE dbo.Actores;
IF OBJECT_ID('dbo.Genero', 'U') IS NOT NULL DROP TABLE dbo.Genero;
IF OBJECT_ID('dbo.Pais', 'U') IS NOT NULL DROP TABLE dbo.Pais;
IF OBJECT_ID('dbo.Cine', 'U') IS NOT NULL DROP TABLE dbo.Cine;
GO

CREATE TABLE Cine (
    ID_Cine INT IDENTITY(1,1) NOT NULL,
    Establecimiento VARCHAR(100) NOT NULL,
    Ubicacion VARCHAR(150) NOT NULL,
    Nombre_Cine VARCHAR(100) NOT NULL,
    CONSTRAINT PK_Cine PRIMARY KEY (ID_Cine),
    CONSTRAINT UQ_Cine_Nombre UNIQUE (Nombre_Cine)
);

CREATE TABLE Sala_Cine (
    ID_Sala INT IDENTITY(1,1) NOT NULL,
    ID_Cine INT NOT NULL,
    Total_Butacas INT NOT NULL,
    Numero_Sala INT NOT NULL,
    CONSTRAINT PK_Sala_Cine PRIMARY KEY (ID_Sala),
    CONSTRAINT FK_Sala_Cine_Cine FOREIGN KEY (ID_Cine) REFERENCES Cine(ID_Cine),
    CONSTRAINT UQ_Sala_Numero UNIQUE (ID_Cine, Numero_Sala),
    CONSTRAINT CK_Sala_Butacas CHECK (Total_Butacas > 0)
);

CREATE TABLE Pais (
    ID_Pais INT IDENTITY(1,1) NOT NULL,
    Nombre_Pais VARCHAR(60) NOT NULL,
    Idioma VARCHAR(40) NOT NULL,
    CONSTRAINT PK_Pais PRIMARY KEY (ID_Pais),
    CONSTRAINT UQ_Pais_Nombre UNIQUE (Nombre_Pais)
);

CREATE TABLE Genero (
    ID_Genero INT IDENTITY(1,1) NOT NULL,
    Titulo_Genero VARCHAR(50) NOT NULL,
    CONSTRAINT PK_Genero PRIMARY KEY (ID_Genero),
    CONSTRAINT UQ_Genero_Titulo UNIQUE (Titulo_Genero)
);

CREATE TABLE Actores (
    ID_Actor INT IDENTITY(1,1) NOT NULL,
    Nombre_Actor VARCHAR(60) NOT NULL,
    Apellido_Actor VARCHAR(60) NOT NULL,
    DNI_Actor VARCHAR(15) NOT NULL,
    CONSTRAINT PK_Actores PRIMARY KEY (ID_Actor),
    CONSTRAINT UQ_Actores_DNI UNIQUE (DNI_Actor)
);

CREATE TABLE Peliculas (
    ID_Pelicula INT IDENTITY(1,1) NOT NULL,
    ID_Pais INT NOT NULL,
    ID_Genero INT NOT NULL,
    Titulo_Pelicula VARCHAR(150) NOT NULL,
    Duracion_Pelicula INT NOT NULL,
    Estudio_Pelicula VARCHAR(100) NOT NULL,
    CONSTRAINT PK_Peliculas PRIMARY KEY (ID_Pelicula),
    CONSTRAINT FK_Peliculas_Pais FOREIGN KEY (ID_Pais) REFERENCES Pais(ID_Pais),
    CONSTRAINT FK_Peliculas_Genero FOREIGN KEY (ID_Genero) REFERENCES Genero(ID_Genero),
    CONSTRAINT CK_Pelicula_Duracion CHECK (Duracion_Pelicula > 0)
);

/* Tabla intermedia: resuelve la relación muchos a muchos */
CREATE TABLE Elenco (
    ID_Pelicula INT NOT NULL,
    ID_Actor INT NOT NULL,
    Rol VARCHAR(80) NULL,
    CONSTRAINT PK_Elenco PRIMARY KEY (ID_Pelicula, ID_Actor),
    CONSTRAINT FK_Elenco_Pelicula FOREIGN KEY (ID_Pelicula) REFERENCES Peliculas(ID_Pelicula),
    CONSTRAINT FK_Elenco_Actor FOREIGN KEY (ID_Actor) REFERENCES Actores(ID_Actor)
);

CREATE TABLE Funciones (
    ID_Funcion INT IDENTITY(1,1) NOT NULL,
    ID_Sala INT NOT NULL,
    ID_Pelicula INT NOT NULL,
    Fecha_Funcion DATE NOT NULL,
    Horario_Funcion TIME NOT NULL,
    CONSTRAINT PK_Funciones PRIMARY KEY (ID_Funcion),
    CONSTRAINT FK_Funciones_Sala FOREIGN KEY (ID_Sala) REFERENCES Sala_Cine(ID_Sala),
    CONSTRAINT FK_Funciones_Pelicula FOREIGN KEY (ID_Pelicula) REFERENCES Peliculas(ID_Pelicula),
    CONSTRAINT UQ_Funcion_Sala_Fecha_Hora UNIQUE (ID_Sala, Fecha_Funcion, Horario_Funcion)
);

CREATE TABLE Usuario (
    ID_Usuario INT IDENTITY(1,1) NOT NULL,
    Nacimiento_Fecha DATE NOT NULL,
    Nombre_Usuario VARCHAR(60) NOT NULL,
    Apellido_Usuario VARCHAR(60) NOT NULL,
    DNI_Usuario VARCHAR(15) NOT NULL,
    Email_Usuario VARCHAR(120) NULL,
    Password_Usuario VARCHAR(255) NULL,
    CONSTRAINT PK_Usuario PRIMARY KEY (ID_Usuario),
    CONSTRAINT UQ_Usuario_DNI UNIQUE (DNI_Usuario),
    CONSTRAINT UQ_Usuario_Email UNIQUE (Email_Usuario)
);

CREATE TABLE Tipo_Entrada (
    ID_Tipo INT IDENTITY(1,1) NOT NULL,
    Edad_Minima INT NULL,
    Nombre_Tipo VARCHAR(50) NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    CONSTRAINT PK_Tipo_Entrada PRIMARY KEY (ID_Tipo),
    CONSTRAINT CK_Tipo_Entrada_Precio CHECK (Precio >= 0)
);

CREATE TABLE Venta (
    ID_Venta INT IDENTITY(1,1) NOT NULL,
    ID_Usuario INT NOT NULL,
    Fecha_Venta DATE NOT NULL DEFAULT (CAST(GETDATE() AS DATE)),
    Precio_Total DECIMAL(10,2) NOT NULL,
    CONSTRAINT PK_Venta PRIMARY KEY (ID_Venta),
    CONSTRAINT FK_Venta_Usuario FOREIGN KEY (ID_Usuario) REFERENCES Usuario(ID_Usuario),
    CONSTRAINT CK_Venta_Precio CHECK (Precio_Total >= 0)
);

CREATE TABLE Entrada (
    ID_Entrada INT IDENTITY(1,1) NOT NULL,
    ID_Funcion INT NOT NULL,
    ID_Tipo INT NOT NULL,
    ID_Venta INT NOT NULL,
    Vencimiento DATE NOT NULL,
    CONSTRAINT PK_Entrada PRIMARY KEY (ID_Entrada),
    CONSTRAINT FK_Entrada_Funcion FOREIGN KEY (ID_Funcion) REFERENCES Funciones(ID_Funcion),
    CONSTRAINT FK_Entrada_Tipo FOREIGN KEY (ID_Tipo) REFERENCES Tipo_Entrada(ID_Tipo),
    CONSTRAINT FK_Entrada_Venta FOREIGN KEY (ID_Venta) REFERENCES Venta(ID_Venta)
);
GO

/* ---------- Datos de ejemplo ---------- */
INSERT INTO Cine (Establecimiento, Ubicacion, Nombre_Cine)
VALUES ('Shopping Central', 'Av. Principal 123', 'Cine Central');

INSERT INTO Sala_Cine (ID_Cine, Total_Butacas, Numero_Sala)
VALUES (1, 120, 1);

INSERT INTO Pais (Nombre_Pais, Idioma)
VALUES ('Argentina', 'Español');

INSERT INTO Genero (Titulo_Genero)
VALUES ('Drama');

INSERT INTO Actores (Nombre_Actor, Apellido_Actor, DNI_Actor)
VALUES ('Juan', 'Pérez', '30111222');

INSERT INTO Peliculas (ID_Pais, ID_Genero, Titulo_Pelicula, Duracion_Pelicula, Estudio_Pelicula)
VALUES (1, 1, 'Película de ejemplo', 110, 'Estudio Demo');

INSERT INTO Elenco (ID_Pelicula, ID_Actor, Rol)
VALUES (1, 1, 'Protagonista');

INSERT INTO Funciones (ID_Sala, ID_Pelicula, Fecha_Funcion, Horario_Funcion)
VALUES (1, 1, '2026-11-20', '20:30');

INSERT INTO Tipo_Entrada (Edad_Minima, Nombre_Tipo, Precio)
VALUES (18, 'General', 5500.00), (12, 'Menor', 3500.00);

INSERT INTO Usuario (Nacimiento_Fecha, Nombre_Usuario, Apellido_Usuario, DNI_Usuario, Email_Usuario, Password_Usuario)
VALUES ('2000-05-10', 'Ana', 'Gómez', '40123456', 'ana@cinenova.com', '123456');

INSERT INTO Venta (ID_Usuario, Precio_Total)
VALUES (1, 5500.00);

INSERT INTO Entrada (ID_Funcion, ID_Tipo, ID_Venta, Vencimiento)
VALUES (1, 1, 1, '2026-11-20');
GO

/* ---------- Consulta de prueba ---------- */
SELECT
    u.Nombre_Usuario,
    p.Titulo_Pelicula,
    f.Fecha_Funcion,
    f.Horario_Funcion,
    s.Numero_Sala,
    c.Nombre_Cine
FROM Entrada AS e
INNER JOIN Venta AS v ON v.ID_Venta = e.ID_Venta
INNER JOIN Usuario AS u ON u.ID_Usuario = v.ID_Usuario
INNER JOIN Funciones AS f ON f.ID_Funcion = e.ID_Funcion
INNER JOIN Peliculas AS p ON p.ID_Pelicula = f.ID_Pelicula
INNER JOIN Sala_Cine AS s ON s.ID_Sala = f.ID_Sala
INNER JOIN Cine AS c ON c.ID_Cine = s.ID_Cine;

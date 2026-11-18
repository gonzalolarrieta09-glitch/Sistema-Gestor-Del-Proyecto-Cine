# Sistema-Gestor-Del-Proyecto-Cine

## Modelo relacional

```mermaid
erDiagram
    CINE ||--|{ SALA_CINE : tiene
    SALA_CINE ||--|{ FUNCIONES : programa
    PELICULAS ||--|{ FUNCIONES : se-proyecta-en
    PAIS ||--|{ PELICULAS : origina
    GENERO ||--|{ PELICULAS : clasifica
    PELICULAS ||--|{ ELENCO : incluye
    ACTORES ||--|{ ELENCO : participa-en
    USUARIO ||--|{ VENTA : realiza
    VENTA ||--|{ ENTRADA : contiene
    TIPO_ENTRADA ||--|{ ENTRADA : clasifica
    FUNCIONES ||--|{ ENTRADA : permite

    CINE {
        int ID_Cine PK
        varchar Nombre_Cine
        varchar Establecimiento
        varchar Ubicacion
    }

    SALA_CINE {
        int ID_Sala PK
        int ID_Cine FK
        int Total_Butacas
        int Numero_Sala
    }

    PAIS {
        int ID_Pais PK
        varchar Nombre_Pais
        varchar Idioma
    }

    GENERO {
        int ID_Genero PK
        varchar Titulo_Genero
    }

    ACTORES {
        int ID_Actor PK
        varchar Nombre_Actor
        varchar Apellido_Actor
        varchar DNI_Actor
    }

    PELICULAS {
        int ID_Pelicula PK
        int ID_Pais FK
        int ID_Genero FK
        varchar Titulo_Pelicula
        int Duracion_Pelicula
        varchar Estudio_Pelicula
    }

    ELENCO {
        int ID_Pelicula PK, FK
        int ID_Actor PK, FK
        varchar Rol
    }

    FUNCIONES {
        int ID_Funcion PK
        int ID_Sala FK
        int ID_Pelicula FK
        date Fecha_Funcion
        time Horario_Funcion
    }

    USUARIO {
        int ID_Usuario PK
        date Nacimiento_Fecha
        varchar Nombre_Usuario
        varchar Apellido_Usuario
        varchar DNI_Usuario
    }

    TIPO_ENTRADA {
        int ID_Tipo PK
        int Edad_Minima
        varchar Nombre_Tipo
        decimal Precio
    }

    VENTA {
        int ID_Venta PK
        int ID_Usuario FK
        date Fecha_Venta
        decimal Precio_Total
    }

    ENTRADA {
        int ID_Entrada PK
        int ID_Funcion FK
        int ID_Tipo FK
        int ID_Venta FK
        date Vencimiento
    }
```

### Relaciones principales

- Una película puede participar en varias funciones, y una función pertenece a una película.
- Una película puede tener varios actores y un actor puede participar en varias películas mediante `Elenco`.
- Un cine tiene varias salas y una sala puede tener varias funciones.
- Un usuario puede realizar varias ventas y una venta puede contener varias entradas.
- Cada entrada pertenece a una función y tiene un tipo de entrada.
const express = require('express');
const sql = require('mssql/msnodesqlv8');
const path = require('path');

const app = express();
app.use(express.json());

const dbConfig = {
  server: 'localhost\\SQLEXPRESS',
  database: 'Cine',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('Conectado a SQL Server: localhost\\SQLEXPRESS / Cine');
    return pool;
  })
  .catch(error => {
    console.error('Error al conectar con SQL Server:', error.message);
    throw error;
  });

app.use('/Css', express.static(path.join(__dirname, 'Css')));
app.use('/Java.Script', express.static(path.join(__dirname, 'Java.Script')));
app.use('/Img', express.static(path.join(__dirname, 'Img')));
app.use(express.static(path.join(__dirname, 'Html')));

app.get('/api/peliculas', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT p.ID_Pelicula, p.Titulo_Pelicula, p.Duracion_Pelicula,
             p.Estudio_Pelicula, g.Titulo_Genero, pa.Nombre_Pais
      FROM dbo.Peliculas p
      INNER JOIN dbo.Genero g ON g.ID_Genero = p.ID_Genero
      INNER JOIN dbo.Pais pa ON pa.ID_Pais = p.ID_Pais
      ORDER BY p.Titulo_Pelicula
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener las películas.' });
  }
});

app.get('/api/funciones', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT f.ID_Funcion, f.Fecha_Funcion, f.Horario_Funcion,
             p.Titulo_Pelicula, s.Numero_Sala, c.Nombre_Cine
      FROM dbo.Funciones f
      INNER JOIN dbo.Peliculas p ON p.ID_Pelicula = f.ID_Pelicula
      INNER JOIN dbo.Sala_Cine s ON s.ID_Sala = f.ID_Sala
      INNER JOIN dbo.Cine c ON c.ID_Cine = s.ID_Cine
      ORDER BY f.Fecha_Funcion, f.Horario_Funcion
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener las funciones.' });
  }
});

app.post('/api/usuarios/registro', async (req, res) => {
  const { nombre, apellido, dni, nacimiento, email, password } = req.body;
  if (!nombre || !apellido || !dni || !nacimiento || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Nombre', sql.VarChar(60), nombre)
      .input('Apellido', sql.VarChar(60), apellido)
      .input('DNI', sql.VarChar(15), dni)
      .input('Nacimiento', sql.Date, nacimiento)
      .input('Email', sql.VarChar(120), email)
      .input('Password', sql.VarChar(255), password)
      .query(`
        IF EXISTS (SELECT 1 FROM dbo.Usuario WHERE DNI_Usuario = @DNI OR Email_Usuario = @Email)
          THROW 50001, 'El DNI o correo ya están registrados.', 1;

        INSERT INTO dbo.Usuario
          (Nacimiento_Fecha, Nombre_Usuario, Apellido_Usuario, DNI_Usuario, Email_Usuario, Password_Usuario)
        VALUES (@Nacimiento, @Nombre, @Apellido, @DNI, @Email, @Password);

        SELECT ID_Usuario, Nombre_Usuario, Apellido_Usuario, Email_Usuario
        FROM dbo.Usuario WHERE Email_Usuario = @Email;
      `);
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
});

app.post('/api/usuarios/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Email', sql.VarChar(120), email)
      .input('Password', sql.VarChar(255), password)
      .query(`
        SELECT ID_Usuario, Nombre_Usuario, Apellido_Usuario, Email_Usuario, Nacimiento_Fecha
        FROM dbo.Usuario
        WHERE Email_Usuario = @Email AND Password_Usuario = @Password
      `);
    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo iniciar sesión.' });
  }
});

app.post('/api/ventas', async (req, res) => {
  const { idUsuario, idFuncion, idTipoEntrada, cantidad, precioTotal } = req.body;
  if (!idUsuario || !idFuncion || !idTipoEntrada || !cantidad || precioTotal == null) {
    return res.status(400).json({ error: 'Datos incompletos para registrar la venta.' });
  }

  const transaction = new sql.Transaction(await poolPromise);
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    const venta = await request
      .input('IdUsuario', sql.Int, idUsuario)
      .input('Precio', sql.Decimal(10, 2), precioTotal)
      .query(`
        INSERT INTO dbo.Venta (ID_Usuario, Precio_Total)
        OUTPUT INSERTED.ID_Venta
        VALUES (@IdUsuario, @Precio);
      `);

    const idVenta = venta.recordset[0].ID_Venta;
    const entradas = [];

    for (let i = 0; i < Number(cantidad); i++) {
      const entradaRequest = new sql.Request(transaction);
      const entrada = await entradaRequest
        .input('IdFuncion', sql.Int, idFuncion)
        .input('IdTipo', sql.Int, idTipoEntrada)
        .input('IdVenta', sql.Int, idVenta)
        .query(`
          INSERT INTO dbo.Entrada (ID_Funcion, ID_Tipo, ID_Venta, Vencimiento)
          OUTPUT INSERTED.ID_Entrada
          VALUES (@IdFuncion, @IdTipo, @IdVenta, CAST(GETDATE() AS DATE));
        `);
      entradas.push(entrada.recordset[0].ID_Entrada);
    }

    await transaction.commit();
    res.status(201).json({ idVenta, entradas });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: 'No se pudo registrar la venta.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`CineNova disponible en http://localhost:${port}`);
});

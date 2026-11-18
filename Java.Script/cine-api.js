document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [peliculasResponse, funcionesResponse] = await Promise.all([
      fetch('/api/peliculas'),
      fetch('/api/funciones')
    ]);

    if (!peliculasResponse.ok || !funcionesResponse.ok) {
      throw new Error('La API no respondió correctamente.');
    }

    window.cineNovaData = {
      peliculas: await peliculasResponse.json(),
      funciones: await funcionesResponse.json()
    };

    console.log('Datos cargados desde SQL Server:', window.cineNovaData);
  } catch (error) {
    console.warn(error.message);
  }
});

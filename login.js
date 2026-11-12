document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  
  // Guardamos la sesión activa en el navegador
  localStorage.setItem('usuario_activo', email);
  
  // Redirigimos de vuelta a la cartelera
  window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const formTitle = document.getElementById('formTitle');
  const btnSubmit = document.getElementById('btnSubmit');
  const toggleMode = document.getElementById('toggleMode');
  const toggleText = document.getElementById('toggleText');
  const nameFieldContainer = document.getElementById('nameFieldContainer');
  const errorMsg = document.getElementById('errorMsg');

  let isRegistering = false;

  // Cambiar dinámicamente entre Iniciar Sesión y Registrarse
  toggleMode.addEventListener('click', (e) => {
    e.preventDefault();
    isRegistering = !isRegistering;
    errorMsg.style.display = 'none';

    if (isRegistering) {
      formTitle.textContent = "Crear Cuenta";
      btnSubmit.textContent = "Registrarse";
      nameFieldContainer.style.display = "block";
      toggleText.textContent = "¿Ya tienes cuenta?";
      toggleMode.textContent = "Inicia sesión";
    } else {
      formTitle.textContent = "Iniciar Sesión";
      btnSubmit.textContent = "Ingresar";
      nameFieldContainer.style.display = "none";
      toggleText.textContent = "¿No tienes cuenta?";
      toggleMode.textContent = "Regístrate aquí";
    }
  });

  // Manejar el envío del formulario
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    errorMsg.style.display = 'none';

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const nameInput = document.getElementById('userName').value.trim();

    // Validación de seguridad de contraseña
    if (password.length < 6) {
      errorMsg.textContent = "⚠️ La contraseña debe tener al menos 6 caracteres.";
      errorMsg.style.display = 'block';
      return;
    }

    if (isRegistering) {
      if (!nameInput) {
        errorMsg.textContent = "⚠️ Por favor ingresa tu nombre y apellido.";
        errorMsg.style.display = 'block';
        return;
      }
      // Guardar datos del usuario registrado
      localStorage.setItem('usuario_activo', nameInput);
      localStorage.setItem('email_activo', email);
      alert(`¡Cuenta creada con éxito! Bienvenido/a, ${nameInput}`);
    } else {
      // Simulación de inicio de sesión exitoso usando la parte del correo como nombre si no hay registro previo
      const displayName = email.split('@')[0];
      localStorage.setItem('usuario_activo', displayName);
      localStorage.setItem('email_activo', email);
    }

    // Redirigir de vuelta a la cartelera
    window.location.href = './index.html';
  });
});

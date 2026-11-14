document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const formTitle = document.getElementById('formTitle');
  const btnSubmit = document.getElementById('btnSubmit');
  const toggleMode = document.getElementById('toggleMode');
  const toggleText = document.getElementById('toggleText');
  const ageFieldContainer = document.getElementById('ageFieldContainer');
  const userAgeInput = document.getElementById('userAge');
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
      ageFieldContainer.style.display = "block";
      userAgeInput.setAttribute('required', 'true');
      toggleText.textContent = "¿Ya tienes cuenta?";
      toggleMode.textContent = "Inicia sesión";
    } else {
      formTitle.textContent = "Iniciar Sesión";
      btnSubmit.textContent = "Ingresar";
      ageFieldContainer.style.display = "none";
      userAgeInput.removeAttribute('required');
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
    const ageValue = userAgeInput.value;

    if (isRegistering) {
      if (!ageValue || ageValue <= 0) {
        errorMsg.textContent = "⚠️ Por favor ingresa una edad válida.";
        errorMsg.style.display = 'block';
        return;
      }
      // Guardar sesión y edad en el navegador
      const displayName = email.split('@')[0];
      localStorage.setItem('usuario_activo', displayName);
      localStorage.setItem('edad_usuario', ageValue);
      alert(`¡Cuenta creada con éxito! Bienvenido/a, ${displayName} (${ageValue} años)`);
    } else {
      // Iniciar sesión normal
      const displayName = email.split('@')[0];
      localStorage.setItem('usuario_activo', displayName);
    }

    // Redirigir de vuelta a la cartelera con ruta relativa segura
    window.location.href = './index.html';
  });
});

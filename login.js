document.addEventListener('DOMContentLoaded', () => {
  const authContainer = document.getElementById('authContainer');
  const profileContainer = document.getElementById('profileContainer');
  const profileUser = document.getElementById('profileUser');
  const profileBirthdate = document.getElementById('profileBirthdate');
  const btnLogout = document.getElementById('btnLogout');

  const loginForm = document.getElementById('loginForm');
  const formTitle = document.getElementById('formTitle');
  const btnSubmit = document.getElementById('btnSubmit');
  const toggleMode = document.getElementById('toggleMode');
  const toggleText = document.getElementById('toggleText');
  const birthdateContainer = document.getElementById('birthdateContainer');
  const errorMsg = document.getElementById('errorMsg');

  const birthDay = document.getElementById('birthDay');
  const birthMonth = document.getElementById('birthMonth');
  const birthYear = document.getElementById('birthYear');

  // Elementos para el visor de contraseña (ojo)
  const togglePassword = document.getElementById('togglePassword');
  const loginPassword = document.getElementById('loginPassword');
  const eyeIcon = document.getElementById('eyeIcon');

  let isRegistering = false;

  // Lógica del botón del ojo para mostrar/ocultar contraseña
  if (togglePassword && loginPassword && eyeIcon) {
    togglePassword.addEventListener('click', () => {
      const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      loginPassword.setAttribute('type', type);

      if (type === 'text') {
        // Icono de Ojo Abierto
        eyeIcon.innerHTML = `
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        `;
      } else {
        // Icono de Ojo Cerrado / Tachado
        eyeIcon.innerHTML = `
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
      }
    });
  }

  // 1. Verificar si ya hay una sesión activa al abrir la página
  const usuarioActivo = localStorage.getItem('usuario_activo');
  if (usuarioActivo) {
    authContainer.style.display = 'none';
    profileContainer.style.display = 'block';
    profileUser.textContent = usuarioActivo;
    
    const fechaNac = localStorage.getItem('fecha_nacimiento');
    if (fechaNac) {
      profileBirthdate.textContent = `Fecha de nacimiento: ${fechaNac}`;
    }
  }

  // 2. Manejar el cierre de sesión desde el botón
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('usuario_activo');
      localStorage.removeItem('fecha_nacimiento');
      localStorage.removeItem('email_activo');
      alert("Has cerrado sesión correctamente.");
      window.location.reload(); // Recarga para mostrar de nuevo el formulario de acceso
    });
  }

  // Poblar días (1 al 31)
  if (birthDay) {
    for (let i = 1; i <= 31; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      birthDay.appendChild(opt);
    }
  }

  // Poblar años (Desde el año actual hasta 1920)
  if (birthYear) {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1920; i--) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      birthYear.appendChild(opt);
    }
  }

  // Cambiar dinámicamente entre Iniciar Sesión y Registrarse
  if (toggleMode) {
    toggleMode.addEventListener('click', (e) => {
      e.preventDefault();
      isRegistering = !isRegistering;
      errorMsg.style.display = 'none';

      if (isRegistering) {
        formTitle.textContent = "Crear Cuenta";
        btnSubmit.textContent = "Registrarse";
        birthdateContainer.style.display = "block";
        toggleText.textContent = "¿Ya tienes cuenta?";
        toggleMode.textContent = "Inicia sesión";
      } else {
        formTitle.textContent = "Iniciar Sesión";
        btnSubmit.textContent = "Ingresar";
        birthdateContainer.style.display = "none";
        toggleText.textContent = "¿No tienes cuenta?";
        toggleMode.textContent = "Regístrate aquí";
      }
    });
  }

  // Manejar el envío del formulario
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      errorMsg.style.display = 'none';

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      if (isRegistering) {
        if (!birthDay.value || !birthMonth.value || !birthYear.value) {
          errorMsg.textContent = "⚠️ Por favor selecciona tu fecha de nacimiento completa.";
          errorMsg.style.display = 'block';
          return;
        }

        const fechaNacimiento = `${birthDay.value}/${birthMonth.value}/${birthYear.value}`;
        const displayName = email.split('@')[0];

        // Guardar sesión y fecha de nacimiento en el navegador
        localStorage.setItem('usuario_activo', displayName);
        localStorage.setItem('fecha_nacimiento', fechaNacimiento);
        localStorage.setItem('email_activo', email);
        alert(`¡Cuenta creada con éxito! Bienvenido/a, ${displayName}`);
      } else {
        // Iniciar sesión normal
        const displayName = email.split('@')[0];
        localStorage.setItem('usuario_activo', displayName);
        localStorage.setItem('email_activo', email);
      }

      // Redirigir de vuelta a la cartelera con ruta relativa segura
      window.location.href = './index.html';
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Verificamos si hay sesión activa en localStorage
  let usuarioActivo = localStorage.getItem('usuario_activo');
  const btnLogin = document.getElementById('btnLogin');
  
  function actualizarBotonLogin() {
    if (btnLogin) {
      if (usuarioActivo) {
        btnLogin.textContent = "Mi Cuenta";
        btnLogin.style.backgroundColor = "#28a745";
      } else {
        btnLogin.textContent = "Iniciar Sesión";
        btnLogin.style.backgroundColor = "#e50914";
      }
    }
  }

  actualizarBotonLogin();

  // Redirigir a la página de login al hacer clic en Iniciar Sesión
  if (btnLogin) {
    btnLogin.addEventListener('click', () => {
      if (!usuarioActivo) {
        window.location.href = './login.html';
      } else {
        if (confirm(`Sesión activa: ${usuarioActivo}\n¿Deseas cerrar sesión?`)) {
          localStorage.removeItem('usuario_activo');
          usuarioActivo = null;
          actualizarBotonLogin();
          alert("Sesión cerrada.");
        }
      }
    });
  }

  // Control de enlaces del menú
  const navEstrenos = document.getElementById('navEstrenos');
  if (navEstrenos) {
    navEstrenos.addEventListener('click', (e) => {
      e.preventDefault();
      alert("Estrenos INCAA: Visualizando catálogo oficial actualizado de cine nacional.");
    });
  }

  const navPromos = document.getElementById('navPromos');
  if (navPromos) {
    navPromos.addEventListener('click', (e) => {
      e.preventDefault();
      alert("Promociones vigentes: 2x1 con tarjetas adheridas y beneficios CineNova Club.");
    });
  }

  // ==========================================
  // NUEVA FUNCIÓN PARA OBTENER LA FECHA
  // ==========================================
  function obtenerFechaEstructurada(diasAAgregar) {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const mesesAnio = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const fecha = new Date();
    fecha.setDate(fecha.getDate() + diasAAgregar);

    return {
      textoAmostrar: `${diasSemana[fecha.getDay()]} ${fecha.getDate()} ${mesesAnio[fecha.getMonth()]}`,
      fechaValor: fecha.toISOString().split('T')[0] // Formato YYYY-MM-DD para usar luego en la compra
    };
  }

  // Sincronizar el Reloj Mundial con los 7 botones estáticos de días usando la función
  for (let i = 0; i < 7; i++) {
    const btn = document.getElementById(`day-${i}`);
    if (btn) {
      const datosFecha = obtenerFechaEstructurada(i);
      btn.textContent = datosFecha.textoAmostrar;
      btn.dataset.fecha = datosFecha.fechaValor; // Guardamos el valor exacto en el HTML
    }
  }

  // Selector de días interactivo
  const dateBtns = document.querySelectorAll('.date-btn');
  dateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover clase activa de todos y agregar al clickeado
      dateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Opcional: ver en consola la fecha seleccionada
      console.log("Día seleccionado para la función:", btn.dataset.fecha);
    });
  });

  // Modal y Butacas
  const modal = document.getElementById('ticketModal');
  const modalTitle = document.getElementById('modalMovieTitle');
  const closeBtn = document.querySelector('.modal-close');
  const showBtns = document.querySelectorAll('.movie-btn');
  const seatsContainer = document.getElementById('seatsContainer');
  const btnConfirmar = document.getElementById('btnConfirmar');

  const rowsData = [
  { row: 1, left: [1, 2, 3, 4, 5, 6, 7], right: [8, 9, 10, 11, 12, 13, 14], lateral: [1, 2, 3, 4, 5, 6] },
    { row: 2, left: [15, 16, 17, 18, 19, 20, 21], right: [22, 23, 24, 25, 26, 27, 28], lateral: [7, 8, 9, 10, 11, 12] },
    { row: 3, left: [29, 30, 31, 32, 33, 34, 35], right: [36, 37, 38, 39, 40, 41, 42], lateral: [13, 14, 15, 16, 17, 18] },
    { row: 4, left: [43, 44, 45, 46, 47, 48, 49], right: [50, 51, 52, 53, 54, 55, 56], lateral: [19, 20, 21, 22, 23, 24] },
    { row: 5, left: [57, 58, 59, 60, 1, 2, 3], right: [4, 5, 6, 7, 8, 9, 10], lateral: [25, 26, 27, 28, 29, 30] },
    { row: 6, left: [11, 12, 13, 14, 15, 16, 17], right: [18, 19, 20, 21, 22, 23, 24], lateral: [31, 32, 33, 34, 35, 36] },
    { row: 7, left: [25, 26, 27, 28, 29, 30, 31], right: [32, 33, 34, 35, 36, 37, 38], lateral: [37, 38, 39, 40, 41, 42] },
    { row: 8, left: [39, 40, 41, 42, 43, 44, 45], right: [46, 47, 48, 49, 50, 51, 52], lateral: [43, 44, 45, 46, 47, 48] },
    { row: 9, left: [53, 54, 55, 56, 57, 58, 59], right: [60, 1, 2, 3, 4, 5, 6], lateral: [49, 50, 51, 52, 53, 54] },
    { row: 10, left: [7, 8, 9, 10, 11, 12, 13], right: [14, 15, 16, 17, 18, 19, 20], lateral: [55, 56, 57, 58, 59, 60] }
  ];

  function renderSeats() {
    if (!seatsContainer) return;
    seatsContainer.innerHTML = '';
    rowsData.forEach(r => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'seat-row';

      const numLeft = document.createElement('span');
      numLeft.className = 'row-number';
      numLeft.textContent = r.row;
      rowDiv.appendChild(numLeft);

      const leftBlock = document.createElement('div');
      leftBlock.className = 'seats-block';
      r.left.forEach(seatNum => {
        const seat = document.createElement('button');
        seat.className = 'seat';
        seat.textContent = seatNum;
        if (seatNum === 105 || seatNum === 48) {
          seat.classList.add('disabled');
        } else {
          seat.addEventListener('click', () => {
            seat.classList.toggle('selected');
          });
        }
        leftBlock.appendChild(seat);
      });
      rowDiv.appendChild(leftBlock);

      const aisle = document.createElement('div');
      aisle.className = 'aisle';
      rowDiv.appendChild(aisle);

      const rightBlock = document.createElement('div');
      rightBlock.className = 'seats-block';
      r.right.forEach(seatNum => {
        const seat = document.createElement('button');
        seat.className = 'seat';
        seat.textContent = seatNum;
        if (seatNum === 107 || seatNum === 63) {
          seat.classList.add('disabled');
        } else {
          seat.addEventListener('click', () => {
            seat.classList.toggle('selected');
          });
        }
        rightBlock.appendChild(seat);
      });
      rowDiv.appendChild(rightBlock);

      seatsContainer.appendChild(rowDiv);
    });
  }

  // REGLA DE NEGOCIO: Si no está logueado, redirige a login.html
  showBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!usuarioActivo) {
        alert("⚠️ Debes iniciar sesión antes de seleccionar entradas y butacas.");
        window.location.href = './login.html';
        return;
      }

      const card = e.target.closest('.movie-card');
      const movieTitle = card.querySelector('.movie-title').textContent;
      
      // Capturamos el día que esté marcado como activo en ese momento
      const diaActivo = document.querySelector('.date-btn.active');
      const fechaSeleccionada = diaActivo ? diaActivo.dataset.fecha : 'Fecha sin seleccionar';

      if (modalTitle) modalTitle.textContent = `Seleccioná tu butaca - ${movieTitle} (${fechaSeleccionada})`;
      renderSeats();
      if (modal) modal.classList.add('open');
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  window.addEventListener('click', (e) => {
    if (modal && e.target === modal) {
      modal.classList.remove('open');
    }
  });

  if (btnConfirmar && modal) {
    btnConfirmar.addEventListener('click', () => {
      const selected = document.querySelectorAll('.seat.selected');
      if (selected.length === 0) {
        alert('Por favor selecciona al menos una butaca.');
      } else {
        alert(`¡Compra iniciada con éxito! Has seleccionado ${selected.length} butaca(s). Generando comprobante fiscal...`);
        modal.classList.remove('open');
      }
    });
  }
});
  }
});

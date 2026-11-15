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
const slides = document.querySelectorAll('.hero-slide');
let slideActual = 0;
setInterval(() => {
  slides[slideActual].classList.remove('active');
  slideActual = (slideActual + 1) % slides.length;
  slides[slideActual].classList.add('active');
}, 5000);
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

  // Función para obtener la fecha de los botones
  function obtenerFechaEstructurada(diasAAgregar) {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const mesesAnio = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const fecha = new Date();
    fecha.setDate(fecha.getDate() + diasAAgregar);

    return {
      textoAmostrar: `${diasSemana[fecha.getDay()]} ${fecha.getDate()} ${mesesAnio[fecha.getMonth()]}`,
      fechaValor: fecha.toISOString().split('T')[0]
    };
  }

  // Sincronizar los 7 botones de días
  for (let i = 0; i < 7; i++) {
    const btn = document.getElementById(`day-${i}`);
    if (btn) {
      const datosFecha = obtenerFechaEstructurada(i);
      btn.textContent = datosFecha.textoAmostrar;
      btn.dataset.fecha = datosFecha.fechaValor;
    }
  }

  // Selector de días interactivo
  const dateBtns = document.querySelectorAll('.date-btn');
  dateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Modal y Butacas
  const modal = document.getElementById('ticketModal');
  const modalTitle = document.getElementById('modalMovieTitle');
  const closeBtn = document.querySelector('.modal-close');
  const showBtns = document.querySelectorAll('.movie-btn');
  const seatsContainer = document.getElementById('seatsContainer');
  const btnConfirmar = document.getElementById('btnConfirmar');

 // Sistema de butacas de 6 filas (A a F) con numeración del 1 al 8 por fila
      const rowsData = [
        { 
          row: 'A', 
          left:  ['1A', '2A', '3A', '4A'], 
          right: ['5A', '6A', '7A', '8A'] 
        },
        { 
          row: 'B', 
          left:  ['1B', '2B', '3B', '4B'], 
          right: ['5B', '6B', '7B', '8B'] 
        },
        { 
          row: 'C', 
          left:  ['1C', '2C', '3C', '4C'], 
          right: ['5C', '6C', '7C', '8C'] 
        },
        { 
          row: 'D', 
          left:  ['1D', '2D', '3D', '4D'], 
          right: ['5D', '6D', '7D', '8D'] 
        },
        { 
          row: 'E', 
          left:  ['1E', '2E', '3E', '4E'], 
          right: ['5E', '6E', '7E', '8E'] 
        },
        { 
          row: 'F', 
          left:  ['1F', '2F', '3F', '4F'], 
          right: ['5F', '6F', '7F', '8F'] 
        }
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

      // Bloque Izquierdo (1 al 7)
      const leftBlock = document.createElement('div');
      leftBlock.className = 'seats-block';
      r.left.forEach(seatNum => {
        const seat = document.createElement('button');
        seat.className = 'seat';
        seat.textContent = seatNum;
        seat.addEventListener('click', () => {
          seat.classList.toggle('selected');
        });
        leftBlock.appendChild(seat);
      });
      rowDiv.appendChild(leftBlock);

      // Pasillo central
      const aisle = document.createElement('div');
      aisle.className = 'aisle';
      rowDiv.appendChild(aisle);

      // Bloque Derecho (1 al 7)
      const rightBlock = document.createElement('div');
      rightBlock.className = 'seats-block';
      r.right.forEach(seatNum => {
        const seat = document.createElement('button');
        seat.className = 'seat';
        seat.textContent = seatNum;
        seat.addEventListener('click', () => {
          seat.classList.toggle('selected');
        });
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

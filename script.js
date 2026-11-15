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

  // Matriz de butacas con columnas del 1 al 7 por bloque (izquierdo y derecho)
  const rowsData = [
    {// 5 filas visuales (10 bloques de 7 asientos) con numeración continua y letra de la A a la J
      const rowsData = [
        { 
          row: 1, 
          left:  ['1A', '2A', '3A', '4A', '5A', '6A', '7A'], 
          right: ['8B', '9B', '10B', '11B', '12B', '13B', '14B'] 
        },
        { 
          row: 2, 
          left:  ['15C', '16C', '17C', '18C', '19C', '20C', '21C'], 
          right: ['22D', '23D', '24D', '25D', '26D', '27D', '28D'] 
        },
        { 
          row: 3, 
          left:  ['29E', '30E', '31E', '32E', '33E', '34E', '35E'], 
          right: ['36F', '37F', '38F', '39F', '40F', '41F', '42F'] 
        },
        { 
          row: 4, 
          left:  ['43G', '44G', '45G', '46G', '47G', '48G', '49G'], 
          right: ['50H', '51H', '52H', '53H', '54H', '55H', '56H'] 
        },
        { 
          row: 5, 
          left:  ['57I', '58I', '59I', '60I', '61I', '62I', '63I'], 
          right: ['64J', '65J', '66J', '67J', '68J', '69J', '70J'] 
        }
      ];
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

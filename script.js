// Función para calcular descuentos (Martes 2x1 / Miércoles 50% OFF)
function calcularTotalTicket(preciosArticulos, diaDeLaSemana) {
  if (!preciosArticulos || preciosArticulos.length === 0) return 0;

  let total = 0;
  const dia = diaDeLaSemana.toLowerCase();
  const subtotal = preciosArticulos.reduce((acc, precio) => acc + precio, 0);

  if (dia === 'martes') {
    const articulosOrdenados = [...preciosArticulos].sort((a, b) => b - a);
    for (let i = 0; i < articulosOrdenados.length; i++) {
      if (i % 2 === 0) {
        total += articulosOrdenados[i];
      }
    }
  } else if (dia === 'miercoles' || dia === 'miércoles') {
    total = subtotal * 0.5;
  } else {
    total = subtotal;
  }

  return total;
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Verificamos si hay sesión activa en localStorage
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

  // Carrusel Hero Automático (Protegido)
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 0) {
    let slideActual = 0;
    setInterval(() => {
      slides[slideActual].classList.remove('active');
      slideActual = (slideActual + 1) % slides.length;
      slides[slideActual].classList.add('active');
    }, 5000);
  }

  // Redirigir a la página de login al hacer clic en Iniciar Sesión (Ruta corregida)
  if (btnLogin) {
    btnLogin.addEventListener('click', () => {
      if (!usuarioActivo) {
        window.location.href = './Login/login.html';
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
      document.querySelector('.movies-grid').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const navPromos = document.getElementById('navPromos');
  const promoModal = document.getElementById('promoModal');
  const closePromo = document.getElementById('closePromo');

  if (navPromos && promoModal) {
    navPromos.addEventListener('click', (e) => {
      e.preventDefault();
      promoModal.classList.add('open');
    });
  }
  if (closePromo && promoModal) closePromo.addEventListener('click', () => promoModal.classList.remove('open'));
  if (promoModal) promoModal.addEventListener('click', (e) => { if(e.target === promoModal) promoModal.classList.remove('open'); });

  // Generador de Cupón Sorpresa (Ruta corregida)
  const btnGenerateCoupon = document.getElementById('btnGenerateCoupon');
  const couponResult = document.getElementById('couponResult');
  const cupones = ['NOVA20', 'POCHOCLOSFREE', 'CINE50', 'VIPUPGRADE', 'SUPERNOVA10'];

  if (btnGenerateCoupon) {
    btnGenerateCoupon.addEventListener('click', () => {
      if (!usuarioActivo) {
        alert("⚠️ Debes iniciar sesión para poder generar y ver tu cupón sorpresa.");
        window.location.href = './Login/login.html';
        return; 
      }
      let cuponAleatorio = cupones[Math.floor(Math.random() * cupones.length)];
      if (couponResult) couponResult.textContent = cuponAleatorio;
      navigator.clipboard.writeText(cuponAleatorio).then(() => {
        alert(`¡Felicidades! Tu código ${cuponAleatorio} se copió al portapapeles.`);
      });
      btnGenerateCoupon.textContent = "Cupón Generado ✔️";
      btnGenerateCoupon.style.backgroundColor = "#28a745";
      btnGenerateCoupon.disabled = true;
    });
  }

  const btnModoAhorro = document.getElementById('btnModoAhorro');
  if (btnModoAhorro) {
    btnModoAhorro.addEventListener('click', () => {
      const dateBtnsArray = Array.from(document.querySelectorAll('.date-btn'));
      const diaAhorro = dateBtnsArray.find(btn => btn.dataset.numeroDiaSemana == "2" || btn.dataset.numeroDiaSemana == "3");
      if (diaAhorro) {
        diaAhorro.click(); 
        if (promoModal) promoModal.classList.remove('open'); 
        document.querySelector('.movies-grid').scrollIntoView({ behavior: 'smooth' }); 
      } else {
        alert("En los próximos 7 días no tenemos promociones programadas.");
      }
    });
  }

  // Configuración de Cartelera e Información de Películas
  const carteleraInfo = {
    "Puan": { 
      diasPermitidos: [0, 1, 2, 3, 4, 5, 6], 
      horariosSemana: ["17:30", "20:00", "22:30"],
      horariosFinde: ["15:00", "18:00", "21:00", "23:45"],
      sala: "Sala 1 (INCAA)",
      clasificacion: "ATP"
    },
    "Argentina, 1985": { 
      diasPermitidos: [0, 4, 5, 6], 
      horariosSemana: ["19:00"], 
      horariosFinde: ["19:30", "22:45"],
      sala: "Sala 2 (Atmos)",
      clasificacion: "SAM 13"
    },
    "Trenque Lauquen": { 
      diasPermitidos: [0, 2, 4, 6], 
      horariosSemana: ["16:00"],
      horariosFinde: ["15:30"],
      sala: "Sala 1 (INCAA)",
      clasificacion: "SAM 13"
    },
    "Blondi": { 
      diasPermitidos: [1, 2, 3], 
      horariosSemana: ["18:15", "20:45"],
      horariosFinde: [],
      sala: "Sala 3",
      clasificacion: "SAM 16"
    }
  };

  const preciosEntradas = { "mayor": 6000, "menor": 4500, "jubilado": 3000 };
  let seleccionFinal = { pelicula: "", fecha: "", hora: "" };

  // Sincronizar los 7 botones de días
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const mesesAnio = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const dateBtns = document.querySelectorAll('.date-btn');

  for (let i = 0; i < 7; i++) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i);
    const numDiaSemana = fecha.getDay();
    const btn = document.getElementById(`day-${i}`);
    if (btn) {
      btn.textContent = `${diasSemana[numDiaSemana]} ${fecha.getDate()} ${mesesAnio[fecha.getMonth()]}`;
      btn.dataset.numeroDiaSemana = numDiaSemana;
      btn.dataset.textoFecha = btn.textContent;
    }
  }

  // Función para actualizar cartelera según el día y filtros
  function actualizarCartelera(boton = document.querySelector('.date-btn.active')) {
    if (!boton) return;
    dateBtns.forEach(b => b.classList.remove('active'));
    boton.classList.add('active');

    let numDia = parseInt(boton.dataset.numeroDiaSemana);
    let esFinde = (numDia === 0 || numDia === 5 || numDia === 6);

    const promoBanner = document.getElementById('promoBanner');
    if (promoBanner) {
      if (numDia === 3) {
        promoBanner.textContent = "🎟️ ¡Miércoles de Cine! 50% de descuento en todas las funciones.";
        promoBanner.style.display = "block";
      } else if (numDia === 2) {
        promoBanner.textContent = "🍿 ¡Martes 2x1 en entradas comprando online!";
        promoBanner.style.display = "block";
      } else {
        promoBanner.style.display = "none";
      }
    }

    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    const selectedCategory = categoryFilter ? categoryFilter.value.toLowerCase() : "all";
    const peliculasDOM = document.querySelectorAll('.movie-card');

    peliculasDOM.forEach(card => {
      let titulo = card.dataset.title;
      let categorias = card.dataset.category || "";
      let infoPeli = carteleraInfo[titulo];
      let contenedorHorarios = card.querySelector('.showtimes-container');

      if (!contenedorHorarios) return;
      contenedorHorarios.innerHTML = '';

      const coincideBusqueda = titulo.toLowerCase().includes(searchTerm);
      const coincideCategoria = selectedCategory === 'all' || categorias.includes(selectedCategory);
      const estaDisponibleElDia = infoPeli && infoPeli.diasPermitidos.includes(numDia);

      if (coincideBusqueda && coincideCategoria && estaDisponibleElDia) {
        card.style.display = "flex"; 
        let horariosAMostrar = esFinde ? infoPeli.horariosFinde : infoPeli.horariosSemana;

        horariosAMostrar.forEach(hora => {
          let btnHora = document.createElement('button');
          btnHora.className = 'time-btn';
          btnHora.textContent = hora;
          btnHora.addEventListener('click', () => {
            prepararCompra(titulo, boton.dataset.textoFecha, hora);
          });
          contenedorHorarios.appendChild(btnHora);
        });
      } else {
        card.style.display = "none";
      }
    });
  }

  actualizarCartelera(document.getElementById('day-0'));

  dateBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      actualizarCartelera(this);
    });
  });

  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  if (searchInput) searchInput.addEventListener('input', () => actualizarCartelera());
  if (categoryFilter) categoryFilter.addEventListener('change', () => actualizarCartelera());

  // Modal y Butacas (6 filas A a F, con 8 asientos por fila)
  const modal = document.getElementById('ticketModal');
  const modalTitle = document.getElementById('modalMovieTitle');
  const closeBtn = document.querySelector('.modal-close');
  const seatsContainer = document.getElementById('seatsContainer');
  const btnConfirmar = document.getElementById('btnConfirmar');

  const rowsData = [
    { row: 'A', left: ['1A', '2A', '3A', '4A'], right: ['5A', '6A', '7A', '8A'] },
    { row: 'B', left: ['1B', '2B', '3B', '4B'], right: ['5B', '6B', '7B', '8B'] },
    { row: 'C', left: ['1C', '2C', '3C', '4C'], right: ['5C', '6C', '7C', '8C'] },
    { row: 'D', left: ['1D', '2D', '3D', '4D'], right: ['5D', '6D', '7D', '8D'] },
    { row: 'E', left: ['1E', '2E', '3E', '4E'], right: ['5E', '6E', '7E', '8E'] },
    { row: 'F', left: ['1F', '2F', '3F', '4F'], right: ['5F', '6F', '7F', '8F'] }
  ];

  function renderSeats() {
    if (!seatsContainer) return;
    seatsContainer.innerHTML = '';

    const qMayor = document.getElementById('qtyMayor');
    const qMenor = document.getElementById('qtyMenor');
    const qJubilado = document.getElementById('qtyJubilado');
    if(qMayor) qMayor.textContent = '0';
    if(qMenor) qMenor.textContent = '0';
    if(qJubilado) qJubilado.textContent = '0';

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
        seat.addEventListener('click', () => {
          seat.classList.toggle('selected');
          actualizarContadorButacas();
        });
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
        seat.addEventListener('click', () => {
          seat.classList.toggle('selected');
          actualizarContadorButacas();
        });
        rightBlock.appendChild(seat);
      });
      rowDiv.appendChild(rightBlock);

      seatsContainer.appendChild(rowDiv);
    });
    actualizarContadorButacas();
  }

  function actualizarContadorButacas() {
    const selected = document.querySelectorAll('.seat.selected');
    const countSpan = document.getElementById('countSelectedSeats');
    if (countSpan) countSpan.textContent = selected.length;
  }

  document.querySelectorAll('.btn-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.target.getAttribute('data-target');
      const span = document.getElementById(targetId);
      if (span) {
        span.textContent = parseInt(span.textContent || '0') + 1;
      }
    });
  });

  document.querySelectorAll('.btn-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.target.getAttribute('data-target');
      const span = document.getElementById(targetId);
      if (span) {
        let val = parseInt(span.textContent || '0');
        if (val > 0) span.textContent = val - 1;
      }
    });
  });

  // Preparar compra (Ruta corregida)
  function prepararCompra(titulo, fecha, hora) {
    if (!usuarioActivo) {
      alert("⚠️ Debes iniciar sesión antes de seleccionar entradas y butacas.");
      window.location.href = './Login/login.html';
      return;
    }

    seleccionFinal.pelicula = titulo;
    seleccionFinal.fecha = fecha;
    seleccionFinal.hora = hora;

    if (modalTitle) modalTitle.textContent = `Seleccioná tu butaca - ${titulo} (${fecha} - ${hora}hs)`;
    renderSeats();
    if (modal) modal.classList.add('open');
  }

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

  const receiptModal = document.getElementById('receiptModal');
  const btnCerrarRecibo = document.getElementById('btnCerrarRecibo');

  if (btnConfirmar && modal) {
    btnConfirmar.addEventListener('click', () => {
      const selected = document.querySelectorAll('.seat.selected');
      if (selected.length === 0) {
        alert('Por favor selecciona al menos una butaca.');
        return;
      }

      const qMayor = parseInt(document.getElementById('qtyMayor')?.textContent) || 0;
      const qMenor = parseInt(document.getElementById('qtyMenor')?.textContent) || 0;
      const qJubilado = parseInt(document.getElementById('qtyJubilado')?.textContent) || 0;
      const totalTicketsIngresados = qMayor + qMenor + qJubilado;

      if (totalTicketsIngresados !== selected.length) {
        alert(`⚠️ La cantidad total de entradas ingresadas (${totalTicketsIngresados}) no coincide con el número de butacas seleccionadas (${selected.length}). Por favor ajustá los números.`);
        return;
      }

      const numVenta = Math.floor(Math.random() * 90000000) + 10000000;
      const numFuncion = Math.floor(Math.random() * 9000) + 1000;
      const peliData = carteleraInfo[seleccionFinal.pelicula];

      let preciosArticulos = [];
      for(let i=0; i<qMayor; i++) preciosArticulos.push(preciosEntradas.mayor);
      for(let i=0; i<qMenor; i++) preciosArticulos.push(preciosEntradas.menor);
      for(let i=0; i<qJubilado; i++) preciosArticulos.push(preciosEntradas.jubilado);

      const diaDeLaSemana = seleccionFinal.fecha.split(' ')[0];
      const precioTotal = calcularTotalTicket(preciosArticulos, diaDeLaSemana);

      let butacasIds = [];
      selected.forEach(s => butacasIds.push(s.textContent));

      const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
      setVal('recVenta', numVenta);
      setVal('recFuncion', numFuncion);
      setVal('recFecha', `${seleccionFinal.fecha} - ${seleccionFinal.hora}hs`);
      setVal('recPeli', seleccionFinal.pelicula);
      setVal('recClasif', peliData.clasificacion);
      setVal('recSala', peliData.sala);
      setVal('recButacas', butacasIds.join(', '));
      setVal('recCant', selected.length);

      const recTiposContainer = document.getElementById('recTiposContainer');
      if (recTiposContainer) {
        recTiposContainer.innerHTML = '';
        if (qMayor > 0) {
          recTiposContainer.innerHTML += `<div class="receipt-row"><span>General / Mayor x${qMayor}:</span> <strong>$${(qMayor * preciosEntradas.mayor).toLocaleString('es-AR')}</strong></div>`;
        }
        if (qMenor > 0) {
          recTiposContainer.innerHTML += `<div class="receipt-row"><span>Menor de 16 años x${qMenor}:</span> <strong>$${(qMenor * preciosEntradas.menor).toLocaleString('es-AR')}</strong></div>`;
        }
        if (qJubilado > 0) {
          recTiposContainer.innerHTML += `<div class="receipt-row"><span>Jubilado x${qJubilado}:</span> <strong>$${(qJubilado * preciosEntradas.jubilado).toLocaleString('es-AR')}</strong></div>`;
        }
      }

      const filaDescuento = document.getElementById('filaDescuento');
      if (filaDescuento) {
        if (diaDeLaSemana.toLowerCase() === 'martes') {
          filaDescuento.style.display = 'flex';
          setVal('recPromo', 'Martes 2x1 aplicado');
        } else if (diaDeLaSemana.toLowerCase() === 'miércoles' || diaDeLaSemana.toLowerCase() === 'miercoles') {
          filaDescuento.style.display = 'flex';
          setVal('recPromo', 'Miércoles 50% OFF aplicado');
        } else {
          filaDescuento.style.display = 'none';
        }
      }

      setVal('recTotal', precioTotal.toLocaleString('es-AR'));

      modal.classList.remove('open');
      if (receiptModal) receiptModal.classList.add('open');
    });
  }

  if (btnCerrarRecibo && receiptModal) {
    btnCerrarRecibo.addEventListener('click', () => {
      receiptModal.classList.remove('open');
      alert("El comprobante se ha guardado en tu cuenta y enviado a tu correo registrado.");
    });
  }
});

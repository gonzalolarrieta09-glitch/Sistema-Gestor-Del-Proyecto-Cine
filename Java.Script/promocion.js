// ==========================================
// CineNova - Promociones (promocion.js)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- DATOS ----------
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Mismos precios que en index.html
  const preciosEntradas = { mayor: 6000, menor: 4500, jubilado: 3000 };

  // dias: números de getDay() (0 = Domingo ... 6 = Sábado)
  const promociones = [
    {
      id: 'martes2x1',
      icono: '🍿',
      titulo: '2x1 los Martes',
      dias: [2],
      descripcion: 'Llevate dos entradas al precio de una comprando online.',
      condicion: 'Se cobra la entrada más cara de cada par.'
    },
    {
      id: 'miercoles50',
      icono: '🎟️',
      titulo: '50% OFF los Miércoles',
      dias: [3],
      descripcion: 'A mitad de precio en todas las funciones del día.',
      condicion: 'Válido para todos los tipos de entrada.'
    },
    {
      id: 'nova20',
      icono: '💳',
      titulo: 'Tarjeta Nova 20%',
      dias: [4, 5, 6, 0],
      descripcion: '20% de descuento de Jueves a Domingo con tu Tarjeta Nova.',
      condicion: 'Presentá la tarjeta en boletería.'
    },
    {
      id: 'jubilados',
      icono: '👵',
      titulo: 'Tarifa Jubilados',
      dias: [0, 1, 2, 3, 4, 5, 6],
      descripcion: 'Entrada a $3.000 todos los días de la semana.',
      condicion: 'Presentando DNI o credencial de jubilado.'
    },
    {
      id: 'menores',
      icono: '🧒',
      titulo: 'Tarifa Menores',
      dias: [0, 1, 2, 3, 4, 5, 6],
      descripcion: 'Entrada reducida a $4.500 para menores.',
      condicion: 'Según clasificación de la película.'
    }
  ];

  const cupones = [
    { codigo: 'NOVA20', desc: '20% de descuento en tu próxima entrada' },
    { codigo: 'POCHOCLOSFREE', desc: 'Pochoclos medianos gratis' },
    { codigo: 'CINE50', desc: '50% en una entrada' },
    { codigo: 'VIPUPGRADE', desc: 'Upgrade a butaca preferencial' },
    { codigo: 'SUPERNOVA10', desc: '10% en toda la compra' }
  ];

  const formatoPesos = (n) => '$' + Math.round(n).toLocaleString('es-AR');
  let usuarioActivo = localStorage.getItem('usuario_activo');

  // ---------- 1. PROMO DE HOY ----------
  const hoy = new Date().getDay();
  const promoHoy = document.getElementById('promoHoy');

  const promosDeHoy = promociones.filter(p => p.dias.includes(hoy) && p.dias.length < 7);
  if (promoHoy && promosDeHoy.length > 0) {
    promoHoy.textContent = `Hoy ${diasSemana[hoy]}: ${promosDeHoy.map(p => p.icono + ' ' + p.titulo).join('  •  ')}`;
    promoHoy.style.display = 'block';
  }

  // ---------- 2. LISTADO Y FILTRO POR DÍA ----------
  const promoGrid = document.getElementById('promoGrid');
  const filtros = document.querySelectorAll('.day-filter');

  function nombreDias(dias) {
    if (dias.length === 7) return 'Todos los días';
    // Ordena de Lunes a Domingo
    const orden = [1, 2, 3, 4, 5, 6, 0];
    return orden.filter(d => dias.includes(d)).map(d => diasSemana[d]).join(', ');
  }

  function renderPromos(filtroDia = 'todos') {
    promoGrid.innerHTML = '';

    const lista = promociones.filter(p =>
      filtroDia === 'todos' || p.dias.includes(parseInt(filtroDia))
    );

    if (lista.length === 0) {
      promoGrid.innerHTML = '<p class="promo-empty">No hay promociones para ese día.</p>';
      return;
    }

    lista.forEach(p => {
      const card = document.createElement('article');
      card.className = 'promo-card';
      card.innerHTML = `
        <div class="promo-icon">${p.icono}</div>
        <h3>${p.titulo}</h3>
        <div class="promo-dias">${nombreDias(p.dias)}</div>
        <p>${p.descripcion}</p>
        <p class="promo-cond">* ${p.condicion}</p>
      `;
      promoGrid.appendChild(card);
    });
  }

  filtros.forEach(btn => {
    btn.addEventListener('click', () => {
      filtros.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPromos(btn.dataset.dia);
    });
  });

  renderPromos();

  // ---------- 3. CALCULADORA DE AHORRO ----------
  const calcDia = document.getElementById('calcDia');
  const calcTipo = document.getElementById('calcTipo');
  const calcCant = document.getElementById('calcCant');
  const calcNova = document.getElementById('calcNova');

  function calcularAhorro() {
    const dia = parseInt(calcDia.value);
    const precio = preciosEntradas[calcTipo.value];
    let cant = parseInt(calcCant.value);

    if (isNaN(cant) || cant < 1) cant = 1;
    if (cant > 10) cant = 10;

    const subtotal = precio * cant;
    let total = subtotal;
    let promoAplicada = '';

    if (dia === 2) {
      // Martes 2x1: se paga una de cada dos entradas (misma lógica que index.html)
      total = precio * Math.ceil(cant / 2);
      promoAplicada = '🍿 Martes 2x1';
    } else if (dia === 3) {
      total = subtotal * 0.5;
      promoAplicada = '🎟️ Miércoles 50% OFF';
    } else if ([4, 5, 6, 0].includes(dia) && calcNova.value === 'si') {
      total = subtotal * 0.8;
      promoAplicada = '💳 Tarjeta Nova 20% OFF';
    }

    document.getElementById('calcSubtotal').textContent = formatoPesos(subtotal);
    document.getElementById('calcTotal').textContent = formatoPesos(total);
    document.getElementById('calcAhorro').textContent = formatoPesos(subtotal - total);
    document.getElementById('calcPromoAplicada').textContent =
      promoAplicada ? `Promo aplicada: ${promoAplicada}` : 'Sin promoción para esta selección';
  }

  [calcDia, calcTipo, calcCant, calcNova].forEach(el => {
    el.addEventListener('input', calcularAhorro);
    el.addEventListener('change', calcularAhorro);
  });

  calcDia.value = hoy; // arranca en el día actual
  calcularAhorro();

  // ---------- 4. CUPÓN SORPRESA ----------
  const btnGenerateCoupon = document.getElementById('btnGenerateCoupon');
  const couponResult = document.getElementById('couponResult');
  const couponDesc = document.getElementById('couponDesc');

  btnGenerateCoupon.addEventListener('click', () => {
    if (!usuarioActivo) {
      alert('⚠️ Debes iniciar sesión para poder generar y ver tu cupón sorpresa.');
      window.location.href = './login.html';
      return;
    }

    const cupon = cupones[Math.floor(Math.random() * cupones.length)];
    couponResult.textContent = cupon.codigo;
    couponDesc.textContent = cupon.desc;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(cupon.codigo)
        .then(() => alert(`¡Felicidades! Tu código ${cupon.codigo} se copió al portapapeles. ¡Mostralo en la boletería!`))
        .catch(() => alert(`¡Felicidades! Tu código es ${cupon.codigo}. ¡Mostralo en la boletería!`));
    } else {
      alert(`¡Felicidades! Tu código es ${cupon.codigo}. ¡Mostralo en la boletería!`);
    }

    btnGenerateCoupon.textContent = 'Cupón Generado ✔️';
    btnGenerateCoupon.disabled = true;
  });

  // ---------- 5. VOLVER A CARTELERA ----------
  document.getElementById('btnVolver').addEventListener('click', () => {
    window.location.href = './index.html';
  });

  // ---------- 6. BOTÓN DE LOGIN (igual que en index.html) ----------
  const btnLogin = document.getElementById('btnLogin');

  function actualizarBotonLogin() {
    if (!btnLogin) return;
    if (usuarioActivo) {
      btnLogin.textContent = 'Mi Cuenta';
      btnLogin.style.backgroundColor = '#28a745';
    } else {
      btnLogin.textContent = 'Iniciar Sesión';
      btnLogin.style.backgroundColor = '#e50914';
    }
  }

  actualizarBotonLogin();

  if (btnLogin) {
    btnLogin.addEventListener('click', () => {
      if (!usuarioActivo) {
        window.location.href = './login.html';
      } else if (confirm('Sesión activa: ' + usuarioActivo + '\n¿Deseas cerrar sesión?')) {
        localStorage.removeItem('usuario_activo');
        usuarioActivo = null;
        actualizarBotonLogin();
        alert('Sesión cerrada.');
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // 1. Selector de días interactivo
  const dateBtns = document.querySelectorAll('.date-btn');
  dateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 2. Modal y Butacas
  const modal = document.getElementById('ticketModal');
  const modalTitle = document.getElementById('modalMovieTitle');
  const closeBtn = document.querySelector('.modal-close');
  const showBtns = document.querySelectorAll('.movie-btn');
  const seatsContainer = document.getElementById('seatsContainer');
  const btnConfirmar = document.getElementById('btnConfirmar');

  // Estructura de butacas (Filas 2 a 10 con pasillo central)
  const rowsData = [
    { row: 2, left: [214, 212, 210, 28, 26, 24, 22], right: [21, 23, 25, 27, 29, 211] },
    { row: 3, left: [314, 312, 310, 38, 36, 34, 32], right: [31, 33, 35, 37, 39, 311] },
    { row: 4, left: [414, 412, 410, 48, 46, 44, 42], right: [41, 43, 45, 47, 49, 411] },
    { row: 5, left: [514, 512, 510, 58, 56, 54, 52], right: [51, 53, 55, 57, 59, 511] },
    { row: 6, left: [614, 612, 610, 68, 66, 64, 62], right: [61, 63, 65, 67, 69, 611] },
    { row: 7, left: [714, 712, 710, 78, 76, 74, 72], right: [71, 73, 75, 77, 79, 711] },
    { row: 8, left: [814, 812, 810, 88, 86, 84, 82], right: [81, 83, 85, 87, 89, 811] },
    { row: 9, left: [912, 910, 98, 96, 94, 92], right: [91, 93, 95, 97, 99, 911] },
    { row: 10, left: [1012, 1010, 108, 106, 104, 102], right: [101, 105, 107, 109, 1011] },
  ];

  function renderSeats() {
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

  showBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.movie-card');
      const movieTitle = card.querySelector('.movie-title').textContent;
      if (modalTitle) modalTitle.textContent = `Seleccioná tu butaca - ${movieTitle}`;
      renderSeats();
      if (modal) modal.classList.add('open');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  btnConfirmar.addEventListener('click', () => {
    const selected = document.querySelectorAll('.seat.selected');
    if (selected.length === 0) {
      alert('Por favor selecciona al menos una butaca.');
    } else {
      alert(`¡Excelente! Has seleccionado ${selected.length} butaca(s). ¡Redirigiendo al pago!`);
      modal.classList.remove('open');
    }
  });
});

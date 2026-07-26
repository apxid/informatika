/**
 * CLASS RACE - FRONTEND LOGIC
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const selectClass = document.getElementById("select-class");
  const selectCategory = document.getElementById("select-category");
  const selectTheme = document.getElementById("select-theme");
  const selectCount = document.getElementById("select-count");
  const chkExclude = document.getElementById("chk-exclude");
  const btnStart = document.getElementById("btn-start");
  const btnFullscreen = document.getElementById("btn-fullscreen");
  const trackContainer = document.getElementById("track-container");
  const countdownOverlay = document.getElementById("countdown-overlay");
  const countdownText = document.getElementById("countdown-text");
  const winnerModal = document.getElementById("winner-modal");
  const btnReset = document.getElementById("btn-reset");

  const winner1Text = document.getElementById("winner-1");
  const winner2Text = document.getElementById("winner-2");
  const winner3Text = document.getElementById("winner-3");

  let currentParticipants = [];
  let raceInterval = null;
  let racePositions = [];

  // Mapping Icon Tema
  const themeIcons = {
    Bebek: "🦆",
    Mobil: "🏎️",
    Kelinci: "🐇",
    Kuda: "🐎"
  };

  // 1. Inisialisasi - Load Daftar Kelas
  loadClassList();

  async function loadClassList() {
    try {
      selectClass.innerHTML = `<option value="">Memuat Kelas...</option>`;
      const response = await fetchGasApi('getClasses');
      if (response && response.success && response.data.length > 0) {
        selectClass.innerHTML = response.data
          .map(cls => `<option value="${cls}">Kelas ${cls}</option>`)
          .join('');
      } else {
        selectClass.innerHTML = `<option value="">Gagal Memuat Kelas</option>`;
      }
    } catch (err) {
      console.error("Error loading classes:", err);
      selectClass.innerHTML = `<option value="">Error Server</option>`;
    }
  }

  // 2. Fullscreen Toggle
  btnFullscreen.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  });

  // 3. Mulai Balapan
  btnStart.addEventListener("click", async () => {
    const selectedClass = selectClass.value;
    if (!selectedClass) {
      alert("Silakan pilih kelas terlebih dahulu!");
      return;
    }

    btnStart.disabled = true;
    btnStart.innerText = "Memuat Peserta...";

    const count = parseInt(selectCount.value, 10);
    const category = selectCategory.value;
    const excludePrevious = chkExclude.checked;

    try {
      const res = await fetchGasApi('getRandomStudents', {
        className: selectedClass,
        count: count,
        category: category,
        excludePrevious: excludePrevious
      });

      if (!res.success || !res.data || res.data.length === 0) {
        alert("Tidak ada data siswa yang tersedia untuk kelas/kategori ini.");
        resetStartButton();
        return;
      }

      currentParticipants = res.data;
      renderTracks(currentParticipants);
      startCountdown();

    } catch (err) {
      console.error("Error starting race:", err);
      alert("Gagal mengambil data siswa.");
      resetStartButton();
    }
  });

  // Render Lintasan Bebek di Kolom Kanan
  function renderTracks(students) {
    trackContainer.innerHTML = "";
    const selectedTheme = selectTheme.value;
    const icon = themeIcons[selectedTheme] || "🦆";

    racePositions = students.map(() => 0); // Reset Posisi Persentase (0%)

    students.forEach((student, index) => {
      const trackLine = document.createElement("div");
      trackLine.className = "track-line";
      trackLine.innerHTML = `
        <span class="lane-number">L-${index + 1}</span>
        <div class="runner" id="runner-${index}" style="left: 45px;">
          ${icon} <span class="runner-badge">No. ${student.no_absen || student.noAbsen || (index + 1)} - ${student.nama || student.name}</span>
        </div>
        <div class="finish-line"></div>
      `;
      trackContainer.appendChild(trackLine);
    });
  }

  // Animasi Hitung Mundur
  function startCountdown() {
    countdownOverlay.classList.remove("hidden");
    let count = 3;
    countdownText.innerText = count;

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        countdownText.innerText = count;
      } else {
        clearInterval(timer);
        countdownOverlay.classList.add("hidden");
        runRace();
      }
    }, 800);
  }

  // Simulasi Jalannya Balapan
  function runRace() {
    const totalParticipants = currentParticipants.length;
    const finishWinners = [];
    const startTime = Date.now();

    raceInterval = setInterval(() => {
      let allFinished = true;

      for (let i = 0; i < totalParticipants; i++) {
        if (racePositions[i] < 88) { // 88% adalah batas garis finish
          allFinished = false;
          // Pergerakan acak
          const speed = Math.random() * 3.5 + 0.5;
          racePositions[i] += speed;

          if (racePositions[i] >= 88) {
            racePositions[i] = 88;
            if (!finishWinners.includes(i)) {
              finishWinners.push(i);
            }
          }

          const runnerEl = document.getElementById(`runner-${i}`);
          if (runnerEl) {
            runnerEl.style.left = `calc(${racePositions[i]}% + 10px)`;
          }
        }
      }

      if (allFinished || finishWinners.length === totalParticipants) {
        clearInterval(raceInterval);
        const duration = Math.round((Date.now() - startTime) / 1000);
        handleRaceFinish(finishWinners, duration);
      }
    }, 150);
  }

  // Penanganan Selesai Balapan
  async function handleRaceFinish(winnerIndices, duration) {
    const winners = winnerIndices.map(idx => currentParticipants[idx]);

    const winner1 = winners[0] ? winners[0].nama : "-";
    const winner2 = winners[1] ? winners[1].nama : "-";
    const winner3 = winners[2] ? winners[2].nama : "-";

    // Update Tampilan Podium Kanan
    winner1Text.innerText = winner1;
    winner2Text.innerText = winner2;
    winner3Text.innerText = winner3;

    // Update Modal
    document.getElementById("modal-winner-1").innerText = winner1;
    document.getElementById("modal-winner-2").innerText = winner2;
    document.getElementById("modal-winner-3").innerText = winner3;

    // Tampilkan Confetti
    if (typeof confetti === "function") {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    setTimeout(() => {
      winnerModal.classList.remove("hidden");
    }, 500);

    // Simpan ke Spreadsheet via Backend API
    const payload = {
      action: 'saveWinner',
      className: selectClass.value,
      category: selectCategory.value,
      theme: selectTheme.value,
      winner1: winner1,
      winner2: winner2,
      winner3: winner3,
      duration: duration
    };

    try {
      await postGasApi(payload);
    } catch (err) {
      console.error("Gagal menyimpan data pemenang:", err);
    }

    resetStartButton();
  }

  function resetStartButton() {
    btnStart.disabled = false;
    btnStart.innerText = "Mulai Balapan 🚀";
  }

  btnReset.addEventListener("click", () => {
    winnerModal.classList.add("hidden");
  });
});

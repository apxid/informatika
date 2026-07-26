/**
 * CLASS RACE - FRONTEND SCRIPT (script.js)
 * Dihubungkan secara presisi ke window.GAS (gas.js)
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

  // Mapping Icon Tema Lengkap (Menyesuaikan Value Dropdown / Config)
  const themeIcons = {
    Bebek: "🦆",
    duck: "🦆",
    Mobil: "🏎️",
    car: "🏎️",
    Kelinci: "🐇",
    Kuda: "🐎",
    horse: "🐎",
    Robot: "🤖",
    robot: "🤖",
    Roket: "🚀",
    rocket: "🚀",
    Penyu: "🐢",
    turtle: "🐢",
    Penguin: "🐧",
    penguin: "🐧",
    Dino: "🦖",
    dino: "🦖"
  };

  // 1. Inisialisasi - Load Daftar Kelas Menggunakan window.GAS
  loadClassList();

  async function loadClassList() {
    try {
      selectClass.innerHTML = `<option value="">Memuat Kelas...</option>`;
      
      // Memanggil window.GAS.getClasses() dari gas.js
      const response = await window.GAS.getClasses();

      if (response && response.success && response.data.length > 0) {
        selectClass.innerHTML = response.data
          .map(cls => `<option value="${cls}">Kelas ${cls}</option>`)
          .join('');
      } else {
        selectClass.innerHTML = `<option value="">Gagal Memuat Kelas (Cek Sheet)</option>`;
      }
    } catch (err) {
      console.error("Error loading classes:", err);
      selectClass.innerHTML = `<option value="">Error Server</option>`;
    }
  }

  // 2. Fullscreen Toggle
  if (btnFullscreen) {
    btnFullscreen.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    });
  }

  // 3. Tombol Mulai Balapan
  btnStart.addEventListener("click", async () => {
    const selectedClass = selectClass.value;
    if (!selectedClass) {
      alert("Silakan pilih kelas terlebih dahulu!");
      return;
    }

    // Hentikan balapan lama jika sedang berjalan
    if (raceInterval) {
      clearInterval(raceInterval);
      raceInterval = null;
    }

    btnStart.disabled = true;
    btnStart.innerText = "Memuat Peserta...";

    const count = parseInt(selectCount.value, 10);
    const category = selectCategory ? selectCategory.value : "";
    const excludePrevious = chkExclude ? chkExclude.checked : false;

    try {
      // Memanggil window.GAS.getRandomStudents() dari gas.js
      const res = await window.GAS.getRandomStudents(
        selectedClass,
        count,
        category,
        excludePrevious
      );

      if (!res.success || !res.data || res.data.length === 0) {
        alert("Tidak ada data siswa yang ditemukan pada kelas ini.");
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

  // Render Lintasan Balap
  function renderTracks(students) {
    trackContainer.innerHTML = "";
    const selectedTheme = selectTheme ? selectTheme.value : "Bebek";
    const icon = themeIcons[selectedTheme] || "🦆";

    racePositions = students.map(() => 0);

    students.forEach((student, index) => {
      const trackLine = document.createElement("div");
      trackLine.className = "track-line";
      
      const noAbsen = student.no_absen || student.noAbsen || (index + 1);
      const namaSiswa = student.nama || student.name || "Siswa";

      trackLine.innerHTML = `
        <span class="lane-number">L-${index + 1}</span>
        <div class="runner" id="runner-${index}" style="left: 45px;">
          ${icon} <span class="runner-badge">No. ${noAbsen} - ${namaSiswa}</span>
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

  // Simulasi Pergerakan Balapan
  function runRace() {
    const totalParticipants = currentParticipants.length;
    const finishWinners = [];
    const startTime = Date.now();

    raceInterval = setInterval(() => {
      let allFinished = true;

      for (let i = 0; i < totalParticipants; i++) {
        if (racePositions[i] < 88) { // 88% adalah titik batas garis finish
          allFinished = false;
          
          // Gerakan acak per frame
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

  // Penanganan Saat Balapan Selesai
  async function handleRaceFinish(winnerIndices, duration) {
    const winners = winnerIndices.map(idx => currentParticipants[idx]);

    const winner1 = winners[0] ? (winners[0].nama || winners[0].name) : "-";
    const winner2 = winners[1] ? (winners[1].nama || winners[1].name) : "-";
    const winner3 = winners[2] ? (winners[2].nama || winners[2].name) : "-";

    // Update Tampilan Podium Samping
    if (winner1Text) winner1Text.innerText = winner1;
    if (winner2Text) winner2Text.innerText = winner2;
    if (winner3Text) winner3Text.innerText = winner3;

    // Update Pop-up Modal Pemenang
    const modal1 = document.getElementById("modal-winner-1");
    const modal2 = document.getElementById("modal-winner-2");
    const modal3 = document.getElementById("modal-winner-3");

    if (modal1) modal1.innerText = winner1;
    if (modal2) modal2.innerText = winner2;
    if (modal3) modal3.innerText = winner3;

    // Efek Konfeti
    if (typeof confetti === "function") {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    // Tampilkan Modal Pemenang
    setTimeout(() => {
      if (winnerModal) winnerModal.classList.remove("hidden");
    }, 500);

    // Simpan data pemenang ke Google Sheets via window.GAS
    const payload = {
      className: selectClass.value,
      category: selectCategory ? selectCategory.value : "",
      theme: selectTheme ? selectTheme.value : "Bebek",
      winner1: winner1,
      winner2: winner2,
      winner3: winner3,
      duration: duration
    };

    try {
      await window.GAS.saveWinner(payload);
    } catch (err) {
      console.error("Gagal menyimpan data pemenang:", err);
    }

    resetStartButton();
  }

  function resetStartButton() {
    btnStart.disabled = false;
    btnStart.innerText = "Mulai Balapan 🚀";
  }

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (winnerModal) winnerModal.classList.add("hidden");
    });
  }
});

/**
 * MAIN ENGINE & GAME CONTROLLER (CLASS RACE 5 BARIS)
 */
document.addEventListener("DOMContentLoaded", async () => {
  // DOM Elements
  const selectClass = document.getElementById("select-class");
  const selectCategory = document.getElementById("select-category");
  const selectTheme = document.getElementById("select-theme");
  const selectCount = document.getElementById("select-count");
  const chkExclude = document.getElementById("chk-exclude");
  
  const setupPanel = document.getElementById("setup-panel");
  const racePanel = document.getElementById("race-panel");
  const trackContainer = document.getElementById("track-container");
  const countdownOverlay = document.getElementById("countdown-overlay");
  const countdownText = document.getElementById("countdown-text");
  
  const winnerModal = document.getElementById("winner-modal");
  const btnStart = document.getElementById("btn-start");
  const btnReset = document.getElementById("btn-reset");
  const btnFullscreen = document.getElementById("btn-fullscreen");

  let raceInterval = null;
  let currentRunners = [];

  // Inisialisasi Options
  populateOptions();
  await loadClasses();

  function populateOptions() {
    // Populate Categories jika ada di CONFIG
    if (window.CONFIG && CONFIG.CATEGORIES) {
      CONFIG.CATEGORIES.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        selectCategory.appendChild(opt);
      });
    }

    // Populate Themes
    if (window.CONFIG && CONFIG.THEMES) {
      Object.keys(CONFIG.THEMES).forEach(key => {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = `${CONFIG.THEMES[key].icon} ${CONFIG.THEMES[key].name}`;
        selectTheme.appendChild(opt);
      });
    }
  }

  async function loadClasses() {
    if (!window.GAS) return;
    const res = await GAS.getClasses();
    selectClass.innerHTML = "";
    if (res.success) {
      res.data.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = `Kelas ${c}`;
        selectClass.appendChild(opt);
      });
    } else {
      selectClass.innerHTML = "<option>Gagal memuat kelas</option>";
    }
  }

  // Handle Event Klik Start
  btnStart.addEventListener("click", async () => {
    const className = selectClass.value;
    const category = selectCategory.value;
    // Maksimal 5 peserta agar tepat 5 baris lintasan
    const count = Math.min(parseInt(selectCount.value) || 5, 5);
    const exclude = chkExclude.checked;

    btnStart.disabled = true;
    btnStart.textContent = "Sedang Memuat Data...";

    const res = await GAS.getRandomStudents(className, count, category, exclude);
    
    btnStart.disabled = false;
    btnStart.textContent = "Mulai Balapan 🚀";

    if (!res.success || !res.data || res.data.length === 0) {
      alert("Siswa tidak ditemukan atau semua siswa sudah pernah menang!");
      return;
    }

    if (setupPanel) setupPanel.classList.add("hidden");
    if (racePanel) racePanel.classList.remove("hidden");
    
    startSequence(res.data);
  });

  function startSequence(students) {
    const themeKey = selectTheme.value;
    const theme = (window.CONFIG && CONFIG.THEMES && CONFIG.THEMES[themeKey]) 
      ? CONFIG.THEMES[themeKey] 
      : { icon: "🦆", name: "Bebek", bg: "transparent" };
    
    // Ubah Track Background sesuai Tema
    trackContainer.style.background = theme.bg;
    trackContainer.innerHTML = "";

    // Build 5 Race Lanes (Setiap siswa di jalurnya masing-masing)
    currentRunners = students.slice(0, 5).map((s, index) => {
      const trackLine = document.createElement("div");
      trackLine.className = "track-line";

      // Struktur HTML per Lintasan: No. Lintasan + Runner (Avatar + Badge Absen) + Garis Finish
      trackLine.innerHTML = `
        <span class="lane-number">L-${index + 1}</span>
        <div class="runner" id="runner-${index}" style="left: 40px;">
          <span class="avatar">${theme.icon}</span> 
          <span class="runner-badge">No. ${s.no_absen || s.noAbsen || (index + 1)}</span>
        </div>
        <div class="finish-line"></div>
      `;
      
      trackContainer.appendChild(trackLine);

      return {
        id: index,
        fullName: s.nama || s.name, // Simpan Nama Lengkap untuk Podium/Gas
        noAbsen: s.no_absen || s.noAbsen || (index + 1),
        posPercent: 5, // Menggunakan persentase (5% s.d. 85%) agar responsif
        element: trackLine.querySelector(`.runner`),
        finished: false
      };
    });

    // Run Countdown
    runCountdown(() => runEngine());
  }

  function runCountdown(callback) {
    if (!countdownOverlay) {
      callback();
      return;
    }

    countdownOverlay.classList.remove("hidden");
    let count = 3;
    countdownText.textContent = count;

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        countdownText.textContent = count;
      } else if (count === 0) {
        countdownText.textContent = "GO!";
      } else {
        clearInterval(timer);
        countdownOverlay.classList.add("hidden");
        callback();
      }
    }, 1000);
  }

  // Engine Balapan (Efek Saling Mengejar / Overtaking)
  function runEngine() {
    const finishPercent = 85; // Garis Finish di posisi 85% lintasan
    const winners = [];
    const startTime = Date.now();

    if (raceInterval) clearInterval(raceInterval);

    raceInterval = setInterval(() => {
      let activeRunners = 0;

      currentRunners.forEach(r => {
        if (!r.finished) {
          activeRunners++;

          // DINAMIKA SALING MENGEJAR (RANDOM OVERTAKE):
          // Adanya peluang (30%) terjadinya 'speed boost' acak agar posisi terus menyalip
          const isBoosting = Math.random() < 0.3;
          const step = isBoosting ? (Math.random() * 2.5 + 1.2) : (Math.random() * 1.2 + 0.3);
          
          r.posPercent += step;

          // Render posisi terbaru dengan CSS transition pada .runner
          if (r.element) {
            r.element.style.left = `${Math.min(r.posPercent, finishPercent)}%`;
          }

          // Cek Finish
          if (r.posPercent >= finishPercent) {
            r.finished = true;
            winners.push(r.fullName);
          }
        }
      });

      // Berhenti ketika seluruh runner telah finish atau 3 podium terisi
      if (activeRunners === 0 || winners.length >= currentRunners.length) {
        clearInterval(raceInterval);
        const duration = Math.round((Date.now() - startTime) / 1000);
        handleFinish(winners, duration);
      }
    }, 200); // Frame rate pergerakan (200ms cocok dengan CSS transition: 0.3s)
  }

  async function handleFinish(winners, duration) {
    // Tampilkan Confetti
    if (typeof confetti === "function") {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }

    // Tampilkan Nama Lengkap di Podium / Modal Pemenang
    const w1 = winners[0] || "-";
    const w2 = winners[1] || "-";
    const w3 = winners[2] || "-";

    const elW1 = document.getElementById("winner-1");
    const elW2 = document.getElementById("winner-2");
    const elW3 = document.getElementById("winner-3");

    if (elW1) elW1.textContent = w1;
    if (elW2) elW2.textContent = w2;
    if (elW3) elW3.textContent = w3;

    if (winnerModal) winnerModal.classList.remove("hidden");

    // Kirim Data Pemenang ke Spreadsheets
    const payload = {
      className: selectClass.value,
      category: selectCategory.value,
      theme: (window.CONFIG && CONFIG.THEMES && CONFIG.THEMES[selectTheme.value]) 
        ? CONFIG.THEMES[selectTheme.value].name 
        : selectTheme.value,
      winner1: w1,
      winner2: w2,
      winner3: w3,
      duration: duration
    };

    if (window.GAS && typeof GAS.saveWinner === "function") {
      await GAS.saveWinner(payload);
    }
  }

  // Reset UI
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (winnerModal) winnerModal.classList.add("hidden");
      if (racePanel) racePanel.classList.add("hidden");
      if (setupPanel) setupPanel.classList.remove("hidden");
    });
  }

  // Fullscreen Control
  if (btnFullscreen) {
    btnFullscreen.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }
});

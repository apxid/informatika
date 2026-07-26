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

  // Inisialisasi Options & Load Data
  populateOptions();
  await loadClasses();

  function populateOptions() {
    // Populate Categories jika ada di CONFIG
    if (window.CONFIG && CONFIG.CATEGORIES && selectCategory) {
      selectCategory.innerHTML = "";
      CONFIG.CATEGORIES.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        selectCategory.appendChild(opt);
      });
    }

    // Populate Themes
    if (window.CONFIG && CONFIG.THEMES && selectTheme) {
      selectTheme.innerHTML = "";
      Object.keys(CONFIG.THEMES).forEach(key => {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = `${CONFIG.THEMES[key].icon} ${CONFIG.THEMES[key].name}`;
        selectTheme.appendChild(opt);
      });
    }
  }

  async function loadClasses() {
    if (!selectClass) return;
    
    selectClass.innerHTML = "<option value=''>Memuat kelas...</option>";
    selectClass.disabled = true;

    try {
      // Cek apakah objek pemanggil GAS tersedia
      if (!window.GAS || typeof window.GAS.getClasses !== "function") {
        throw new Error("Objek GAS.getClasses tidak ditemukan/belum terhubung.");
      }

      const res = await GAS.getClasses();
      selectClass.innerHTML = "";

      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        res.data.forEach(c => {
          const opt = document.createElement("option");
          // Handle jika res.data berupa string ["7A", "7B"] atau object [{name: "7A"}]
          const classVal = typeof c === "object" ? (c.className || c.kelas || c.name) : c;
          opt.value = classVal;
          opt.textContent = `Kelas ${classVal}`;
          selectClass.appendChild(opt);
        });
        selectClass.disabled = false;
      } else {
        selectClass.innerHTML = "<option value=''>Data kelas kosong / tidak ditemukan</option>";
      }
    } catch (err) {
      console.error("Gagal memuat kelas:", err);
      selectClass.innerHTML = "<option value=''>Gagal memuat kelas (Cek Koneksi/GAS)</option>";
    }
  }

  // Handle Event Klik Start
  btnStart.addEventListener("click", async () => {
    const className = selectClass.value;
    const category = selectCategory ? selectCategory.value : "";
    
    if (!className) {
      alert("Silakan pilih kelas terlebih dahulu!");
      return;
    }

    // Maksimal 5 peserta agar tepat 5 baris lintasan
    const count = Math.min(parseInt(selectCount ? selectCount.value : 5) || 5, 5);
    const exclude = chkExclude ? chkExclude.checked : false;

    btnStart.disabled = true;
    btnStart.textContent = "Sedang Memuat Data...";

    try {
      const res = await GAS.getRandomStudents(className, count, category, exclude);
      
      btnStart.disabled = false;
      btnStart.textContent = "Mulai Balapan 🚀";

      if (!res || !res.success || !res.data || res.data.length === 0) {
        alert("Siswa tidak ditemukan atau semua siswa sudah pernah menang!");
        return;
      }

      if (setupPanel) setupPanel.classList.add("hidden");
      if (racePanel) racePanel.classList.remove("hidden");
      
      startSequence(res.data);
    } catch (err) {
      console.error("Error saat mengambil data siswa:", err);
      alert("Terjadi kesalahan saat mengambil data siswa dari Spreadsheets.");
      btnStart.disabled = false;
      btnStart.textContent = "Mulai Balapan 🚀";
    }
  });

  function startSequence(students) {
    const themeKey = selectTheme ? selectTheme.value : "";
    const theme = (window.CONFIG && CONFIG.THEMES && CONFIG.THEMES[themeKey]) 
      ? CONFIG.THEMES[themeKey] 
      : { icon: "🦆", name: "Bebek", bg: "transparent" };
    
    // Ubah Track Background sesuai Tema
    trackContainer.style.background = theme.bg;
    trackContainer.innerHTML = "";

    // Build 5 Race Lanes
    currentRunners = students.slice(0, 5).map((s, index) => {
      const trackLine = document.createElement("div");
      trackLine.className = "track-line";

      const studentName = s.nama || s.name || "Siswa";
      const studentAbsen = s.no_absen || s.noAbsen || s.absen || (index + 1);

      trackLine.innerHTML = `
        <span class="lane-number">L-${index + 1}</span>
        <div class="runner" id="runner-${index}" style="left: 5%;">
          <span class="avatar">${theme.icon}</span> 
          <span class="runner-badge">No. ${studentAbsen}</span>
        </div>
        <div class="finish-line"></div>
      `;
      
      trackContainer.appendChild(trackLine);

      return {
        id: index,
        fullName: studentName,
        noAbsen: studentAbsen,
        posPercent: 5,
        element: trackLine.querySelector(`.runner`),
        finished: false
      };
    });

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
    const finishPercent = 85;
    const winners = [];
    const startTime = Date.now();

    if (raceInterval) clearInterval(raceInterval);

    raceInterval = setInterval(() => {
      let activeRunners = 0;

      currentRunners.forEach(r => {
        if (!r.finished) {
          activeRunners++;

          // Dinamika saling mengejar (Overtaking)
          const isBoosting = Math.random() < 0.3;
          const step = isBoosting ? (Math.random() * 2.5 + 1.2) : (Math.random() * 1.2 + 0.3);
          
          r.posPercent += step;

          if (r.element) {
            r.element.style.left = `${Math.min(r.posPercent, finishPercent)}%`;
          }

          if (r.posPercent >= finishPercent) {
            r.finished = true;
            winners.push(r.fullName);
          }
        }
      });

      if (activeRunners === 0 || winners.length >= currentRunners.length) {
        clearInterval(raceInterval);
        const duration = Math.round((Date.now() - startTime) / 1000);
        handleFinish(winners, duration);
      }
    }, 200);
  }

  async function handleFinish(winners, duration) {
    if (typeof confetti === "function") {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }

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

    const payload = {
      className: selectClass.value,
      category: selectCategory ? selectCategory.value : "",
      theme: (window.CONFIG && CONFIG.THEMES && selectTheme && CONFIG.THEMES[selectTheme.value]) 
        ? CONFIG.THEMES[selectTheme.value].name 
        : "",
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

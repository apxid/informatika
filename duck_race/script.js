/**
 * MAIN ENGINE & GAME CONTROLLER
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
    // Populate Categories
    CONFIG.CATEGORIES.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      selectCategory.appendChild(opt);
    });

    // Populate Themes
    Object.keys(CONFIG.THEMES).forEach(key => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = `${CONFIG.THEMES[key].icon} ${CONFIG.THEMES[key].name}`;
      selectTheme.appendChild(opt);
    });
  }

  async function loadClasses() {
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
    const count = parseInt(selectCount.value);
    const exclude = chkExclude.checked;

    btnStart.disabled = true;
    btnStart.textContent = "Sedang Memuat Data...";

    const res = await GAS.getRandomStudents(className, count, category, exclude);
    
    btnStart.disabled = false;
    btnStart.textContent = "Mulai Balapan 🚀";

    if (!res.success || res.data.length === 0) {
      alert("Siswa tidak ditemukan atau semua siswa sudah pernah menang!");
      return;
    }

    setupPanel.classList.add("hidden");
    racePanel.classList.remove("hidden");
    startSequence(res.data);
  });

  function startSequence(students) {
    const themeKey = selectTheme.value;
    const theme = CONFIG.THEMES[themeKey];
    
    // Ubah Track Background sesuai Tema
    trackContainer.style.background = theme.bg;
    trackContainer.innerHTML = "";

    // Build Race Lanes
    currentRunners = students.map((s, index) => {
      const lane = document.createElement("div");
      lane.className = "lane";

      const runner = document.createElement("div");
      runner.className = "runner";
      runner.id = `runner-${index}`;
      runner.innerHTML = `<span class="avatar">${theme.icon}</span> <span class="name">${s.name}</span>`;
      
      lane.appendChild(runner);
      trackContainer.appendChild(lane);

      return {
        id: index,
        name: s.name,
        pos: 0,
        element: runner,
        finished: false
      };
    });

    // Run Countdown
    runCountdown(() => runEngine());
  }

  function runCountdown(callback) {
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

  // Race Loop (Engine Engine)
  function runEngine() {
    const finishLine = trackContainer.clientWidth - 150; // Dynamic Width offset
    const winners = [];
    const startTime = Date.now();

    raceInterval = setInterval(() => {
      let activeRunners = 0;

      currentRunners.forEach(r => {
        if (!r.finished) {
          // Delta acak per tick (Simulasi dinamika kecepatan)
          const step = Math.random() * 3 + 0.5;
          r.pos += step;
          r.element.style.left = `${r.pos}px`;

          if (r.pos >= finishLine) {
            r.finished = true;
            winners.push(r.name);
          } else {
            activeRunners++;
          }
        }
      });

      // Jika semua sudah finish atau minimal 3 juara didapatkan
      if (activeRunners === 0 || winners.length === currentRunners.length) {
        clearInterval(raceInterval);
        const duration = Math.round((Date.now() - startTime) / 1000);
        handleFinish(winners, duration);
      }
    }, 30);
  }

  async function handleFinish(winners, duration) {
    // Tampilkan Confetti
    if (typeof confetti === "function") {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }

    document.getElementById("winner-1").textContent = winners[0] || "-";
    document.getElementById("winner-2").textContent = winners[1] || "-";
    document.getElementById("winner-3").textContent = winners[2] || "-";

    winnerModal.classList.remove("hidden");

    // Kirim Data Pemenang ke Spreadsheets (Payload JSON)
    const payload = {
      className: selectClass.value,
      category: selectCategory.value,
      theme: CONFIG.THEMES[selectTheme.value].name,
      winner1: winners[0] || "",
      winner2: winners[1] || "",
      winner3: winners[2] || "",
      duration: duration
    };

    await GAS.saveWinner(payload);
  }

  // Reset UI
  btnReset.addEventListener("click", () => {
    winnerModal.classList.add("hidden");
    racePanel.classList.add("hidden");
    setupPanel.classList.remove("hidden");
  });

  // Fullscreen Control
  btnFullscreen.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });
});

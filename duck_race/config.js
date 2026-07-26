/**
 * KONFIGURASI APLIKASI CLASS RACE
 */
const CONFIG = {
  // URL Deployment Google Apps Script (Web App)
  GAS_API_URL: "https://script.google.com/macros/s/AKfycbw1hTauG3dHkyjeui4WD8SGOIHi2Cpu0NNLuUW2fVQcZOoLFYKtOtAsJsJfOpYNCdcZwQ/exec",

  // Pilihan Kategori Kegiatan
  CATEGORIES: [
    "Tanya Jawab", 
    "Kuis Harian", 
    "Presentasi", 
    "Kerja Kelompok", 
    "Lainnya"
  ],

  // Pilihan Tema Balapan & Visual Background
  THEMES: {
    duck: { name: "Duck Race", icon: "🦆", bg: "linear-gradient(to bottom, #4facfe, #00f2fe)" },
    robot: { name: "Robot Race", icon: "🤖", bg: "linear-gradient(to bottom, #141e30, #243b55)" },
    car: { name: "Car Race", icon: "🏎️", bg: "linear-gradient(to bottom, #373b44, #4286f4)" },
    rocket: { name: "Rocket Race", icon: "🚀", bg: "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)" },
    horse: { name: "Horse Race", icon: "🐎", bg: "linear-gradient(to bottom, #11998e, #38ef7d)" },
    turtle: { name: "Turtle Race", icon: "🐢", bg: "linear-gradient(to bottom, #134e5e, #71b280)" },
    penguin: { name: "Penguin Race", icon: "🐧", bg: "linear-gradient(to bottom, #e6dada, #274046)" },
    dino: { name: "Dinosaur Race", icon: "🦖", bg: "linear-gradient(to bottom, #1e3c72, #2a5298)" }
  }
};

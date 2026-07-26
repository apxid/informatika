/**
 * CLASS RACE - GAS API SERVICE (gas.js)
 * Modul komunikasi antara Frontend HTML/JS dan Google Apps Script Backend
 */

const GAS = {
  /**
   * Mengambil daftar kelas dari sheet 'Students'
   * @returns {Promise<Object>} { success: boolean, data: Array }
   */
  async getClasses() {
    try {
      const response = await fetch(`${CONFIG.GAS_API_URL}?action=getClasses`);
      if (!response.ok) throw new Error("Gagal terhubung ke server Apps Script");
      return await response.json();
    } catch (error) {
      console.error("GAS Service Error (getClasses):", error);
      return { success: false, message: error.message, data: [] };
    }
  },

  /**
   * Mengambil daftar siswa acak berdasarkan parameter filter balapan
   * @param {string} className - Nama kelas (misal: "7A")
   * @param {number} count - Jumlah peserta balapan
   * @param {string} category - Kategori kegiatan (misal: "Tanya Jawab")
   * @param {boolean} excludeWinners - Status checkbox mengabaikan pemenang sebelumnya
   * @returns {Promise<Object>} { success: boolean, data: Array }
   */
  async getRandomStudents(className, count, category, excludeWinners) {
    try {
      const params = new URLSearchParams({
        action: "getRandomStudents",
        className: className,
        count: count,
        category: category,
        excludeWinners: excludeWinners ? "true" : "false"
      });

      const response = await fetch(`${CONFIG.GAS_API_URL}?${params.toString()}`);
      if (!response.ok) throw new Error("Gagal mengambil data siswa");
      return await response.json();
    } catch (error) {
      console.error("GAS Service Error (getRandomStudents):", error);
      return { success: false, message: error.message, data: [] };
    }
  },

  /**
   * Menyimpan data hasil pemenang balapan ke Google Sheets
   * @param {Object} payload - Data pemenang balapan dari script.js
   * @returns {Promise<Object>} { success: boolean, message: string }
   */
  async saveWinner(payload) {
    try {
      const response = await fetch(CONFIG.GAS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8" // Melewati kendala CORS di Google Apps Script
        },
        body: JSON.stringify({
          action: "saveWinner",
          payload: payload
        })
      });

      if (!response.ok) throw new Error("Gagal menyimpan data pemenang");
      return await response.json();
    } catch (error) {
      console.error("GAS Service Error (saveWinner):", error);
      return { success: false, message: error.message };
    }
  }
};

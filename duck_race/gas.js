/**
 * CLASS RACE - GAS API SERVICE (gas.js)
 * Modul komunikasi hibrida antara Frontend HTML/JS dan Google Apps Script Backend.
 * Mendukung panggilan internal (google.script.run) dan external (fetch API dengan CORS bypass).
 */

window.GAS = {
  /**
   * Helper internal untuk memvalidasi dan menormalisasi respon JSON dari GAS
   * @param {any} result 
   * @returns {Object} { success: boolean, data?: Array, message?: string }
   */
  _parseResponse(result) {
    if (!result) {
      return { success: false, message: "Respon kosong dari server", data: [] };
    }
    // Jika backend mengembalikan Array langsung
    if (Array.isArray(result)) {
      return { success: true, data: result };
    }
    // Jika backend mengembalikan objek standar { success: true, data: [...] }
    if (typeof result === "object") {
      return {
        success: Boolean(result.success),
        data: Array.isArray(result.data) ? result.data : [],
        message: result.message || ""
      };
    }
    return { success: false, message: "Format respon tidak valid", data: [] };
  },

  /**
   * Mengambil daftar kelas dari Google Sheets
   * @returns {Promise<Object>} { success: boolean, data: Array }
   */
  async getClasses() {
    // 1. Mode NATIVE GAS (Menggunakan google.script.run jika di dalam lingkungan Apps Script)
    if (typeof google !== "undefined" && google.script && google.script.run) {
      return new Promise((resolve) => {
        google.script.run
          .withSuccessHandler((res) => resolve(this._parseResponse(res)))
          .withFailureHandler((err) => {
            console.error("GAS Native Error (getClasses):", err);
            resolve({ success: false, message: String(err), data: [] });
          })
          .getClasses();
      });
    }

    // 2. Mode WEB API FETCH (Menggunakan URL Deployment)
    if (window.CONFIG && CONFIG.GAS_API_URL) {
      try {
        const response = await fetch(`${CONFIG.GAS_API_URL}?action=getClasses`, {
          method: "GET",
          mode: "cors",
          redirect: "follow"
        });

        if (!response.ok) throw new Error("Gagal terhubung ke server Apps Script");
        
        const rawJson = await response.json();
        return this._parseResponse(rawJson);
      } catch (error) {
        console.error("GAS Fetch Error (getClasses):", error);
        return { success: false, message: error.message, data: [] };
      }
    }

    // 3. Fallback Mode Offline / Dev Local
    console.warn("GAS Service: Menggunakan Dummy Data untuk Latihan/Lokal");
    return { success: true, data: ["7A", "7B", "7C", "8A", "8B", "9A"] };
  },

  /**
   * Mengambil daftar siswa acak berdasarkan parameter filter balapan
   * @param {string} className - Nama kelas (misal: "7A")
   * @param {number} count - Jumlah peserta balapan (Maks 5)
   * @param {string} category - Kategori kegiatan (misal: "Tanya Jawab")
   * @param {boolean} excludeWinners - Status checkbox mengabaikan pemenang sebelumnya
   * @returns {Promise<Object>} { success: boolean, data: Array }
   */
  async getRandomStudents(className, count, category, excludeWinners) {
    const targetCount = Math.min(parseInt(count) || 5, 5);

    // 1. Mode NATIVE GAS
    if (typeof google !== "undefined" && google.script && google.script.run) {
      return new Promise((resolve) => {
        google.script.run
          .withSuccessHandler((res) => resolve(this._parseResponse(res)))
          .withFailureHandler((err) => {
            console.error("GAS Native Error (getRandomStudents):", err);
            resolve({ success: false, message: String(err), data: [] });
          })
          .getRandomStudents(className, targetCount, category, excludeWinners);
      });
    }

    // 2. Mode WEB API FETCH
    if (window.CONFIG && CONFIG.GAS_API_URL) {
      try {
        const params = new URLSearchParams({
          action: "getRandomStudents",
          className: className || "",
          count: targetCount,
          category: category || "",
          excludeWinners: excludeWinners ? "true" : "false"
        });

        const response = await fetch(`${CONFIG.GAS_API_URL}?${params.toString()}`, {
          method: "GET",
          mode: "cors",
          redirect: "follow"
        });

        if (!response.ok) throw new Error("Gagal mengambil data siswa");

        const rawJson = await response.json();
        return this._parseResponse(rawJson);
      } catch (error) {
        console.error("GAS Fetch Error (getRandomStudents):", error);
        return { success: false, message: error.message, data: [] };
      }
    }

    // 3. Fallback Mode Offline
    const dummyStudents = [
      { no_absen: 1, nama: "Ahmad Dahlan" },
      { no_absen: 5, nama: "Budi Santoso" },
      { no_absen: 12, nama: "Citra Dewi" },
      { no_absen: 18, nama: "Doni Pratama" },
      { no_absen: 22, nama: "Eka Rahmawati" }
    ];
    return { success: true, data: dummyStudents.slice(0, targetCount) };
  },

  /**
   * Menyimpan data hasil pemenang balapan ke Google Sheets
   * @param {Object} payload - Data pemenang balapan dari script.js
   * @returns {Promise<Object>} { success: boolean, message: string }
   */
  async saveWinner(payload) {
    // 1. Mode NATIVE GAS
    if (typeof google !== "undefined" && google.script && google.script.run) {
      return new Promise((resolve) => {
        google.script.run
          .withSuccessHandler((res) => resolve(res))
          .withFailureHandler((err) => {
            console.error("GAS Native Error (saveWinner):", err);
            resolve({ success: false, message: String(err) });
          })
          .saveWinner(payload);
      });
    }

    // 2. Mode WEB API FETCH (Menggunakan text/plain agar terhindar dari Preflight CORS OPTIONS Request)
    if (window.CONFIG && CONFIG.GAS_API_URL) {
      try {
        const response = await fetch(CONFIG.GAS_API_URL, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify({
            action: "saveWinner",
            payload: payload
          }),
          redirect: "follow"
        });

        if (!response.ok) throw new Error("Gagal menyimpan data pemenang");
        
        const resJson = await response.json();
        return {
          success: Boolean(resJson.success),
          message: resJson.message || (resJson.success ? "Berhasil disimpan" : "Gagal menyimpan")
        };
      } catch (error) {
        console.error("GAS Fetch Error (saveWinner):", error);
        return { success: false, message: error.message };
      }
    }

    // 3. Fallback Mode Offline
    console.log("Simpan Pemenang (Offline/Dummy Mode):", payload);
    return { success: true, message: "Berhasil disimpan (Simulasi)" };
  }
};

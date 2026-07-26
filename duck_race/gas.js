/**
 * CLASS RACE - GAS API SERVICE (gas.js)
 * Modul komunikasi hibrida antara Frontend HTML/JS dan Google Apps Script Backend.
 * Mendukung panggilan internal (google.script.run) dan external (fetch API dengan CORS bypass).
 */

window.GAS = {
  /**
   * Helper internal untuk menunggu hingga `CONFIG` siap dimuat
   */
  async _ensureConfigLoaded() {
    let retry = 0;
    while ((!window.CONFIG || !CONFIG.GAS_API_URL) && retry < 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      retry++;
    }
  },

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

    // Tunggu jika CONFIG belum terload sempurna
    await this._ensureConfigLoaded();

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
    return { 
      success: true, 
      data: ["9A", "9B", "9C", "9D", "9E", "9F", "9G", "9H", "9I", "Kelompok"] 
    };
  },

  /**
   * Mengambil daftar siswa acak berdasarkan parameter filter balapan
   * @param {string} className - Nama kelas (misal: "9A")
   * @param {number|string} count - Jumlah peserta balapan (0 = Semua Siswa)
   * @param {string} category - Kategori kegiatan (misal: "Tanya Jawab")
   * @param {boolean} excludeWinners - Status checkbox mengabaikan pemenang sebelumnya
   * @returns {Promise<Object>} { success: boolean, data: Array }
   */
  async getRandomStudents(className, count, category, excludeWinners) {
    const parsedCount = parseInt(count);
    // targetCount = 0 artinya ambil semua siswa di backend
    const targetCount = isNaN(parsedCount) ? 0 : parsedCount;

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

    // Tunggu jika CONFIG belum terload sempurna
    await this._ensureConfigLoaded();

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
      { no_absen: 2, nama: "Budi Santoso" },
      { no_absen: 3, nama: "Citra Dewi" },
      { no_absen: 4, nama: "Doni Pratama" },
      { no_absen: 5, nama: "Eka Rahmawati" }
    ];

    const resultData = targetCount === 0 ? dummyStudents : dummyStudents.slice(0, targetCount);
    return { success: true, data: resultData };
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

    // Tunggu jika CONFIG belum terload sempurna
    await this._ensureConfigLoaded();

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

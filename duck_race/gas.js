/**
 * CLASS RACE - GAS API SERVICE (gas.js)
 * Modul komunikasi antara Frontend HTML/JS dan Google Apps Script Backend.
 * Mendukung panggilan internal (google.script.run) dan external (fetch API).
 * STRICT MODE: Tanpa Data Dummy / Offline Fallback.
 */

window.GAS = {
  /**
   * Helper internal untuk mengambil URL API secara fleksibel (mendukung GAS_API_URL & GAS_URL)
   */
  _getApiUrl() {
    if (typeof window.CONFIG === "undefined" || !window.CONFIG) return "";
    return window.CONFIG.GAS_API_URL || window.CONFIG.GAS_URL || "";
  },

  /**
   * Helper internal untuk memastikan CONFIG terisi.
   * Jika tidak ditemukan dalam batas waktu timeout, langsung lempar Error.
   */
  async _ensureConfigLoaded() {
    let retry = 0;
    while (!this._getApiUrl() && retry < 15) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      retry++;
    }

    if (!this._getApiUrl()) {
      throw new Error("Konfigurasi gagal: 'CONFIG.GAS_API_URL' atau 'CONFIG.GAS_URL' tidak ditemukan di config.js");
    }
  },

  /**
   * Helper internal untuk memvalidasi dan menormalisasi respon JSON dari GAS
   * @param {any} result 
   * @returns {Object} { success: boolean, data?: Array, message?: string }
   */
  _parseResponse(result) {
    if (!result) {
      throw new Error("Respon kosong dari server Google Apps Script.");
    }
    // Jika backend mengembalikan Array langsung
    if (Array.isArray(result)) {
      return { success: true, data: result };
    }
    // Jika backend mengembalikan objek standar { success: true, data: [...] }
    if (typeof result === "object") {
      if (!result.success) {
        throw new Error(result.message || "Backend mengembalikan status gagal (success: false).");
      }
      return {
        success: true,
        data: Array.isArray(result.data) ? result.data : [],
        message: result.message || ""
      };
    }
    throw new Error("Format respon dari Apps Script tidak valid.");
  },

  /**
   * Mengambil daftar kelas dari Google Sheets
   * @returns {Promise<Object>} { success: boolean, data: Array }
   */
  async getClasses() {
    // 1. Mode NATIVE GAS (Jika berjalan langsung di Apps Script HTML Service)
    if (typeof google !== "undefined" && google.script && google.script.run) {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler((res) => {
            try {
              resolve(this._parseResponse(res));
            } catch (err) {
              reject(err);
            }
          })
          .withFailureHandler((err) => {
            console.error("GAS Native Error (getClasses):", err);
            reject(new Error(`GAS Native Error: ${err.message || err}`));
          })
          .getClasses();
      });
    }

    // 2. Mode WEB API FETCH (Menggunakan URL Deployment)
    await this._ensureConfigLoaded();
    const apiUrl = this._getApiUrl();

    console.log("[GAS Service] Fetching classes from:", apiUrl);

    const response = await fetch(`${apiUrl}?action=getClasses`, {
      method: "GET",
      mode: "cors",
      redirect: "follow"
    });

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status} (${response.statusText})`);
    }

    const rawJson = await response.json();
    return this._parseResponse(rawJson);
  },

  /**
   * Mengambil daftar siswa acak berdasarkan parameter filter balapan
   * @param {string} className - Nama kelas (misal: "9A")
   * @param {number|string} count - Jumlah peserta balapan (0 = Semua Siswa)
   * @param {string} category - Kategori kegiatan
   * @param {boolean} excludeWinners - Status checkbox mengabaikan pemenang sebelumnya
   * @returns {Promise<Object>} { success: boolean, data: Array }
   */
  async getRandomStudents(className, count, category, excludeWinners) {
    const parsedCount = parseInt(count, 10);
    const targetCount = isNaN(parsedCount) ? 0 : parsedCount;

    // 1. Mode NATIVE GAS
    if (typeof google !== "undefined" && google.script && google.script.run) {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler((res) => {
            try {
              resolve(this._parseResponse(res));
            } catch (err) {
              reject(err);
            }
          })
          .withFailureHandler((err) => {
            console.error("GAS Native Error (getRandomStudents):", err);
            reject(new Error(`GAS Native Error: ${err.message || err}`));
          })
          .getRandomStudents(className, targetCount, category, excludeWinners);
      });
    }

    // 2. Mode WEB API FETCH
    await this._ensureConfigLoaded();
    const apiUrl = this._getApiUrl();

    const params = new URLSearchParams({
      action: "getRandomStudents",
      className: className || "",
      count: targetCount,
      category: category || "",
      excludeWinners: excludeWinners ? "true" : "false"
    });

    const fullUrl = `${apiUrl}?${params.toString()}`;
    console.log("[GAS Service] Fetching random students from:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      mode: "cors",
      redirect: "follow"
    });

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status} (${response.statusText})`);
    }

    const rawJson = await response.json();
    return this._parseResponse(rawJson);
  },

  /**
   * Menyimpan data hasil pemenang balapan ke Google Sheets
   * @param {Object} payload - Data pemenang balapan dari script.js
   * @returns {Promise<Object>} { success: boolean, message: string }
   */
  async saveWinner(payload) {
    // 1. Mode NATIVE GAS
    if (typeof google !== "undefined" && google.script && google.script.run) {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler((res) => resolve(res))
          .withFailureHandler((err) => {
            console.error("GAS Native Error (saveWinner):", err);
            reject(new Error(`GAS Native Error: ${err.message || err}`));
          })
          .saveWinner(payload);
      });
    }

    // 2. Mode WEB API FETCH
    await this._ensureConfigLoaded();
    const apiUrl = this._getApiUrl();

    console.log("[GAS Service] Saving winner data to:", apiUrl, payload);

    const response = await fetch(apiUrl, {
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

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status} (${response.statusText})`);
    }

    const resJson = await response.json();
    if (!resJson.success) {
      throw new Error(resJson.message || "Gagal menyimpan data pemenang ke Google Sheets.");
    }

    return {
      success: true,
      message: resJson.message || "Berhasil disimpan"
    };
  }
};

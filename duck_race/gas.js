/**
 * MODUL INTERAKSI REST API GOOGLE APPS SCRIPT
 */
const GAS = {
  async fetchAPI(url, options = {}) {
    try {
      const response = await fetch(url, options);
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, message: "Gagal terhubung ke backend server." };
    }
  },

  async getClasses() {
    return await this.fetchAPI(`${CONFIG.GAS_API_URL}?action=getClasses`);
  },

  async getRandomStudents(className, count, category, excludePrevious) {
    const params = new URLSearchParams({
      action: 'randomStudents',
      className,
      count,
      category,
      excludePrevious
    });
    return await this.fetchAPI(`${CONFIG.GAS_API_URL}?${params.toString()}`);
  },

  async saveWinner(payload) {
    return await this.fetchAPI(CONFIG.GAS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Mencegah Preflight CORS pada GAS
      body: JSON.stringify({ action: 'saveWinner', payload })
    });
  },

  async getHistory() {
    return await this.fetchAPI(`${CONFIG.GAS_API_URL}?action=getHistory`);
  }
};

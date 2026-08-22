const quizData = [
    {
        topic: "ALGORITMA DESKRIPTIF",
        clue: "POS 1: PINTU GERBANG",
        question: "Robot harus memahami perintah awal. Apa yang dimaksud dengan Algoritma Deskriptif?",
        options: [
            "Penyusunan instruksi menggunakan kalimat bahasa sehari-hari secara terstruktur.",
            "Visualisasi logika dalam bentuk simbol-simbol grafis jajaran genjang.",
            "Baris kode yang ditulis langsung dalam bahasa pemograman C++.",
            "Proses menerjemahkan file aplikasi ke dalam format mesin."
        ],
        correct: 0,
        explanation: "Algoritma Deskriptif menggunakan kalimat deskriptif biasa (seperti bahasa Indonesia) yang disusun berurutan agar mudah dipahami sebelum diprogram."
    },
    {
        topic: "FLOWCHART",
        clue: "POS 2: PERCABANGAN JALAN",
        question: "Robot menemukan dua cabang jalan. Simbol flowchart berbentuk Belah Ketupat (Decision) berfungsi untuk...",
        options: [
            "Menandai titik awal dan akhir pergerakan robot.",
            "Melakukan kalkulasi matematika sederhana.",
            "Mengevaluasi kondisi keputusan (Ya / Tidak) untuk menentukan jalur.",
            "Menerima masukan sensor masukan dari luar."
        ],
        correct: 2,
        explanation: "Simbol Decision (Belah Ketupat) mengevaluasi kondisi logika. Jika benar (Ya) robot memilih satu jalur, jika salah (Tidak) mengambil jalur lain."
    },
    {
        topic: "PSEUDOCODE",
        clue: "POS 3: PINTU SANDI",
        question: "Perhatikan Pseudocode pintu sandi berikut:\nIF nilai_sandi >= 75 THEN\n   PRINT 'Pintu Terbuka'\nELSE\n   PRINT 'Pintu Terkunci'\nJika robot memasukkan nilai_sandi = 75, apa yang terjadi?",
        options: [
            "Pintu Terkunci",
            "Pintu Terbuka",
            "Sistem Error",
            "Robot Berhenti"
        ],
        correct: 1,
        explanation: "Operator `>=` berarti lebih besar dari atau sama dengan. Karena nilai_sandi = 75, kondisi `75 >= 75` bernilai Benar (True), sehingga pintu terbuka."
    },
    {
        topic: "FLOWCHART",
        clue: "POS 4: SENSOR MASUKAN",
        question: "Simbol jajaran genjang pada flowchart digunakan saat robot melakukan...",
        options: [
            "Membaca Input sensor atau Menampilkan Output hasil.",
            "Perhitungan variabel memori internal.",
            "Memulai atau menghentikan seluruh program.",
            "Perulangan langkah secara terus-menerus."
        ],
        correct: 0,
        explanation: "Jajaran Genjang adalah simbol standar untuk merepresentasikan fungsi Input (membaca data) atau Output (mengeluarkan data)."
    },
    {
        topic: "ALGORITMA DESKRIPTIF",
        clue: "POS 5: ATURAN PERSYARATAN",
        question: "Agar robot tidak kebingungan di labirin, algoritma harus memenuhi syarat 'Definiteness', artinya...",
        options: [
            "Langkah instruksi harus pasti, jelas, dan tidak ambigu (bermakna ganda).",
            "Algoritma tidak boleh berhenti dan berjalan selamanya.",
            "Setiap instruksi wajib dituliskan dengan diagram berwarna.",
            "Output yang dihasilkan harus selalu bernilai positif."
        ],
        correct: 0,
        explanation: "Definiteness (kepastian) menjamin setiap langkah memiliki arti yang eksplisit dan tidak membuat pemroses algoritma ragu."
    },
    {
        topic: "PSEUDOCODE",
        clue: "POS 6: BUKU PETUNJUK",
        question: "Mengapa programmer membuat Pseudocode sebelum menulis program asli untuk robot?",
        options: [
            "Bisa langsung dijalankan oleh mesin tanpa perlu di-compile.",
            "Merancang logika alur penyelesaian masalah tanpa terikat aturan sintaksis yang rumit.",
            "Agar tampilan antarmuka game menjadi lebih indah.",
            "Untuk menghemat konsumsi daya baterai robot."
        ],
        correct: 1,
        explanation: "Pseudocode membantu perancang mematangkan logika dasar penyelesaian masalah sebelum masuk ke penulisan bahasa pemograman yang ketat."
    },
    {
        topic: "FLOWCHART",
        clue: "POS 7: BATAS JALUR",
        question: "Simbol 'Terminator' (oval/kapsul) pada flowchart diletakkan pada...",
        options: [
            "Titik awal (Start) dan titik akhir (Stop) alur algoritma.",
            "Tengah-tengah proses perhitungan.",
            "Tempat percabangan dua kondisi.",
            "Garis penghubung antar modul."
        ],
        correct: 0,
        explanation: "Simbol Terminator berupa bentuk oval berfungsi menandai awal dimulainya alur dan akhir selesainya suatu program."
    },
    {
        topic: "PSEUDOCODE",
        clue: "POS 8: FORMULA NAVIGASI",
        question: "Manakah contoh Pseudocode yang tepat untuk menghitung jarak langkah robot?",
        options: [
            "READ kecepatan, waktu\njarak = kecepatan * waktu\nPRINT jarak",
            "START -> Jalan Lurus -> FINISH",
            "IF robot == jalan THEN PRINT 'Maju'",
            "INPUT gambar_robot"
        ],
        correct: 0,
        explanation: "Pseudocode menggunakan struktur kata perintah ringkas seperti READ/INPUT, kalkulasi variabel `jarak = kecepatan * waktu`, dan output PRINT."
    },
    {
        topic: "FLOWCHART vs PSEUDOCODE",
        clue: "POS 9: PEMETAAN LOGIKA",
        question: "Apa perbedaan bentuk penyajian antara Flowchart dan Pseudocode?",
        options: [
            "Flowchart berupa bagan visual (diagram), sedangkan Pseudocode berupa naskah teks terstruktur.",
            "Flowchart berupa teks kalimat, sedangkan Pseudocode berupa gambar berwarna.",
            "Flowchart khusus untuk robot, sedangkan Pseudocode khusus untuk komputer desktop.",
            "Keduanya tidak memiliki perbedaan bentuk penyajian."
        ],
        correct: 0,
        explanation: "Flowchart disajikan secara visual dengan bagan geometris, sedangkan Pseudocode disajikan dengan teks perintah ringkas menyerupai kode program."
    },
    {
        topic: "LOGIKA ALGORITMA",
        clue: "POS 10: PINTU KELUAR FINISH",
        question: "Aturan Pintu Keluar:\n1. Cek energi robot.\n2. Jika energi > 50 maka Buka Pintu Utama.\n3. Jika tidak, Buka Pintu Darurat.\nJika energi robot = 50, pintu mana yang terbuka?",
        options: [
            "Pintu Utama",
            "Pintu Darurat",
            "Kedua Pintu Terbuka",
            "Pintu Terkunci Total"
        ],
        correct: 1,
        explanation: "Syarat Pintu Utama adalah 'energi > 50' (harus lebih besar dari 50). Karena energi pas 50, kondisi bernilai Salah (False), sehingga sistem membuka Pintu Darurat."
    }
];

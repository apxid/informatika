const quizData = [
    {
        topic: "ALGORITMA DESKRIPTIF",
        icon: "fa-pencil-alt",
        clue: "LOGIKA PEMOGRAMAN",
        question: "Manakah pernyataan yang paling tepat mengenai pengertian Algoritma Deskriptif?",
        options: [
            "Penulisan langkah-langkah penyelesaian masalah menggunakan kalimat bahasa sehari-hari secara terstruktur.",
            "Bagan alur diagram yang menggunakan simbol-simbol geometris khusus.",
            "Perintah langsung berbasis bahasa pemograman C++ atau Python.",
            "Penerjemahan kode secara otomatis oleh mesin komputer."
        ],
        correct: 0,
        explanation: "Algoritma Deskriptif disusun menggunakan kalimat biasa (misal: Bahasa Indonesia) secara sistematis tanpa terikat sintaksis pemograman."
    },
    {
        topic: "FLOWCHART",
        icon: "fa-project-diagram",
        clue: "SIMBOL FLOWCHART",
        question: "Simbol berbentuk belah ketupat (Decision) pada flowchart berfungsi untuk...",
        options: [
            "Menandai titik awal dan akhir dari alur program.",
            "Melakukan proses perhitungan matematika.",
            "Mengambil keputusan berdasarkan kondisi Ya (True) atau Tidak (False).",
            "Menerima masukan data (Input) dari pengguna."
        ],
        correct: 2,
        explanation: "Simbol Decision (Belah Ketupat) digunakan untuk mengevaluasi suatu kondisi logika sehingga menghasilkan cabang alur keputusan."
    },
    {
        topic: "PSEUDOCODE",
        icon: "fa-terminal",
        clue: "EVALUASI LOGIKA",
        question: "Perhatikan pseudocode berikut:\nIF nilai >= 75 THEN\n   PRINT 'Lulus'\nELSE\n   PRINT 'Remedial'\nJika variabel nilai = 75, apa teks yang tercetak?",
        options: [
            "Remedial",
            "Lulus",
            "Error",
            "Tidak terjadi apa-apa"
        ],
        correct: 1,
        explanation: "Operator `>=` artinya lebih besar atau sama dengan. Karena nilai bernilai 75, maka syarat '75 >= 75' terpenuhi (True) dan mencetak 'Lulus'."
    },
    {
        topic: "FLOWCHART",
        icon: "fa-shapes",
        clue: "SIMBOL FLOWCHART",
        question: "Simbol jajaran genjang pada flowchart digunakan untuk alur...",
        options: [
            "Input (Masukan) atau Output (Keluaran) data.",
            "Proses aritmatika/perhitungan.",
            "Penghubung antar halaman.",
            "Memulai program."
        ],
        correct: 0,
        explanation: "Simbol Jajaran Genjang adalah standar visual untuk menggambarkan operasi pembacaan Input data atau penampilkan Output hasil."
    },
    {
        topic: "ALGORITMA DESKRIPTIF",
        icon: "fa-list-ol",
        clue: "PRINSIattribute ALGORITMA",
        question: "Ciri 'Definiteness' dalam penyusunan algoritma berarti...",
        options: [
            "Langkah harus berakhir setelah sejumlah langkah terbatas.",
            "Setiap instruksi harus jelas, pasti, dan tidak bermakna ganda (ambigu).",
            "Harus menghasilkan angka bilangan bulat.",
            "Tampilan algoritma harus berupa diagram."
        ],
        correct: 1,
        explanation: "Definiteness (kepastian) memastikan setiap langkah tidak membingungkan atau menimbulkan tafsir ganda bagi pemrosesnya."
    },
    {
        topic: "PSEUDOCODE",
        icon: "fa-code",
        clue: "STRUKTUR KODE",
        question: "Apa tujuan utama penggunaan Pseudocode bagi seorang programmer?",
        options: [
            "Dapat langsung dijalankan oleh komputer tanpa compiler.",
            "Merancang logika alur program dengan ringkas tanpa terikat aturan ketat bahasa pemograman.",
            "Membuat tampilan aplikasi menjadi lebih menarik.",
            "Mempercepat proses unduhan file di internet."
        ],
        correct: 1,
        explanation: "Pseudocode membantu perancang berfokus pada logika penyelesaian masalah sebelum menulis sintaksis bahasa pemograman yang sebenarnya."
    },
    {
        topic: "FLOWCHART",
        icon: "fa-stop-circle",
        clue: "SIMBOL FLOWCHART",
        question: "Simbol Terminator (berbentuk oval / kapsul) pada flowchart menandai...",
        options: [
            "Awal (Start) atau Akhir (End) dari sebuah alur program.",
            "Proses perulangan instruksi.",
            "Penyimpanan data di memori.",
            "Percabangan kondisi."
        ],
        correct: 0,
        explanation: "Terminator melambangkan titik awal mulai serta titik akhir selesainya suatu proses pada diagram flowchart."
    },
    {
        topic: "PSEUDOCODE",
        icon: "fa-calculator",
        clue: "CONTOH KODE",
        question: "Manakah contoh penulisan pseudocode untuk menghitung luas persegi panjang?",
        options: [
            "READ panjang, lebar\nluas = panjang * lebar\nPRINT luas",
            "Mulai -> Buat Gambar -> Selesai",
            "IF panjang == lebar THEN PRINT 'Persegi'",
            "INPUT gambar_persegi_panjang"
        ],
        correct: 0,
        explanation: "Pseudocode menggunakan kata kunci terstruktur seperti READ/INPUT, kalkulasi variabel `luas = panjang * lebar`, dan penampil hasil PRINT."
    },
    {
        topic: "FLOWCHART vs PSEUDOCODE",
        icon: "fa-exchange-alt",
        clue: "PERBANDINGAN",
        question: "Perbedaan mendasar antara Flowchart dan Pseudocode adalah...",
        options: [
            "Flowchart berupa bagan visual, sedangkan Pseudocode berupa naskah teks mirip bahasa pemrograman.",
            "Flowchart berupa naskah teks, sedangkan Pseudocode menggunakan gambar.",
            "Flowchart hanya untuk bahasa C++, Pseudocode untuk Python.",
            "Keduanya sama sekali tidak memiliki perbedaan."
        ],
        correct: 0,
        explanation: "Flowchart merepresentasikan algoritma secara visual (gambar), sedangkan Pseudocode merepresentasikannya menggunakan teks terstruktur."
    },
    {
        topic: "LOGIKA ALGORITMA",
        icon: "fa-brain",
        clue: "ANALISIS SOAL",
        question: "Algoritma singkat:\n1. Masukkan harga barang.\n2. Jika harga > 100000 maka diskon = 10%.\n3. Jika tidak, diskon = 0%.\nBerapa diskon jika harga barang Rp 100.000?",
        options: [
            "10%",
            "0%",
            "5%",
            "Rp 10.000"
        ],
        correct: 1,
        explanation: "Kondisinya adalah 'harga > 100000' (harus lebih besar). Karena harganya pas Rp 100.000, syarat tidak terpenuhi (False), sehingga mendapat diskon 0%."
    }
];

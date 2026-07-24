/**
 * Data Pertanyaan untuk AI Decision Challenge
 * Terdiri dari situasi sehari-hari yang membutuhkan pemikiran Logika (AND, OR, NOT)
 */

const questions = [
    {
        icon: "fa-solid fa-user-lock",
        question: "Kamu memasukkan Username BENAR dan Password BENAR. Apakah komputer mengizinkan login?",
        answers: ["TRUE", "FALSE", "TERGANTUNG", "TIDAK TAHU"],
        correct: "TRUE",
        explanation: "Komputer menggunakan logika AND. Kedua syarat (Username dan Password) harus benar agar sistem mengizinkan akses."
    },
    {
        icon: "fa-solid fa-mobile-screen",
        question: "HP kamu bisa dibuka dengan Face ID atau PIN. Kamu pakai masker (Face ID gagal), tapi memasukkan PIN dengan benar. Apakah HP terbuka?",
        answers: ["TRUE", "FALSE", "TERGANTUNG", "TIDAK TAHU"],
        correct: "TRUE",
        explanation: "Ini adalah logika OR. Cukup salah satu kondisi yang terpenuhi (PIN benar), maka keputusan akhirnya adalah TRUE."
    },
    {
        icon: "fa-solid fa-money-bill-transfer",
        question: "Saldo ATM kamu Rp50.000, tapi kamu ingin menarik uang Rp100.000. PIN yang kamu masukkan benar. Apakah mesin ATM mengeluarkan uang?",
        answers: ["TRUE", "FALSE", "TERGANTUNG", "TIDAK TAHU"],
        correct: "FALSE",
        explanation: "Logika AND. PIN benar SAJA tidak cukup. Saldo JUGA harus cukup agar transaksi dieksekusi (TRUE)."
    },
    {
        icon: "fa-solid fa-traffic-light",
        question: "Lampu lalu lintas menyala MERAH (Status: TRUE). Apakah sistem otomatis di mobil otonom (AI) memutuskan untuk melaju?",
        answers: ["TRUE", "FALSE", "TERGANTUNG", "TIDAK TAHU"],
        correct: "FALSE",
        explanation: "Logika NOT (Kebalikan). Jika merah = TRUE, maka melaju = FALSE (Jangan jalan!)."
    },
    {
        icon: "fa-solid fa-wifi",
        question: "Kamu terhubung ke router WiFi (TRUE), tetapi kabel internet dari provider terputus (FALSE). Apakah kamu bisa browsing Google?",
        answers: ["TRUE", "FALSE", "TERGANTUNG", "TIDAK TAHU"],
        correct: "FALSE",
        explanation: "Logika AND. Terhubung ke WiFi AND punya akses internet harus keduanya TRUE."
    },
    {
        icon: "fa-solid fa-gamepad",
        question: "Baterai HP 0% (Habis). Kamu memencet tombol Power untuk main game. Apakah sistem game akan berjalan?",
        answers: ["TRUE", "FALSE", "TERGANTUNG", "TIDAK TAHU"],
        correct: "FALSE",
        explanation: "Tanpa daya listrik, kondisi awal sudah FALSE. Sistem tidak akan bisa merespons perintah."
    },
    {
        icon: "fa-solid fa-calendar-check",
        question: "Mesin absensi sekolah mendeteksi sidik jari siswa. Sidik jari valid terdaftar di database. Apakah sistem mencatatnya sebagai 'ALPA'?",
        answers: ["TRUE", "FALSE", "TERGANTUNG", "TIDAK TAHU"],
        correct: "FALSE",
        explanation: "Logika NOT. Hadir = TRUE, maka Alpa = FALSE. Komputer tidak akan mencatat Alpa jika kehadiran terdeteksi."
    },
    {
        icon: "fa-solid fa-book-open-reader",
        question: "Syarat pinjam buku di perpustakaan: Bawa Kartu Pelajar ATAU Pakai Seragam Sekolah. Kamu lupa bawa kartu, tapi memakai seragam. Boleh pinjam?",
        answers: ["TRUE", "FALSE", "TERGANTUNG", "TIDAK TAHU"],
        correct: "TRUE",
        explanation: "Logika OR. Cukup penuhi salah satu syarat (pakai seragam), maka hasilnya TRUE (Diizinkan)."
    },
    {
        icon: "fa-solid fa-graduation-cap",
        question: "Guru sudah mengunci batas waktu pengumpulan tugas di Google Classroom. Kamu mencoba mengirim tugas (Submit) lewat batas waktu. Apakah file terkirim?",
        answers: ["TRUE", "FALSE", "TERGANTUNG", "TIDAK TAHU"],
        correct: "FALSE",
        explanation: "Logika sistem AND/NOT. Jika status 'Terkunci' = TRUE, maka aksi 'Submit' = FALSE (Ditolak)."
    },
    {
        icon: "fa-solid fa-computer",
        question: "Kabel power komputer Lab sudah ditancapkan ke stopkontak (TRUE), tetapi token listrik sekolah habis (FALSE). Apakah komputer menyala saat ditekan powernya?",
        answers: ["TRUE", "FALSE", "TERGANTUNG", "TIDAK TAHU"],
        correct: "FALSE",
        explanation: "Logika AND. Stopkontak terpasang AND ada aliran listrik. Jika salah satu FALSE, sistem mati."
    }
];

const questions = [
    {
        id: 1,
        question: "Lampu Taman Otomatis hanya menyala jika **Hari sudah Malam** DAN **Ada Pergerakan Orang**. Jika sekarang Malam (TRUE) tetapi Tidak Ada Orang (FALSE), apakah lampu menyala?",
        icon: "fa-solid fa-lightbulb",
        clue: "LOGIKA: AND (Kedua kondisi wajib TRUE agar hasil TRUE)",
        answers: [
            { text: "Ya, Lampu Menyala (TRUE)", correct: false },
            { text: "Tidak Menyala (FALSE)", correct: true }
        ],
        explanation: "Operator **AND** butuh kedua kondisi Bernilai TRUE. Karena tidak ada orang (FALSE), maka lampu tidak menyala."
    },
    {
        id: 2,
        question: "Pintu Rumah Pintar akan terbuka jika kamu menempelkan **Kartu Akses** ATAU menggunakan **Sidik Jari**. Jika Kartu tertinggal (FALSE) tapi Sidik Jari cocok (TRUE), apakah pintu terbuka?",
        icon: "fa-solid fa-door-open",
        clue: "LOGIKA: OR (Cukup salah satu TRUE agar hasil TRUE)",
        answers: [
            { text: "Terbuka (TRUE)", correct: true },
            { text: "Tersumbat / Terkunci (FALSE)", correct: false }
        ],
        explanation: "Operator **OR** cukup butuh salah satu syarat terpenuhi (TRUE). Karena sidik jari cocok, pintu terbuka!"
    },
    {
        id: 3,
        question: "Sistem Sensor Kebakaran akan membunyikan alarm jika Detect_Smoke = TRUE. Jika kita memasang logika **NOT (Tidak/Pembalik)** pada sensor, apa keluaran logika dari NOT(TRUE)?",
        icon: "fa-solid fa-bell",
        clue: "LOGIKA: NOT (Membalikkan nilai: TRUE jadi FALSE, FALSE jadi TRUE)",
        answers: [
            { text: "TRUE", correct: false },
            { text: "FALSE", correct: true }
        ],
        explanation: "Gerbang **NOT** selalu membalikkan keadaan. NOT(TRUE) hasilnya adalah **FALSE**."
    },
    {
        id: 4,
        question: "Mode 'Duel 1 vs 1' dalam Game Multiplayer hanya bisa dimulai jika **Pemain A Memilih Siap** DAN **Pemain B Memilih Siap**. Jika Pemain A Siap (TRUE) dan Pemain B Siap (TRUE), apakah game dimulai?",
        icon: "fa-solid fa-gamepad",
        clue: "LOGIKA: AND (Dua-duanya harus TRUE)",
        answers: [
            { text: "Game Dimulai (TRUE)", correct: true },
            { text: "Menunggu Pemain (FALSE)", correct: false }
        ],
        explanation: "Karena kedua pemain bernilai TRUE, kondisi **AND** terpenuhi!"
    },
    {
        id: 5,
        question: "Lampu Saklar Dua arah di tangga menggunakan logika **XOR (Exclusive OR)**. Lampu menyala hanya jika kondisi saklar **BERBEDA**. Jika Saklar Atas = ON (TRUE) dan Saklar Bawah = ON (TRUE), apakah lampu menyala?",
        icon: "fa-solid fa-toggle-on",
        clue: "LOGIKA: XOR (TRUE jika beda kondisi, FALSE jika sama)",
        answers: [
            { text: "Menyala (TRUE)", correct: false },
            { text: "Mati (FALSE)", correct: true }
        ],
        explanation: "Pada **XOR**, jika kedua input bernilai sama (sama-sama TRUE / ON), maka hasilnya adalah **FALSE** (Mati)."
    },
    {
        id: 6,
        question: "Sistem Robot Kasir toko akan memberikan diskon jika Pelanggan adalah **Member** ATAU **Total Belanja > Rp 100.000**. Budi bukan member (FALSE) dan belanjaan Rp 50.000 (FALSE). Apakah Budi dapat diskon?",
        icon: "fa-solid fa-cart-shopping",
        clue: "LOGIKA: OR (Cari minimal satu yang TRUE)",
        answers: [
            { text: "Dapat Diskon (TRUE)", correct: false },
            { text: "Tidak Dapat Diskon (FALSE)", correct: true }
        ],
        explanation: "Pada gerbang **OR**, jika semua syarat FALSE, maka hasil akhirnya tetap **FALSE**."
    },
    {
        id: 7,
        question: "Alarm Mobil Darurat menggunakan logika **NOR (NOT OR)**. Alarm mati (FALSE) jika Pintu Tertutup (TRUE) ATAU Kunci Terpasang (TRUE). Jika Pintu Terbuka (FALSE) dan Kunci Lepas (FALSE), berapakah hasil NOR(FALSE, FALSE)?",
        icon: "fa-solid fa-car-burst",
        clue: "LOGIKA: NOR = NOT (A OR B). Kebalikan dari OR!",
        answers: [
            { text: "Alarm Bunyi / TRUE", correct: true },
            { text: "Alarm Diam / FALSE", correct: false }
        ],
        explanation: "FALSE OR FALSE = FALSE. Karena ada NOT di depannya, hasilnya dibalik menjadi **TRUE** (Alarm berbunyi)."
    },
    {
        id: 8,
        question: "Kamera HP otomatis mengambil foto jika tombol dipencet **XOR** pakai fitur Gestur Tangan (pilih salah satu, tidak boleh dua-duanya). Jika kamu memencet tombol (TRUE) SAMBIL melambaikan tangan (TRUE), apakah foto terambil?",
        icon: "fa-solid fa-camera",
        clue: "LOGIKA: XOR (Hanya mau tepat 1 pilihan yang TRUE)",
        answers: [
            { text: "Terfoto (TRUE)", correct: false },
            { text: "Gagal Foto (FALSE)", correct: true }
        ],
        explanation: "Gerbang **XOR** tidak menyukai dua input bernilai TRUE bersamaan. Maka hasilnya adalah **FALSE**."
    },
    {
        id: 9,
        question: "Sistem Brankas Bank menggunakan **NAND (NOT AND)**. Pintu Brankas Terkunci (FALSE) hanya jika **Kunci A = TRUE** DAN **Kunci B = TRUE**. Jika Kunci A = TRUE tetapi Kunci B = FALSE, berapakah hasil NAND(TRUE, FALSE)?",
        icon: "fa-solid fa-vault",
        clue: "LOGIKA: NAND = NOT (A AND B). Kebalikan dari AND!",
        answers: [
            { text: "Brankas Terbuka / TRUE", correct: true },
            { text: "Brankas Terkunci / FALSE", correct: false }
        ],
        explanation: "TRUE AND FALSE = FALSE. Kebalikan dari FALSE (NOT) adalah **TRUE**."
    },
    {
        id: 10,
        question: "Komputer mengecek sensor kipas: NOT (Suhu Panas). Jika Suhu Panas = FALSE (Ruangan Dingin), maka output logika NOT(FALSE) adalah...",
        icon: "fa-solid fa-fan",
        clue: "LOGIKA: NOT (Pembalik)",
        answers: [
            { text: "TRUE (Kipas/Indikator Aktif)", correct: true },
            { text: "FALSE", correct: false }
        ],
        explanation: "NOT(FALSE) akan membalikkan nilai menjadi **TRUE**."
    }
];

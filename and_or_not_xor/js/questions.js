const questions = [

{
id: 1,
question: "Lampu taman menyala jika hari sudah malam **DAN** ada orang yang lewat. Jika hari sudah malam (TRUE), tetapi tidak ada orang (FALSE), apakah lampu menyala?",
icon: "fa-solid fa-lightbulb",
clue: "LOGIKA: AND → kedua kondisi harus TRUE",
answers: [
{ text: "Ya, lampu menyala (TRUE)", correct: false },
{ text: "Tidak, lampu mati (FALSE)", correct: true }
],
explanation: "AND berarti kedua kondisi harus benar. Karena tidak ada orang bernilai FALSE, maka lampu tidak menyala."
},

{
id: 2,
question: "Pintu rumah bisa dibuka dengan **Kartu Akses ATAU Sidik Jari**. Jika kartu tidak ada (FALSE), tetapi sidik jari cocok (TRUE), apakah pintu terbuka?",
icon: "fa-solid fa-door-open",
clue: "LOGIKA: OR → cukup salah satu kondisi TRUE",
answers: [
{ text: "Ya, pintu terbuka (TRUE)", correct: true },
{ text: "Tidak, pintu terkunci (FALSE)", correct: false }
],
explanation: "OR berarti cukup salah satu kondisi benar. Sidik jari cocok bernilai TRUE, jadi pintu terbuka."
},

{
id: 3,
question: "Sensor mendeteksi asap bernilai TRUE. Jika digunakan operator **NOT**, nilai TRUE akan berubah menjadi apa?",
icon: "fa-solid fa-bell",
clue: "LOGIKA: NOT → membalik nilai TRUE menjadi FALSE",
answers: [
{ text: "TRUE", correct: false },
{ text: "FALSE", correct: true }
],
explanation: "NOT digunakan untuk membalik nilai. TRUE berubah menjadi FALSE."
},

{
id: 4,
question: "Game baru dimulai jika Pemain A siap **DAN** Pemain B siap. Jika Pemain A siap (TRUE) dan Pemain B siap (TRUE), apakah game dimulai?",
icon: "fa-solid fa-gamepad",
clue: "LOGIKA: AND → kedua kondisi harus TRUE",
answers: [
{ text: "Ya, game dimulai (TRUE)", correct: true },
{ text: "Tidak, masih menunggu (FALSE)", correct: false }
],
explanation: "Kedua pemain sudah siap. Karena semua kondisi TRUE, maka hasil AND adalah TRUE."
},

{
id: 5,
question: "Dua saklar lampu menggunakan logika XOR. Lampu menyala jika posisi saklar **berbeda**. Jika Saklar A = ON (TRUE) dan Saklar B = ON (TRUE), apakah lampu menyala?",
icon: "fa-solid fa-toggle-on",
clue: "LOGIKA: XOR → TRUE jika hanya satu kondisi yang TRUE",
answers: [
{ text: "Ya, lampu menyala (TRUE)", correct: false },
{ text: "Tidak, lampu mati (FALSE)", correct: true }
],
explanation: "XOR berarti hanya satu kondisi yang boleh TRUE. Karena kedua saklar sama-sama ON, hasilnya FALSE."
},

{
id: 6,
question: "Budi mendapat diskon jika menjadi **Member ATAU** belanja lebih dari Rp100.000. Budi bukan member (FALSE) dan belanjanya Rp50.000 (FALSE). Apakah Budi mendapat diskon?",
icon: "fa-solid fa-cart-shopping",
clue: "LOGIKA: OR → cukup salah satu kondisi TRUE",
answers: [
{ text: "Ya, mendapat diskon (TRUE)", correct: false },
{ text: "Tidak mendapat diskon (FALSE)", correct: true }
],
explanation: "OR membutuhkan minimal satu kondisi TRUE. Karena keduanya FALSE, Budi tidak mendapat diskon."
},

{
id: 7,
question: "Aplikasi sekolah mengirim notifikasi jika siswa **tidak hadir ATAU** tugas belum dikumpulkan. Siswa hadir (FALSE), tetapi tugas belum dikumpulkan (TRUE). Apakah notifikasi dikirim?",
icon: "fa-solid fa-bell-concierge",
clue: "LOGIKA: OR → cukup salah satu kondisi TRUE",
answers: [
{ text: "Ya, notifikasi dikirim (TRUE)", correct: true },
{ text: "Tidak, notifikasi tidak dikirim (FALSE)", correct: false }
],
explanation: "Salah satu kondisi TRUE, yaitu tugas belum dikumpulkan. Jadi hasil OR adalah TRUE dan notifikasi dikirim."
},

{
id: 8,
question: "Kamera HP dapat mengambil foto dengan tombol **ATAU** gerakan tangan. Tetapi dengan XOR, hanya **salah satu** yang boleh digunakan. Jika tombol ditekan (TRUE) dan tangan juga digerakkan (TRUE), apakah foto diambil?",
icon: "fa-solid fa-camera",
clue: "LOGIKA: XOR → hanya satu kondisi yang boleh TRUE",
answers: [
{ text: "Ya, foto diambil (TRUE)", correct: false },
{ text: "Tidak, foto tidak diambil (FALSE)", correct: true }
],
explanation: "XOR hanya menerima satu kondisi TRUE. Karena tombol dan gerakan tangan sama-sama TRUE, hasilnya FALSE."
},

{
id: 9,
question: "Mesin dapat berjalan jika Saklar A ON **DAN** Saklar B ON. Jika Saklar A ON (TRUE), tetapi Saklar B OFF (FALSE), apakah mesin berjalan?",
icon: "fa-solid fa-industry",
clue: "LOGIKA: AND → kedua kondisi harus TRUE",
answers: [
{ text: "Ya, mesin berjalan (TRUE)", correct: false },
{ text: "Tidak, mesin tidak berjalan (FALSE)", correct: true }
],
explanation: "AND membutuhkan kedua kondisi TRUE. Karena Saklar B FALSE, mesin tidak berjalan."
},

{
id: 10,
question: "Kipas menyala jika suhu **TIDAK panas**. Jika kondisi 'Suhu Panas' bernilai FALSE, apa hasil dari NOT(FALSE)?",
icon: "fa-solid fa-fan",
clue: "LOGIKA: NOT → membalik nilai FALSE menjadi TRUE",
answers: [
{ text: "TRUE", correct: true },
{ text: "FALSE", correct: false }
],
explanation: "NOT membalik nilai. Jika awalnya FALSE, maka hasilnya menjadi TRUE."
}

];

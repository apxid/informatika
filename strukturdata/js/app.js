/*
================================================
TREE & GRAPH QUIZ - SYSTEM ENGINE
Developer : MB
Version   : 1.0
File      : js/app.js
================================================
*/

// State Aplikasi
let currentQuestionIndex = 0;
let scoreCount = 0;
let isAnswered = false;

// Seleksi Elemen DOM - Kontainer Utama (Sections)
const sectionSplash = document.getElementById('splash');
const sectionHome = document.getElementById('home');
const sectionQuiz = document.getElementById('quiz');
const sectionResult = document.getElementById('result');

// Tombol Kontrol Navigasi Utama
const btnStart = document.getElementById('btnStart');
const btnRestart = document.getElementById('btnRestart');

// Komponen Atas Layar Kuis
const scoreDisplay = document.getElementById('score');
const questionNumberText = document.getElementById('questionNumber');
const progressBar = document.getElementById('progressBar');

// Komponen Kartu Soal
const questionImage = document.getElementById('questionImage');
const questionText = document.getElementById('question');

// Kumpulan Tombol Opsi Jawaban (A, B, C, D)
const answerButtons = document.querySelectorAll('.answer-btn');
const textAnswerA = document.getElementById('answerA');
const textAnswerB = document.getElementById('answerB');
const textAnswerC = document.getElementById('answerC');
const textAnswerD = document.getElementById('answerD');

// Komponen Kotak Feedback Jawaban
const feedbackArea = document.getElementById('feedback');
const feedbackIcon = document.getElementById('feedbackIcon');
const feedbackTitle = document.getElementById('feedbackTitle');
const feedbackText = document.getElementById('feedbackText');

// Komponen Layar Hasil Akhir (Result)
const finalScoreText = document.getElementById('finalScore');
const gradeText = document.getElementById('grade');
const correctAnswerText = document.getElementById('correctAnswer');
const wrongAnswerText = document.getElementById('wrongAnswer');

// Komponen Pemutar Audio Efek Suara
const soundCorrect = document.getElementById('soundCorrect');
const soundWrong = document.getElementById('soundWrong');
const soundFinish = document.getElementById('soundFinish');

/* ========================================== */
/* ALUR NAVIGASI & TRANSISI HALAMAN           */
/* ========================================== */

// Alur Otomatis: Splash Screen -> Home Card
document.addEventListener('DOMContentLoaded', () => {
    // Menyelaraskan waktu penutupan splash screen dengan durasi animasi CSS bar loading (2 detik)
    setTimeout(() => {
        sectionSplash.classList.add('hidden');
        sectionHome.classList.remove('hidden');
    }, 2200);
});

// Event Klik: Mulai Permainan
btnStart.addEventListener('click', () => {
    sectionHome.classList.add('hidden');
    sectionQuiz.classList.remove('hidden');
    initQuiz();
});

// Event Klik: Mengulangi Kuis Dari Awal
btnRestart.addEventListener('click', () => {
    sectionResult.classList.add('hidden');
    sectionQuiz.classList.remove('hidden');
    initQuiz();
});

/* ========================================== */
/* LOGIKA UTAMA PERMAINAN KUIS                */
/* ========================================== */

// Fungsi Inisialisasi Ulang Variabel Kuis
function initQuiz() {
    currentQuestionIndex = 0;
    scoreCount = 0;
    scoreDisplay.textContent = "0";
    loadQuestion(currentQuestionIndex);
}

// Fungsi Memuat Soal ke Antarmuka Layar
function loadQuestion(index) {
    isAnswered = false;
    
    // Menyembunyikan komponen feedback dari soal sebelumnya
    feedbackArea.classList.add('hidden');
    
    const currentData = questions[index];
    const totalQuestions = questions.length;
    
    // Sinkronisasi Bar Progress & Informasi Nomor Soal
    questionNumberText.textContent = `Soal ${index + 1} / ${totalQuestions}`;
    const progressPercent = ((index + 1) / totalQuestions) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Memasang Aset Gambar Serta Teks Pertanyaan
    questionImage.src = currentData.image;
    questionImage.alt = "Visualisasi Soal " + (index + 1);
    questionText.textContent = currentData.question;
    
    // Mengisi Label Teks ke Dalam Opsi Pilihan Ganda (A, B, C, D)
    textAnswerA.textContent = currentData.options[0] || "";
    textAnswerB.textContent = currentData.options[1] || "";
    textAnswerC.textContent = currentData.options[2] || "";
    textAnswerD.textContent = currentData.options[3] || "";
    
    // Mengembalikan Semua Status Opsi Tombol ke Kondisi Normal
    answerButtons.forEach(button => {
        button.disabled = false;
        button.className = "answer-btn"; // Menghapus class .correct dan .wrong bawaan
    });
}

// Memasang Event Listener ke Seluruh Tombol Jawaban Sekaligus
answerButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Mendapatkan nomor indeks integer (0-3) dari atribut HTML data-answer
        const selectedIndex = parseInt(button.getAttribute('data-answer'));
        const correctIndex = questions[currentQuestionIndex].answer;
        const explanation = questions[currentQuestionIndex].explanation;
        
        evaluateSelection(button, selectedIndex, correctIndex, explanation);
    });
});

// Fungsi Memproses Evaluasi Jawaban yang Diklik Siswa
function evaluateSelection(selectedButton, selectedIndex, correctIndex, explanation) {
    if (isAnswered) return; // Mencegah klik ganda saat proses transisi jeda berlangsung
    isAnswered = true;
    
    // Mengunci semua tombol agar tidak dapat berinteraksi kembali
    answerButtons.forEach(button => button.disabled = true);
    
    if (selectedIndex === correctIndex) {
        // --- KONDISI JAWABAN BENAR ---
        scoreCount++;
        scoreDisplay.textContent = scoreCount;
        selectedButton.classList.add('correct'); // Memicu transisi warna hijau pada CSS
        
        triggerAudio(soundCorrect);
        
        feedbackIcon.textContent = "✅";
        feedbackTitle.textContent = "Benar!";
    } else {
        // --- KONDISI JAWABAN SALAH ---
        selectedButton.classList.add('wrong'); // Memicu transisi warna merah pada CSS
        
        // Menampilkan kunci jawaban yang benar dengan warna hijau secara otomatis
        answerButtons.forEach(button => {
            if (parseInt(button.getAttribute('data-answer')) === correctIndex) {
                button.classList.add('correct');
            }
        });
        
        triggerAudio(soundWrong);
        
        feedbackIcon.textContent = "❌";
        feedbackTitle.textContent = "Kurang Tepat!";
    }
    
    // Menyajikan Teks Penjelasan Solusi ke Dalam feedback-card
    feedbackText.textContent = explanation;
    feedbackArea.classList.remove('hidden');
    
    // Memberikan Jeda Waktu Membaca Eksplanasi Sebelum Pindah ke Pertanyaan Berikutnya
    setTimeout(() => {
        shiftToNextStep();
    }, 4500); // 4.5 detik memberikan waktu yang ideal untuk dibaca siswa di kelas
}

// Fungsi Mengatur Transisi Urutan Indeks Soal
function shiftToNextStep() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        calculateFinalOutput();
    }
}

// Fungsi Menghitung Nilai Kumulatif & Menyusun Layar Skor Akhir
function calculateFinalOutput() {
    sectionQuiz.classList.add('hidden');
    sectionResult.classList.remove('hidden');
    triggerAudio(soundFinish);
    
    const totalQuestions = questions.length;
    const finalPercentage = Math.round((scoreCount / totalQuestions) * 100);
    
    // Menyuntikkan Data Hasil ke Element HTML
    finalScoreText.textContent = finalPercentage;
    correctAnswerText.textContent = scoreCount;
    wrongAnswerText.textContent = totalQuestions - scoreCount;
    
    // Mengatur Konfigurasi Predikat Belajar Siswa Berdasarkan Persentase Skor
    if (finalPercentage === 100) {
        gradeText.textContent = "🥇 MASTER TREE & GRAPH";
    } else if (finalPercentage >= 80) {
        gradeText.textContent = "🥈 AHLI STRUKTUR DATA";
    } else if (finalPercentage >= 60) {
        gradeText.textContent = "🥉 CUKUP PAHAM";
    } else {
        gradeText.textContent = "📚 PERLU BELAJAR LAGI";
    }
}

// Fungsi Pembantu Guna Menjamin Audio Dapat Diputar Berulang Secara Instan
function triggerAudio(audioNode) {
    if (audioNode) {
        audioNode.currentTime = 0; // Reset ke detik ke-0 agar suara tidak terpotong saat dipicu cepat
        audioNode.play().catch(err => {
            console.warn("Autoplay ditangguhkan peramban hingga interaksi pertama pengguna dipicu:", err);
        });
    }
}

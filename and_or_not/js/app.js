/**
 * Logika Utama Aplikasi AI Decision Challenge
 * Menggunakan Vanilla JavaScript (ES6+)
 */

// ==========================================
// DEKLARASI VARIABEL STATE
// ==========================================
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
const MAX_QUESTIONS = 10; // Sesuai dengan array di questions.js
const SCORE_PER_QUESTION = 10;

// ==========================================
// SELEKTOR DOM
// ==========================================
// Screens
const splashScreen = document.getElementById('splash-screen');
const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

// Audio
const audioCorrect = document.getElementById('audio-correct');
const audioWrong = document.getElementById('audio-wrong');
const audioFinish = document.getElementById('audio-finish');

// Buttons
const btnStart = document.getElementById('btn-start');
const btnNext = document.getElementById('btn-next');
const btnRestart = document.getElementById('btn-restart');
const answerButtonsContainer = document.getElementById('answer-buttons');

// Quiz Elements
const currentQNumEl = document.getElementById('current-q-num');
const totalQNumEl = document.getElementById('total-q-num');
const progressBarEl = document.getElementById('progress-bar');
const currentScoreEl = document.getElementById('current-score');
const questionIconEl = document.getElementById('question-icon');
const questionTextEl = document.getElementById('question-text');

// Feedback Elements
const feedbackCard = document.getElementById('feedback-card');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');

// Result Elements
const finalScoreEl = document.getElementById('final-score');
const finalCorrectEl = document.getElementById('correct-count');
const finalWrongEl = document.getElementById('wrong-count');
const predikatTextEl = document.getElementById('predikat-text');

// ==========================================
// FUNGSI INISIALISASI & NAVIGASI
// ==========================================

// Event Listener saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    // 1. Tangani Splash Screen (Pindah ke Home setelah 2.5 detik)
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');
    }, 2500);

    // Set Total Questions UI
    totalQNumEl.innerText = MAX_QUESTIONS;

    // Tombol Navigasi
    btnStart.addEventListener('click', startQuiz);
    btnNext.addEventListener('click', handleNextQuestion);
    btnRestart.addEventListener('click', restartQuiz);
});

// Fungsi untuk Acak Array (Fisher-Yates Shuffle)
function shuffleArray(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Mulai Kuis
function startQuiz() {
    // Sembunyikan Home, Tampilkan Quiz
    homeScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');

    // Reset State
    currentQuestionIndex = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    
    // Acak Urutan Pertanyaan
    shuffledQuestions = shuffleArray(questions).slice(0, MAX_QUESTIONS);
    
    // Update UI Skor
    updateScoreUI();
    
    // Muat soal pertama
    loadQuestion();
}

// ==========================================
// FUNGSI QUIZ & LOGIKA
// ==========================================

function loadQuestion() {
    // Reset Feedback Card
    feedbackCard.classList.add('hidden');
    feedbackCard.className = 'feedback-card hidden'; // Reset semua kelas warna
    
    const currentQ = shuffledQuestions[currentQuestionIndex];
    
    // Update Header
    currentQNumEl.innerText = currentQuestionIndex + 1;
    const progressPercent = ((currentQuestionIndex) / MAX_QUESTIONS) * 100;
    progressBarEl.style.width = `${progressPercent}%`;

    // Update Pertanyaan & Ikon
    questionIconEl.className = currentQ.icon + " fa-4x";
    questionTextEl.innerText = currentQ.question;

    // Bersihkan container tombol jawaban
    answerButtonsContainer.innerHTML = '';

    // Acak Urutan Jawaban untuk soal ini
    const shuffledAnswers = shuffleArray(currentQ.answers);

    // Buat Tombol Jawaban
    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('btn-answer');
        button.addEventListener('click', () => selectAnswer(button, answer, currentQ.correct, currentQ.explanation));
        answerButtonsContainer.appendChild(button);
    });
}

function selectAnswer(selectedButton, selectedAnswer, correctAnswer, explanation) {
    // 1. Matikan klik semua tombol
    const buttons = answerButtonsContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = selectedAnswer === correctAnswer;

    // 2. Tandai warna di tombol
    if (isCorrect) {
        selectedButton.classList.add('correct-ans');
        selectedButton.innerHTML += ' <i class="fa-solid fa-check"></i>';
        handleCorrect(explanation);
    } else {
        selectedButton.classList.add('wrong-ans');
        selectedButton.innerHTML += ' <i class="fa-solid fa-times"></i>';
        
        // Cari tombol yang benar dan tandai warna hijau agar siswa tahu jawabannya
        buttons.forEach(btn => {
            if (btn.innerText.includes(correctAnswer)) {
                btn.classList.add('correct-ans');
            }
        });
        
        handleWrong(explanation);
    }
}

// Logika Jika Benar
function handleCorrect(explanation) {
    // Mainkan Audio (Pakai try catch mencegah error jika audio belum dimuat browser)
    try { audioCorrect.currentTime = 0; audioCorrect.play(); } catch(e){}

    score += SCORE_PER_QUESTION;
    correctCount++;
    updateScoreUI();

    // Munculkan Confetti & UI Feedback
    createConfetti();
    showFeedbackUI(true, explanation);
}

// Logika Jika Salah
function handleWrong(explanation) {
    try { audioWrong.currentTime = 0; audioWrong.play(); } catch(e){}
    
    wrongCount++;
    
    // Animasi Getar (Shake)
    const quizContainer = document.querySelector('.quiz-container');
    quizContainer.classList.add('shake');
    setTimeout(() => quizContainer.classList.remove('shake'), 500);

    // UI Feedback
    showFeedbackUI(false, explanation);
}

// Tampilkan Kartu Feedback (Penjelasan)
function showFeedbackUI(isCorrect, explanation) {
    feedbackCard.classList.remove('hidden');
    if (isCorrect) {
        feedbackCard.classList.add('correct-feedback');
        feedbackIcon.innerHTML = '<i class="fa-solid fa-check-circle"></i>';
        feedbackTitle.innerText = "TEPAT SEKALI!";
    } else {
        feedbackCard.classList.add('wrong-feedback');
        feedbackIcon.innerHTML = '<i class="fa-solid fa-times-circle"></i>';
        feedbackTitle.innerText = "KURANG TEPAT!";
    }
    feedbackText.innerText = explanation;
}

function updateScoreUI() {
    currentScoreEl.innerText = score;
}

function handleNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < MAX_QUESTIONS) {
        loadQuestion();
    } else {
        // Quiz Selesai, Update Progress Bar penuh dulu
        progressBarEl.style.width = '100%';
        setTimeout(showResult, 500);
    }
}

// ==========================================
// FUNGSI HASIL (RESULT) & CONFETTI
// ==========================================

function showResult() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    try { audioFinish.play(); } catch(e){}

    finalScoreEl.innerText = score;
    finalCorrectEl.innerText = correctCount;
    finalWrongEl.innerText = wrongCount;

    // Tentukan Predikat
    let predikat = "";
    if (score <= 40) {
        predikat = "AI Beginner";
    } else if (score <= 60) {
        predikat = "Logic Explorer";
    } else if (score <= 80) {
        predikat = "Decision Master";
    } else {
        predikat = "Computer Brain";
    }
    
    predikatTextEl.innerText = predikat;
    
    // Lempar banyak confetti di hasil akhir
    for(let i=0; i<3; i++) {
        setTimeout(createConfetti, i * 400);
    }
}

function restartQuiz() {
    resultScreen.classList.add('hidden');
    startQuiz();
}

// Fungsi Efek Confetti Sederhana (Vanilla JS)
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#2563EB', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random posisi, warna, ukuran, dan durasi
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
        
        container.appendChild(confetti);
        
        // Hapus elemen setelah animasi selesai agar tidak memberatkan DOM
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

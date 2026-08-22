// Web Audio API Synthesizer (Tanpa File MP3 External)
class SoundEffects {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playCorrect() {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); 
        osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.1); 
        osc.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.2); 
        
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
        
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.4);
    }

    playWrong() {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.setValueAtTime(180, this.ctx.currentTime + 0.15);
        
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
        
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.35);
    }

    playFinish() {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (idx * 0.12));
            
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime + (idx * 0.12));
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (idx * 0.12) + 0.3);
            
            osc.start(this.ctx.currentTime + (idx * 0.12));
            osc.stop(this.ctx.currentTime + (idx * 0.12) + 0.3);
        });
    }
}

// State Aplikasi
let currentQuestionIndex = 0;
let score = 0;
let correctAnswersCount = 0;
let wrongAnswersCount = 0;
const sfx = new SoundEffects();

// Element Selector
const splashScreen = document.getElementById('splash-screen');
const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const btnStart = document.getElementById('btn-start');
const btnRestart = document.getElementById('btn-restart');
const btnNext = document.getElementById('btn-next');

const currentScoreEl = document.getElementById('current-score');
const currentQNumEl = document.getElementById('current-q-num');
const totalQNumEl = document.getElementById('total-q-num');
const progressBar = document.getElementById('progress-bar');

const questionIcon = document.getElementById('question-icon');
const questionClueContainer = document.getElementById('question-clue');
const clueText = document.getElementById('clue-text');
const questionText = document.getElementById('question-text');
const answerButtonsContainer = document.getElementById('answer-buttons');

const modalBackdrop = document.getElementById('modal-backdrop');
const feedbackCard = document.getElementById('feedback-card');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');

// Splash Auto-Hide
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');
    }, 1800);

    totalQNumEl.textContent = quizData.length;
});

// Event Start
btnStart.addEventListener('click', () => {
    homeScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    resetQuizState();
    loadQuestion();
});

function resetQuizState() {
    currentQuestionIndex = 0;
    score = 0;
    correctAnswersCount = 0;
    wrongAnswersCount = 0;
    currentScoreEl.textContent = '0';
}

function loadQuestion() {
    const currentData = quizData[currentQuestionIndex];

    currentQNumEl.textContent = currentQuestionIndex + 1;
    const progressPercent = (currentQuestionIndex / quizData.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    questionIcon.className = `fa-solid ${currentData.icon} fa-3x`;
    
    if(currentData.clue) {
        questionClueContainer.classList.remove('hidden');
        clueText.textContent = `${currentData.topic} - ${currentData.clue}`;
    } else {
        questionClueContainer.classList.add('hidden');
    }

    questionText.innerText = currentData.question;

    answerButtonsContainer.innerHTML = '';
    currentData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'btn-answer';
        button.innerHTML = `<span style="font-weight:700; margin-right:12px; color:var(--secondary-color);">${String.fromCharCode(65 + index)}.</span> ${option}`;
        button.addEventListener('click', () => selectAnswer(index));
        answerButtonsContainer.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    const currentData = quizData[currentQuestionIndex];
    const isCorrect = selectedIndex === currentData.correct;

    if (isCorrect) {
        score += 10;
        correctAnswersCount++;
        currentScoreEl.textContent = score;
        sfx.playCorrect();

        feedbackIcon.className = 'feedback-icon correct fa-solid fa-circle-check';
        feedbackTitle.textContent = 'Jawaban Tepat!';
        feedbackTitle.style.color = 'var(--correct-color)';
    } else {
        wrongAnswersCount++;
        sfx.playWrong();

        feedbackIcon.className = 'feedback-icon wrong fa-solid fa-circle-xmark';
        feedbackTitle.textContent = 'Kurang Tepat!';
        feedbackTitle.style.color = 'var(--wrong-color)';
    }

    feedbackText.innerHTML = `<strong>Penjelasan:</strong><br>${currentData.explanation}`;

    modalBackdrop.classList.remove('hidden');
    feedbackCard.classList.remove('hidden');
}

btnNext.addEventListener('click', () => {
    modalBackdrop.classList.add('hidden');
    feedbackCard.classList.add('hidden');

    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    document.getElementById('final-score').textContent = score;
    document.getElementById('correct-count').textContent = correctAnswersCount;
    document.getElementById('wrong-count').textContent = wrongAnswersCount;

    const predikatEl = document.getElementById('predikat-text');
    if (score === 100) {
        predikatEl.textContent = "Computer Brain 🤖⚡";
    } else if (score >= 80) {
        predikatEl.textContent = "Master Logika 🧠";
    } else if (score >= 60) {
        predikatEl.textContent = "Programmer Muda 💻";
    } else {
        predikatEl.textContent = "Pembelajar Pemula 📚";
    }

    sfx.playFinish();
    triggerConfetti();
}

btnRestart.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
});

function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    const colors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
        confetti.style.opacity = Math.random();
        container.appendChild(confetti);
    }
}

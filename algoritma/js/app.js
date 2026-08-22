// Web Audio API Synthesizer Effects
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
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.2); // G5
        
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

// App State Variables
let currentQuestionIndex = 0;
let score = 0;
let correctAnswersCount = 0;
let wrongAnswersCount = 0;
const sfx = new SoundEffects();

// DOM Selectors
const splashScreen = document.getElementById('splash-screen');
const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

const btnStart = document.getElementById('btn-start');
const btnRestart = document.getElementById('btn-restart');
const btnNext = document.getElementById('btn-next');

const currentScoreEl = document.getElementById('current-score');
const currentPosEl = document.getElementById('current-pos');
const mazeTrack = document.getElementById('maze-track');

const clueText = document.getElementById('clue-text');
const questionText = document.getElementById('question-text');
const answerButtonsContainer = document.getElementById('answer-buttons');

const modalBackdrop = document.getElementById('modal-backdrop');
const feedbackCard = document.getElementById('feedback-card');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');

// Init & Splash Transition
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');
    }, 1800);
});

// Start Game
btnStart.addEventListener('click', () => {
    homeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    resetQuizState();
    renderMazeTrack();
    loadQuestion();
});

function resetQuizState() {
    currentQuestionIndex = 0;
    score = 0;
    correctAnswersCount = 0;
    wrongAnswersCount = 0;
    currentScoreEl.textContent = '0';
}

// Generate Maze Nodes & Robot Icon
function renderMazeTrack() {
    mazeTrack.innerHTML = '';

    // Robot Player Icon
    const robotPlayer = document.createElement('div');
    robotPlayer.id = 'robot-player';
    robotPlayer.className = 'robot-player';
    robotPlayer.innerHTML = '<i class="fa-solid fa-robot"></i>';
    mazeTrack.appendChild(robotPlayer);

    // Nodes (Pos 1 - 10 + Finish)
    for (let i = 0; i < quizData.length; i++) {
        const node = document.createElement('div');
        node.className = `maze-node node-${i}`;
        node.textContent = i + 1;
        mazeTrack.appendChild(node);
    }

    // Finish Node
    const finishNode = document.createElement('div');
    finishNode.className = `maze-node finish node-${quizData.length}`;
    finishNode.innerHTML = '<i class="fa-solid fa-flag-checkered"></i>';
    mazeTrack.appendChild(finishNode);

    updateRobotPosition();
}

// Move Robot Icon smoothly to active node
function updateRobotPosition() {
    const activeNode = document.querySelector(`.node-${currentQuestionIndex}`);
    const robotPlayer = document.getElementById('robot-player');

    if (activeNode && robotPlayer) {
        const offsetLeft = activeNode.offsetLeft;
        robotPlayer.style.left = `${offsetLeft + 2}px`;
    }

    // Update Node Styles
    document.querySelectorAll('.maze-node').forEach((node, idx) => {
        if (idx < currentQuestionIndex) {
            node.className = `maze-node passed node-${idx}`;
            node.innerHTML = '<i class="fa-solid fa-check"></i>';
        } else if (idx === currentQuestionIndex) {
            node.className = `maze-node current node-${idx}`;
            if (idx === quizData.length) {
                node.innerHTML = '<i class="fa-solid fa-flag-checkered"></i>';
            } else {
                node.textContent = idx + 1;
            }
        }
    });
}

// Load Tantangan Pos
function loadQuestion() {
    const currentData = quizData[currentQuestionIndex];

    currentPosEl.textContent = currentQuestionIndex + 1;
    clueText.textContent = `${currentData.clue}`;
    questionText.innerText = currentData.question;

    answerButtonsContainer.innerHTML = '';
    currentData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'btn-answer';
        button.innerHTML = `<span style="font-weight:700; margin-right:12px; color:var(--secondary-color);">${String.fromCharCode(65 + index)}.</span> ${option}`;
        button.addEventListener('click', () => selectAnswer(index));
        answerButtonsContainer.appendChild(button);
    });

    updateRobotPosition();
}

// Select Step Option
function selectAnswer(selectedIndex) {
    const currentData = quizData[currentQuestionIndex];
    const isCorrect = selectedIndex === currentData.correct;

    if (isCorrect) {
        score += 10;
        correctAnswersCount++;
        currentScoreEl.textContent = score;
        sfx.playCorrect();

        feedbackIcon.className = 'feedback-icon correct fa-solid fa-circle-check';
        feedbackTitle.textContent = 'Langkah Tepat!';
        feedbackTitle.style.color = 'var(--correct-color)';
    } else {
        wrongAnswersCount++;
        sfx.playWrong();

        feedbackIcon.className = 'feedback-icon wrong fa-solid fa-circle-xmark';
        feedbackTitle.textContent = 'Jalur Tersesat!';
        feedbackTitle.style.color = 'var(--wrong-color)';
    }

    feedbackText.innerHTML = `<strong>Analisis Logika:</strong><br>${currentData.explanation}`;

    modalBackdrop.classList.remove('hidden');
    feedbackCard.classList.remove('hidden');
}

// Next Step Action
btnNext.addEventListener('click', () => {
    modalBackdrop.classList.add('hidden');
    feedbackCard.classList.add('hidden');

    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        // Move robot to finish node
        updateRobotPosition();
        setTimeout(showResult, 600);
    }
});

// Finish / Escape Screen
function showResult() {
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    document.getElementById('final-score').textContent = score;
    document.getElementById('correct-count').textContent = correctAnswersCount;
    document.getElementById('wrong-count').textContent = wrongAnswersCount;

    const predikatEl = document.getElementById('predikat-text');
    if (score === 100) {
        predikatEl.textContent = "Grandmaster Maze Navigator 🤖⚡";
    } else if (score >= 80) {
        predikatEl.textContent = "Master Logika Labirin 🧠";
    } else if (score >= 60) {
        predikatEl.textContent = "Penjelajah Algoritma 💻";
    } else {
        predikatEl.textContent = "Pembelajar Pemula 📚";
    }

    sfx.playFinish();
    triggerConfetti();
}

// Restart Game
btnRestart.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
});

// Confetti Animation
function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

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

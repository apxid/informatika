document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMEN SCREEN ---
    const splashScreen = document.getElementById('splash-screen');
    const homeScreen = document.getElementById('home-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');

    // --- ELEMEN QUIZ ---
    const questionIcon = document.getElementById('question-icon');
    const questionText = document.getElementById('question-text');
    const questionClue = document.getElementById('question-clue');
    const clueText = document.getElementById('clue-text');
    const answerButtons = document.getElementById('answer-buttons');
    const currentScoreEl = document.getElementById('current-score');
    const currentQNumEl = document.getElementById('current-q-num');
    const totalQNumEl = document.getElementById('total-q-num');
    const progressBar = document.getElementById('progress-bar');

    // --- ELEMEN FEEDBACK MODAL ---
    const modalBackdrop = document.getElementById('modal-backdrop');
    const feedbackCard = document.getElementById('feedback-card');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackText = document.getElementById('feedback-text');
    const btnNext = document.getElementById('btn-next');

    // --- ELEMEN TOMBOL & RESULT ---
    const btnStart = document.getElementById('btn-start');
    const btnRestart = document.getElementById('btn-restart');
    const finalScoreEl = document.getElementById('final-score');
    const correctCountEl = document.getElementById('correct-count');
    const wrongCountEl = document.getElementById('wrong-count');
    const predikatTextEl = document.getElementById('predikat-text');

    // Helper untuk memformat teks bintang **teks** menjadi <strong>teks</strong>
    const parseMarkdownBold = (text) => {
        if (!text) return '';
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    // Helper Audio
    const playAudio = (id) => {
        const audio = document.getElementById(id);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    };

    // STATE VARIABEL
    let currentQuestionIndex = 0;
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;

    // 1. TRANSISI SPLASH TO HOME SCREEN (2.5 Detik)
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');
    }, 2500);

    // 2. EVENT LISTENERS
    btnStart.addEventListener('click', startQuiz);
    btnRestart.addEventListener('click', startQuiz);

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        correctCount = 0;
        wrongCount = 0;

        homeScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');

        totalQNumEl.innerText = questions.length;
        showQuestion();
    }

    // 3. TAMPILKAN SOAL
    function showQuestion() {
        resetState();
        const currentQ = questions[currentQuestionIndex];

        // Update Info & Progress
        currentQNumEl.innerText = currentQuestionIndex + 1;
        currentScoreEl.innerText = score;
        progressBar.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;

        // Update Icon & Pertanyaan (dengan parsing teks tebal)
        questionIcon.className = `${currentQ.icon} fa-4x`;
        questionText.innerHTML = parseMarkdownBold(currentQ.question);

        // Clue Handling
        if (currentQ.clue) {
            clueText.innerHTML = parseMarkdownBold(currentQ.clue);
            questionClue.classList.remove('hidden');
        } else {
            questionClue.classList.add('hidden');
        }

        // Render Tombol Jawaban
        currentQ.answers.forEach(answer => {
            const button = document.createElement('button');
            button.className = 'btn-answer';
            button.innerHTML = parseMarkdownBold(answer.text);
            button.addEventListener('click', () => selectAnswer(answer, currentQ));
            answerButtons.appendChild(button);
        });
    }

    function resetState() {
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
    }

    // 4. CEK JAWABAN
    function selectAnswer(answer, questionData) {
        let isCorrect = answer.correct;

        if (isCorrect) {
            score += 10;
            correctCount++;
            feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-check text-primary" style="color: #22c55e;"></i>';
            feedbackTitle.innerText = "Benar! 🎉";
            playAudio('audio-correct');
        } else {
            wrongCount++;
            feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: #ef4444;"></i>';
            feedbackTitle.innerText = "Kurang Tepat! ❌";
            playAudio('audio-wrong');
        }

        feedbackText.innerHTML = parseMarkdownBold(questionData.explanation);
        currentScoreEl.innerText = score;

        modalBackdrop.classList.remove('hidden');
        feedbackCard.classList.remove('hidden');
    }

    // 5. TOMBOL NEXT
    btnNext.addEventListener('click', () => {
        modalBackdrop.classList.add('hidden');
        feedbackCard.classList.add('hidden');

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    });

    // 6. TAMPILKAN HASIL
    function showResult() {
        quizScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');

        finalScoreEl.innerText = score;
        correctCountEl.innerText = correctCount;
        wrongCountEl.innerText = wrongCount;

        if (score >= 80) {
            predikatTextEl.innerText = "Computer Brain 🤖";
        } else if (score >= 60) {
            predikatTextEl.innerText = "Logic Master 💡";
        } else {
            predikatTextEl.innerText = "Logic Learner 📚";
        }

        playAudio('audio-finish');
    }
});

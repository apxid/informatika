document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const splash = document.getElementById("splash");
    const home = document.getElementById("home");
    const quiz = document.getElementById("quiz");
    const result = document.getElementById("result");

    const btnStart = document.getElementById("btnStart");
    const btnRestart = document.getElementById("btnRestart");
    const btnNext = document.getElementById("btnNext");
    const answerForm = document.getElementById("answerForm");
    const userAnswerInput = document.getElementById("userAnswer");
    const btnSubmit = document.getElementById("btnSubmit");

    const questionImage = document.getElementById("questionImage");
    const questionNumberText = document.getElementById("questionNumber");
    const progressBar = document.getElementById("progressBar");
    const scoreText = document.getElementById("score");
    const totalQuestionsText = document.getElementById("totalQuestionsText");

    // Pop-up Feedback Elements
    const feedbackModal = document.getElementById("feedbackModal");
    const feedbackIcon = document.getElementById("feedbackIcon");
    const feedbackTitle = document.getElementById("feedbackTitle");
    const feedbackText = document.getElementById("feedbackText");

    // Audio
    const soundCorrect = document.getElementById("soundCorrect");
    const soundWrong = document.getElementById("soundWrong");
    const soundFinish = document.getElementById("soundFinish");

    // Game Variables
    let currentIndex = 0;
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;

    // 1. Splash Screen Animation
    setTimeout(() => {
        splash.classList.add("hidden");
        home.classList.remove("hidden");
        if (typeof questionsData !== "undefined") {
            totalQuestionsText.textContent = `${questionsData.length} Soal`;
        }
    }, 2500);

    // 2. Start Game
    btnStart.addEventListener("click", () => {
        home.classList.add("hidden");
        quiz.classList.remove("hidden");
        resetGameVariables();
        loadQuestion();
    });

    // 3. Load Soal
    function loadQuestion() {
        const currentData = questionsData[currentIndex];

        questionImage.src = currentData.image;
        questionNumberText.textContent = `Soal ${currentIndex + 1} / ${questionsData.length}`;
        progressBar.style.width = `${((currentIndex + 1) / questionsData.length) * 100}%`;

        userAnswerInput.value = "";
        userAnswerInput.disabled = false;
        btnSubmit.disabled = false;

        // Sembunyikan Pop-up Modal saat memuat soal baru
        feedbackModal.classList.add("hidden");
        userAnswerInput.focus();
    }

    // 4. Submit Jawaban
    answerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const userInput = userAnswerInput.value.trim().toLowerCase().replace(/\s+/g, ' ');
        const correctAnswer = questionsData[currentIndex].answer.trim().toLowerCase().replace(/\s+/g, ' ');

        if (!userInput) return;

        userAnswerInput.disabled = true;
        btnSubmit.disabled = true;

        if (userInput === correctAnswer) {
            // Jawaban Benar
            if (soundCorrect) soundCorrect.play();
            score += 100 / questionsData.length;
            correctCount++;
            scoreText.textContent = Math.round(score);

            feedbackIcon.textContent = "🎉";
            feedbackTitle.textContent = "BENAR!";
            feedbackText.textContent = `Mantap! Jawabannya adalah "${questionsData[currentIndex].answer}"`;
        } else {
            // Jawaban Salah
            if (soundWrong) soundWrong.play();
            wrongCount++;

            feedbackIcon.textContent = "❌";
            feedbackTitle.textContent = "KURANG TEPAT!";
            feedbackText.textContent = `Jawaban yang benar: "${questionsData[currentIndex].answer}"`;
        }

        // Tampilkan Modal Pop-up Feedback
        feedbackModal.classList.remove("hidden");
    });

    // 5. Tombol Lanjut Soal Berikutnya (Di dalam Pop-up)
    btnNext.addEventListener("click", () => {
        currentIndex++;
        if (currentIndex < questionsData.length) {
            loadQuestion();
        } else {
            feedbackModal.classList.add("hidden");
            showResult();
        }
    });

    // 6. Tampilkan Hasil Akhir
    function showResult() {
        if (soundFinish) soundFinish.play();
        quiz.classList.add("hidden");
        result.classList.remove("hidden");

        document.getElementById("finalScore").textContent = Math.round(score);
        document.getElementById("correctAnswer").textContent = correctCount;
        document.getElementById("wrongAnswer").textContent = wrongCount;

        const gradeText = document.getElementById("grade");
        if (score >= 80) gradeText.textContent = "MASTER TEBAK GAMBAR 🏆";
        else if (score >= 50) gradeText.textContent = "DETEKTIF HEBAT ⭐";
        else gradeText.textContent = "COBA LAGI BERSAMA-SAMA 💪";
    }

    // 7. Restart Game
    btnRestart.addEventListener("click", () => {
        result.classList.add("hidden");
        home.classList.remove("hidden");
    });

    function resetGameVariables() {
        currentIndex = 0;
        score = 0;
        correctCount = 0;
        wrongCount = 0;
        scoreText.textContent = "0";
    }
});

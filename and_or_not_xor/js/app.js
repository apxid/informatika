function showQuestion(questionData) {
    // 1. Reset State & UI
    resetState();
    
    // 2. Set Icon & Question
    document.getElementById('question-icon').className = questionData.icon + " fa-4x";
    document.getElementById('question-text').innerText = questionData.question;
    
    // 3. Set Clue/Hint jika ada
    const clueContainer = document.getElementById('question-clue');
    const clueText = document.getElementById('clue-text');
    
    if (questionData.clue) {
        clueText.innerText = questionData.clue;
        clueContainer.classList.remove('hidden');
    } else {
        clueContainer.classList.add('hidden');
    }

    // 4. Render Tombol Jawaban
    const answerGrid = document.getElementById('answer-buttons');
    questionData.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn-answer');
        button.addEventListener('click', () => selectAnswer(answer, questionData));
        answerGrid.appendChild(button);
    });
}

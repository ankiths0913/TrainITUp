// Quiz functionality for TrainITup
let quizzes = [];
let currentQuizIndex = -1;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizStartTime = null;
let timerInterval = null;

// Initialize quiz page
document.addEventListener('DOMContentLoaded', function() {
    loadQuizzes();
});

// Load available quizzes
function loadQuizzes() {
    // Fetch quizzes from backend
    fetch('/api/quizzes')
        .then(response => response.json())
        .then(data => {
            quizzes = data;
            displayQuizzes();
        })
        .catch(error => {
            console.log('Using sample quizzes');
            // Sample quizzes for demo
            quizzes = [
                {
                    id: 1,
                    name: 'HTML Basics',
                    description: 'Test your HTML knowledge',
                    duration: 600,
                    questions: []
                },
                {
                    id: 2,
                    name: 'CSS Fundamentals',
                    description: 'Test your CSS knowledge',
                    duration: 600,
                    questions: []
                }
            ];
            displayQuizzes();
        });
}

// Display available quizzes
function displayQuizzes() {
    const grid = document.getElementById('quizzesGrid');
    grid.innerHTML = '';

    quizzes.forEach((quiz, index) => {
        const card = document.createElement('div');
        card.className = 'quiz-card';
        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${quiz.name}</h5>
                    <p class="card-text text-muted">${quiz.description || ''}</p>
                    <div class="mt-auto">
                        <small class="text-secondary">
                            <i class="bi bi-clock"></i> ${Math.round(quiz.duration / 60)} minutes
                        </small>
                    </div>
                </div>
                <div class="card-footer bg-transparent">
                    <button class="btn btn-primary btn-sm w-100" onclick="startQuiz(${index})">
                        Start Quiz
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Start a quiz
function startQuiz(index) {
    currentQuizIndex = index;
    currentQuestionIndex = 0;
    userAnswers = [];
    quizStartTime = Date.now();

    // Hide selection, show quiz
    document.getElementById('quizSelection').classList.remove('active');
    document.getElementById('quizTaking').classList.add('active');

    // Load questions
    loadQuestions();
    startTimer();
}

// Load quiz questions
function loadQuestions() {
    const quiz = quizzes[currentQuizIndex];
    const quizTitle = document.getElementById('quizTitle');
    quizTitle.textContent = quiz.name;

    // Update progress
    updateProgress();
    displayQuestion();
}

// Display current question
function displayQuestion() {
    const quiz = quizzes[currentQuizIndex];
    if (!quiz.questions || quiz.questions.length === 0) {
        showNoQuestionsMessage();
        return;
    }

    const question = quiz.questions[currentQuestionIndex];
    const container = document.getElementById('optionsContainer');
    
    document.getElementById('questionText').textContent = question.text;
    container.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        
        if (userAnswers[currentQuestionIndex] === index) {
            button.classList.add('selected');
        }
        
        container.appendChild(button);
    });

    updateNavigationButtons();
}

// Select an answer
function selectAnswer(index) {
    userAnswers[currentQuestionIndex] = index;
    
    // Update UI
    document.querySelectorAll('.option-button').forEach((btn, i) => {
        btn.classList.toggle('selected', i === index);
    });
}

// Move to next question
function nextQuestion() {
    const quiz = quizzes[currentQuizIndex];
    if (currentQuestionIndex < quiz.questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

// Move to previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// Submit quiz
function submitQuiz() {
    clearInterval(timerInterval);
    calculateResults();
}

// Calculate and display results
function calculateResults() {
    const quiz = quizzes[currentQuizIndex];
    let correctCount = 0;

    userAnswers.forEach((answer, index) => {
        if (answer === quiz.questions[index].correctAnswer) {
            correctCount++;
        }
    });

    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);

    // Update results display
    document.getElementById('finalScore').textContent = percentage;
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('totalCount').textContent = quiz.questions.length;
    document.getElementById('timeTaken').textContent = formatTime(timeTaken);
    document.getElementById('percentageDisplay').textContent = percentage;

    // Set result message
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');

    if (percentage >= 80) {
        resultTitle.textContent = 'Excellent!';
        resultMessage.textContent = 'You have mastered this topic!';
    } else if (percentage >= 60) {
        resultTitle.textContent = 'Good Job!';
        resultMessage.textContent = 'Keep practicing to improve further.';
    } else {
        resultTitle.textContent = 'Keep Learning!';
        resultMessage.textContent = 'Review the material and try again.';
    }

    // Display answer review
    displayAnswerReview();

    // Show results
    document.getElementById('quizTaking').classList.remove('active');
    document.getElementById('quizResults').classList.add('active');
}

// Display answer review
function displayAnswerReview() {
    const quiz = quizzes[currentQuizIndex];
    const reviewContainer = document.getElementById('answerReviewContainer');
    reviewContainer.innerHTML = '';

    quiz.questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;

        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
        reviewItem.innerHTML = `
            <div class="review-header">
                <span class="review-number">Question ${index + 1}</span>
                <span class="review-status">
                    <i class="bi ${isCorrect ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}"></i>
                </span>
            </div>
            <p class="review-question">${question.text}</p>
            <p class="review-answer">
                <strong>Your answer:</strong> ${question.options[userAnswer] || 'Not answered'}
            </p>
            ${!isCorrect ? `<p class="review-correct"><strong>Correct answer:</strong> ${question.options[question.correctAnswer]}</p>` : ''}
        `;
        reviewContainer.appendChild(reviewItem);
    });
}

// Retake quiz
function retakeQuiz() {
    document.getElementById('quizResults').classList.remove('active');
    document.getElementById('quizSelection').classList.add('active');
    document.getElementById('quizTaking').classList.remove('active');
}

// Back to quizzes
function backToQuizzes() {
    document.getElementById('quizResults').classList.remove('active');
    document.getElementById('quizSelection').classList.add('active');
}

// Update progress bar and counter
function updateProgress() {
    const quiz = quizzes[currentQuizIndex];
    if (!quiz.questions || quiz.questions.length === 0) return;

    const total = quiz.questions.length;
    const current = currentQuestionIndex + 1;
    const percentage = (current / total) * 100;

    document.getElementById('questionCounter').textContent = `${current}/${total}`;
    document.getElementById('progressBar').style.width = percentage + '%';
}

// Update navigation buttons visibility
function updateNavigationButtons() {
    const quiz = quizzes[currentQuizIndex];
    if (!quiz.questions) return;

    const total = quiz.questions.length;
    const current = currentQuestionIndex;

    document.getElementById('prevBtn').style.display = current > 0 ? 'inline-block' : 'none';
    document.getElementById('nextBtn').style.display = current < total - 1 ? 'inline-block' : 'none';
    document.getElementById('submitBtn').classList.toggle('d-none', current < total - 1);
}

// Timer functionality
function startTimer() {
    const quiz = quizzes[currentQuizIndex];
    let timeRemaining = quiz.duration || 600;

    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('timer').textContent = formatTime(timeRemaining);

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

// Format time (mm:ss)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Show message when no questions available
function showNoQuestionsMessage() {
    document.getElementById('questionText').textContent = 'No questions available for this quiz yet.';
    document.getElementById('optionsContainer').innerHTML = '<p class="text-muted">Please try another quiz.</p>';
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('submitBtn').disabled = true;
}

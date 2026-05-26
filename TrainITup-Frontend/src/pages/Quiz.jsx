import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import '/css/main.css'
import '/css/quiz.css'
import '/css/readability-fix.css'

const fallbackQuizzes = [
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
]

const formatTime = (seconds = 0) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0)
  const minutes = Math.floor(safeSeconds / 60)
  const secs = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const normalizeQuestions = (questions = []) => {
  if (!Array.isArray(questions)) return []

  return questions.map((question, index) => ({
    id: question.id || index,
    text: question.text || question.question || question.questionText || 'Untitled question',
    options: Array.isArray(question.options) ? question.options : [],
    correctAnswer: Number(question.correctAnswer ?? question.answerIndex ?? question.correctOption ?? -1)
  }))
}

const Quiz = ({ embedded = false }) => {
  const [quizzes, setQuizzes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [screen, setScreen] = useState('selection')
  const [currentQuizIndex, setCurrentQuizIndex] = useState(-1)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [timeTaken, setTimeTaken] = useState(0)
  const [results, setResults] = useState(null)
  const quizStartTimeRef = useRef(null)

  const currentQuiz = currentQuizIndex >= 0 ? quizzes[currentQuizIndex] : null
  const questions = useMemo(() => normalizeQuestions(currentQuiz?.questions), [currentQuiz])
  const currentQuestion = questions[currentQuestionIndex]
  const hasQuestions = questions.length > 0
  const progressPercentage = hasQuestions ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const response = await fetch('/api/quizzes')
        if (!response.ok) throw new Error('Unable to load quizzes')
        const data = await response.json()
        setQuizzes(Array.isArray(data) ? data : fallbackQuizzes)
      } catch (error) {
        console.warn('Using sample quizzes', error)
        setQuizzes(fallbackQuizzes)
      } finally {
        setIsLoading(false)
      }
    }

    loadQuizzes()
  }, [])

  const startQuiz = (index) => {
    const quiz = quizzes[index]
    setCurrentQuizIndex(index)
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setResults(null)
    setTimeTaken(0)
    setTimeRemaining(Number(quiz?.duration) || 600)
    quizStartTimeRef.current = Date.now()
    setScreen('taking')
  }

  const selectAnswer = (answerIndex) => {
    setUserAnswers(previous => {
      const nextAnswers = [...previous]
      nextAnswers[currentQuestionIndex] = answerIndex
      return nextAnswers
    })
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const submitQuiz = useCallback(() => {
    if (!currentQuiz || !hasQuestions) return

    const correctCount = questions.reduce((count, question, index) => (
      userAnswers[index] === question.correctAnswer ? count + 1 : count
    ), 0)
    const percentage = Math.round((correctCount / questions.length) * 100)
    const elapsedSeconds = quizStartTimeRef.current ? Math.round((Date.now() - quizStartTimeRef.current) / 1000) : 0

    setResults({ correctCount, percentage })
    setTimeTaken(elapsedSeconds)
    setScreen('results')
  }, [currentQuiz, hasQuestions, questions, userAnswers])

  useEffect(() => {
    if (screen !== 'taking') return undefined

    const timer = window.setInterval(() => {
      setTimeRemaining(previous => {
        if (previous <= 1) {
          window.clearInterval(timer)
          submitQuiz()
          return 0
        }

        return previous - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [screen, currentQuizIndex, submitQuiz])

  const retakeQuiz = () => {
    if (currentQuizIndex >= 0) {
      startQuiz(currentQuizIndex)
    }
  }

  const backToQuizzes = () => {
    setScreen('selection')
    setCurrentQuizIndex(-1)
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setResults(null)
    setTimeTaken(0)
    setTimeRemaining(0)
    quizStartTimeRef.current = null
  }

  const resultTitle = results?.percentage >= 80 ? 'Excellent!' : results?.percentage >= 60 ? 'Good Job!' : 'Keep Learning!'
  const resultMessage = results?.percentage >= 80
    ? 'You have mastered this topic!'
    : results?.percentage >= 60
      ? 'Keep practicing to improve further.'
      : 'Review the material and try again.'

  return (
    <div className={`quiz-container ${embedded ? 'quiz-container-embedded' : ''}`}>
      {!embedded && (
        <nav className="quiz-header">
          <Link to="/student-dashboard" className="back-link">
            <i className="bi bi-arrow-left"></i> Back to Dashboard
          </Link>
        </nav>
      )}

      <section id="quizSelection" className={`quiz-section ${screen === 'selection' ? 'active' : ''}`}>
        <div className="quiz-wrapper">
          <h1 className="quiz-title">Available Quizzes</h1>
          <p className="quiz-subtitle">Test your knowledge with our interactive quizzes</p>

          <div className="quizzes-grid" id="quizzesGrid">
            {isLoading ? (
              <div className="quiz-card">
                <div className="quiz-card-title">Loading quizzes...</div>
                <p className="quiz-card-description">Preparing your quiz list.</p>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="quiz-card">
                <div className="quiz-card-title">No quizzes available</div>
                <p className="quiz-card-description">Please check back later.</p>
              </div>
            ) : (
              quizzes.map((quiz, index) => (
                <article className="quiz-card" key={quiz.id || index}>
                  <i className="bi bi-patch-question quiz-card-icon"></i>
                  <h2 className="quiz-card-title">{quiz.name}</h2>
                  <p className="quiz-card-description">{quiz.description || ''}</p>
                  <div className="quiz-card-meta">
                    <span className="quiz-card-meta-item">
                      <i className="bi bi-clock"></i> {Math.round((Number(quiz.duration) || 600) / 60)} minutes
                    </span>
                    <span className="quiz-card-meta-item">
                      <i className="bi bi-list-check"></i> {normalizeQuestions(quiz.questions).length} questions
                    </span>
                  </div>
                  <button className="btn btn-primary btn-sm w-100 mt-3" onClick={() => startQuiz(index)}>
                    Start Quiz
                  </button>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section id="quizTaking" className={`quiz-section ${screen === 'taking' ? 'active' : ''}`}>
        <div className="quiz-wrapper">
          <div className="quiz-progress-container">
            <div className="quiz-header-info">
              <h2 id="quizTitle" className="quiz-name">{currentQuiz?.name || ''}</h2>
              <div className="quiz-progress">
                <span id="questionCounter">{hasQuestions ? `${currentQuestionIndex + 1}/${questions.length}` : '1/0'}</span>
                <div className="progress">
                  <div id="progressBar" className="progress-bar bg-primary" role="progressbar" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
            </div>
            <div className="quiz-timer">
              <i className="bi bi-clock"></i>
              <span id="timer">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          <div className="question-container">
            <h3 id="questionText" className="question-text">
              {hasQuestions ? currentQuestion?.text : 'No questions available for this quiz yet.'}
            </h3>
            <div id="optionsContainer" className="options-grid">
              {hasQuestions ? (
                currentQuestion.options.map((option, index) => (
                  <button
                    className={`option-btn ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
                    key={`${option}-${index}`}
                    onClick={() => selectAnswer(index)}
                  >
                    {option}
                  </button>
                ))
              ) : (
                <p className="text-muted">Please try another quiz.</p>
              )}
            </div>
          </div>

          <div className="quiz-navigation">
            <button className="btn btn-outline-secondary rounded-pill" onClick={previousQuestion} style={{ display: currentQuestionIndex > 0 ? 'inline-block' : 'none' }}>
              <i className="bi bi-chevron-left"></i> Previous
            </button>
            {!hasQuestions && (
              <button className="btn btn-outline-secondary rounded-pill" onClick={backToQuizzes}>
                <i className="bi bi-arrow-left"></i> Back to Quizzes
              </button>
            )}
            <button className={`btn btn-primary rounded-pill ${currentQuestionIndex < questions.length - 1 ? 'd-none' : ''}`} onClick={submitQuiz} disabled={!hasQuestions}>
              <i className="bi bi-check-circle"></i> Submit Quiz
            </button>
            <button className="btn btn-primary rounded-pill" onClick={nextQuestion} disabled={!hasQuestions} style={{ display: currentQuestionIndex < questions.length - 1 ? 'inline-block' : 'none' }}>
              Next <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

      <section id="quizResults" className={`quiz-section ${screen === 'results' ? 'active' : ''}`}>
        <div className="quiz-wrapper">
          <div className="results-container text-center">
            <div className="score-circle">
              <div className="score-number">
                <span id="finalScore">{results?.percentage || 0}</span>%
              </div>
              <div className="score-label">Your Score</div>
            </div>

            <h2 id="resultTitle" className="mt-4 mb-2">{resultTitle}</h2>
            <p id="resultMessage" className="text-muted mb-4">{resultMessage}</p>

            <div className="result-stats">
              <div className="stat">
                <div className="stat-label">Correct Answers</div>
                <div className="stat-value"><span id="correctCount">{results?.correctCount || 0}</span>/<span id="totalCount">{questions.length}</span></div>
              </div>
              <div className="stat">
                <div className="stat-label">Time Taken</div>
                <div className="stat-value" id="timeTaken">{formatTime(timeTaken)}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Percentage</div>
                <div className="stat-value"><span id="percentageDisplay">{results?.percentage || 0}</span>%</div>
              </div>
            </div>

            <div className="answer-review mt-5">
              <h4 className="mb-3">Answer Review</h4>
              <div id="answerReviewContainer" className="review-list">
                {questions.map((question, index) => {
                  const userAnswer = userAnswers[index]
                  const isCorrect = userAnswer === question.correctAnswer

                  return (
                    <div className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`} key={question.id || index}>
                      <div className="review-header">
                        <span className="review-number">Question {index + 1}</span>
                        <span className="review-status">
                          <i className={`bi ${isCorrect ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`}></i>
                        </span>
                      </div>
                      <p className="review-question">{question.text}</p>
                      <p className="review-answer">
                        <strong>Your answer:</strong> {question.options[userAnswer] || 'Not answered'}
                      </p>
                      {!isCorrect && (
                        <p className="review-correct"><strong>Correct answer:</strong> {question.options[question.correctAnswer]}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="results-actions mt-4">
              <button onClick={retakeQuiz} className="btn btn-primary rounded-pill me-2">
                <i className="bi bi-arrow-repeat"></i> Retake Quiz
              </button>
              <button onClick={backToQuizzes} className="btn btn-outline-secondary rounded-pill">
                <i className="bi bi-arrow-left"></i> Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Quiz

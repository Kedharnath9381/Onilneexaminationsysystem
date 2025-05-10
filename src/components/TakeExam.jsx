import { useState, useEffect } from 'react'

function TakeExam({ exam, onSubmit, onBack }) {
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(exam?.duration * 60 || 0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [results, setResults] = useState(null)

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit()
    }
  }, [timeLeft, isSubmitted])

  const handleAnswer = (questionIndex, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }))
  }

  const calculateResults = () => {
    const totalQuestions = exam.questions.length
    let correctAnswers = 0
    const questionResults = exam.questions.map((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer
      if (isCorrect) correctAnswers++
      return {
        questionText: question.question,
        userAnswer: question.options[answers[index]] || 'Not answered',
        correctAnswer: question.options[question.correctAnswer],
        correct: isCorrect,
        points: 1
      }
    })

    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const passingScore = 60 // You can adjust this as needed

    return {
      score,
      correctAnswers,
      totalQuestions,
      timeTaken: exam.duration * 60 - timeLeft,
      passingScore,
      questionResults
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    const examResults = calculateResults()
    setResults(examResults)
    onSubmit(examResults)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!exam) return <div>No exam available</div>

  if (isSubmitted && results) {
    return (
      <div className="exam-results">
        <div className="result-header">
          <button 
            className="back-btn"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>
        </div>
        <div className="result-card">
          <div className="result-icon">{results.score >= results.passingScore ? '✓' : '✗'}</div>
          <h3>Exam {results.score >= results.passingScore ? 'Passed!' : 'Failed'}</h3>
          
          <div className="score-display">
            <span className="score-label">Your Score:</span>
            <span className="score-value">{results.score}%</span>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Correct Answers:</span>
              <span className="stat-value">
                {results.correctAnswers}/{results.totalQuestions}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Time Taken:</span>
              <span className="stat-value">
                {formatTime(results.timeTaken)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Passing Score:</span>
              <span className="stat-value">
                {results.passingScore}%
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Status:</span>
              <span className={`stat-value ${results.score >= results.passingScore ? 'pass' : 'fail'}`}>
                {results.score >= results.passingScore ? 'Passed' : 'Failed'}
              </span>
            </div>
          </div>

          <div className="question-breakdown">
            <h4>Detailed Results:</h4>
            {results.questionResults.map((q, index) => (
              <div 
                key={index} 
                className={`question-result ${q.correct ? 'correct' : 'incorrect'}`}
              >
                <p className="question-text">
                  <strong>Q{index + 1}:</strong> {q.questionText}
                </p>
                <p>Your answer: {q.userAnswer}</p>
                {!q.correct && (
                  <p className="correct-answer">
                    Correct answer: {q.correctAnswer}
                  </p>
                )}
                <p className="points">Points: {q.points}/{q.points}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="take-exam">
      <div className="exam-header">
        <button 
          className="back-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>
        <h3>{exam.title}</h3>
        <div className="timer">Time Left: {formatTime(timeLeft)}</div>
      </div>

      <div className="questions">
        {exam.questions.map((question, index) => (
          <div key={index} className="question">
            <p><strong>Q{index + 1}:</strong> {question.question}</p>
            <div className="options">
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="option">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    checked={answers[index] === optionIndex}
                    onChange={() => handleAnswer(index, optionIndex)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button onClick={handleSubmit} className="submit-btn">Submit Exam</button>
      </div>
    </div>
  )
}

export default TakeExam 






















import React from 'react';
import './components.css';

function ExamResults({ exam, attempt, isAdmin }) {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="exam-results">
      <div className="result-card">
        <div className="result-header">
          <h3>{exam.title}</h3>
          {isAdmin && (
            <div className="student-info">
              <p>Student: {attempt.studentName}</p>
              <p>ID: {attempt.studentId}</p>
            </div>
          )}
        </div>

        <div className="result-icon">
          {attempt.score >= attempt.passingScore ? '✓' : '✗'}
        </div>
        
        <div className="score-display">
          <span className="score-label">Score:</span>
          <span className="score-value">{attempt.score}%</span>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Correct Answers:</span>
            <span className="stat-value">
              {attempt.correctAnswers}/{attempt.totalQuestions}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Time Taken:</span>
            <span className="stat-value">
              {formatTime(attempt.timeTaken)}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Passing Score:</span>
            <span className="stat-value">
              {attempt.passingScore}%
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Status:</span>
            <span className={`stat-value ${
              attempt.score >= attempt.passingScore ? 'pass' : 'fail'
            }`}>
              {attempt.score >= attempt.passingScore ? 'Passed' : 'Failed'}
            </span>
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="question-breakdown">
          <h4>Detailed Results:</h4>
          {attempt.questionResults.map((q, index) => (
            <div 
              key={index} 
              className={`question-result ${q.correct ? 'correct' : 'incorrect'}`}
            >
              <p className="question-text">
                <strong>Q{index + 1}:</strong> {q.questionText}
              </p>
              <p>Your answer: {q.userAnswer || 'Not answered'}</p>
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
  );
}

export default ExamResults;
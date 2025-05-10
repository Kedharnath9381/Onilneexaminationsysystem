import { useState } from 'react'

function CreateExam({ onCreateExam, onBack }) {
  const [examData, setExamData] = useState({
    title: '',
    duration: 30,
    questions: []
  })

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    type: 'mcq', // 'mcq', 'truefalse', 'shortanswer', 'essay'
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1,
    // Additional fields for different question types
    wordLimit: 50, // for short answer
    minWords: 100, // for essay
    maxWords: 500, // for essay
  })

  const questionTypes = [
    { value: 'mcq', label: 'Multiple Choice' },
    { value: 'truefalse', label: 'True/False' },
    { value: 'shortanswer', label: 'Short Answer' },
    { value: 'essay', label: 'Essay' }
  ]

  const addQuestion = () => {
    // Validate question based on type
    if (!validateQuestion(currentQuestion)) {
      return;
    }

    setExamData(prev => ({
      ...prev,
      questions: [...prev.questions, currentQuestion]
    }))
    
    // Reset to default question state
    setCurrentQuestion({
      question: '',
      type: 'mcq',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
      wordLimit: 50,
      minWords: 100,
      maxWords: 500,
    })
  }

  const validateQuestion = (question) => {
    if (!question.question.trim()) {
      alert('Please enter a question');
      return false;
    }

    switch (question.type) {
      case 'mcq':
        if (question.options.some(opt => !opt.trim())) {
          alert('Please fill all options for MCQ');
          return false;
        }
        break;
      case 'truefalse':
        if (question.correctAnswer === undefined) {
          alert('Please select correct answer for True/False');
          return false;
        }
        break;
      case 'shortanswer':
        if (question.wordLimit < 10) {
          alert('Word limit should be at least 10 words');
          return false;
        }
        break;
      case 'essay':
        if (question.minWords >= question.maxWords) {
          alert('Minimum words should be less than maximum words');
          return false;
        }
        break;
    }
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (examData.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }
    onCreateExam(examData)
  }

  const renderQuestionTypeSpecificFields = () => {
    switch (currentQuestion.type) {
      case 'mcq':
        return (
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="option">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...currentQuestion.options]
                    newOptions[index] = e.target.value
                    setCurrentQuestion(prev => ({ ...prev, options: newOptions }))
                  }}
                  placeholder={`Option ${index + 1}`}
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={currentQuestion.correctAnswer === index}
                  onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                />
              </div>
            ))}
          </div>
        )
      
      case 'truefalse':
        return (
          <div className="true-false-options">
            <label className="option">
              <input
                type="radio"
                name="correctAnswer"
                checked={currentQuestion.correctAnswer === true}
                onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: true }))}
              />
              True
            </label>
            <label className="option">
              <input
                type="radio"
                name="correctAnswer"
                checked={currentQuestion.correctAnswer === false}
                onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: false }))}
              />
              False
            </label>
          </div>
        )
      
      case 'shortanswer':
        return (
          <div className="short-answer-settings">
            <div className="form-group">
              <label>Word Limit:</label>
              <input
                type="number"
                value={currentQuestion.wordLimit}
                onChange={(e) => setCurrentQuestion(prev => ({ 
                  ...prev, 
                  wordLimit: Math.max(10, parseInt(e.target.value) || 0)
                }))}
                min="10"
              />
            </div>
            <div className="form-group">
              <label>Points:</label>
              <input
                type="number"
                value={currentQuestion.points}
                onChange={(e) => setCurrentQuestion(prev => ({ 
                  ...prev, 
                  points: Math.max(1, parseInt(e.target.value) || 0)
                }))}
                min="1"
              />
            </div>
          </div>
        )
      
      case 'essay':
        return (
          <div className="essay-settings">
            <div className="form-group">
              <label>Minimum Words:</label>
              <input
                type="number"
                value={currentQuestion.minWords}
                onChange={(e) => setCurrentQuestion(prev => ({ 
                  ...prev, 
                  minWords: Math.max(50, parseInt(e.target.value) || 0)
                }))}
                min="50"
              />
            </div>
            <div className="form-group">
              <label>Maximum Words:</label>
              <input
                type="number"
                value={currentQuestion.maxWords}
                onChange={(e) => setCurrentQuestion(prev => ({ 
                  ...prev, 
                  maxWords: Math.max(100, parseInt(e.target.value) || 0)
                }))}
                min="100"
              />
            </div>
            <div className="form-group">
              <label>Points:</label>
              <input
                type="number"
                value={currentQuestion.points}
                onChange={(e) => setCurrentQuestion(prev => ({ 
                  ...prev, 
                  points: Math.max(1, parseInt(e.target.value) || 0)
                }))}
                min="1"
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="create-exam">
      <div className="exam-header">
        <button 
          className="back-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>
        <h3>Create New Exam</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Exam Title:</label>
          <input
            type="text"
            value={examData.title}
            onChange={(e) => setExamData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Duration (minutes):</label>
          <input
            type="number"
            value={examData.duration}
            onChange={(e) => setExamData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            required
          />
        </div>

        <div className="question-editor">
          <h4>Add Question</h4>
          
          <div className="form-group">
            <label>Question Type:</label>
            <select
              value={currentQuestion.type}
              onChange={(e) => setCurrentQuestion(prev => ({ 
                ...prev, 
                type: e.target.value,
                // Reset options when changing type
                options: e.target.value === 'mcq' ? ['', '', '', ''] : [],
                correctAnswer: e.target.value === 'truefalse' ? null : 0
              }))}
            >
              {questionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Question Text:</label>
            <textarea
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Enter question text"
              rows={4}
            />
          </div>
          
          {renderQuestionTypeSpecificFields()}
          
          <button type="button" onClick={addQuestion} className="add-question-btn">
            Add Question
          </button>
        </div>

        <div className="questions-preview">
          <h4>Questions ({examData.questions.length})</h4>
          {examData.questions.map((q, index) => (
            <div key={index} className="question-preview">
              <div className="question-header">
                <span className="question-type">{questionTypes.find(t => t.value === q.type)?.label}</span>
                <span className="question-points">{q.points} points</span>
              </div>
              <p><strong>Q{index + 1}:</strong> {q.question}</p>
              {q.type === 'mcq' && (
                <div className="options-preview">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`option-preview ${i === q.correctAnswer ? 'correct' : ''}`}>
                      {opt} {i === q.correctAnswer && '✓'}
                    </div>
                  ))}
                </div>
              )}
              {q.type === 'truefalse' && (
                <div className="options-preview">
                  <div className={`option-preview ${q.correctAnswer === true ? 'correct' : ''}`}>
                    True {q.correctAnswer === true && '✓'}
                  </div>
                  <div className={`option-preview ${q.correctAnswer === false ? 'correct' : ''}`}>
                    False {q.correctAnswer === false && '✓'}
                  </div>
                </div>
              )}
              {(q.type === 'shortanswer' || q.type === 'essay') && (
                <div className="answer-requirements">
                  {q.type === 'shortanswer' && (
                    <span>Word limit: {q.wordLimit} words</span>
                  )}
                  {q.type === 'essay' && (
                    <span>Word range: {q.minWords} - {q.maxWords} words</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="create-exam-btn">Create Exam</button>
      </form>
    </div>
  )
}

export default CreateExam 


















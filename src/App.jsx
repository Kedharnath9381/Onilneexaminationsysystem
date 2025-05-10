import { useState } from 'react'
import CreateExam from './components/CreateExam'
import TakeExam from './components/TakeExam'
import ExamResults from './components/ExamResults'
import './App.css'
import './components/components.css'

function App() {
  const [user, setUser] = useState(null)
  const [currentView, setCurrentView] = useState('dashboard')
  const [currentExam, setCurrentExam] = useState(null)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [authMode, setAuthMode] = useState(null) // 'signin' or 'signup'
  const [error, setError] = useState(null)
  const [exams, setExams] = useState([])
  const [examAttempts, setExamAttempts] = useState([])
  const [currentAttempt, setCurrentAttempt] = useState(null)

  const sampleExam = {
    title: "Sample Math Test",
    duration: 30,
    questions: [
      {
        question: "What is 2 + 2?",
        type: "mcq",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1
      },
      {
        question: "What is the square root of 16?",
        type: "mcq",
        options: ["2", "4", "6", "8"],
        correctAnswer: 1
      },
      {
        question: "Solve for x: 2x + 5 = 13",
        type: "mcq",
        options: ["x = 3", "x = 4", "x = 5", "x = 6"],
        correctAnswer: 1
      },
      {
        question: "What is the area of a circle with radius 3 units? (Use π = 3.14)",
        type: "mcq",
        options: ["18.84", "28.26", "37.68", "47.12"],
        correctAnswer: 1
      },
      {
        question: "If a triangle has angles of 45° and 60°, what is the measure of the third angle?",
        type: "mcq",
        options: ["60°", "75°", "90°", "105°"],
        correctAnswer: 1
      },
      {
        question: "What is the value of 3² × 2³?",
        type: "mcq",
        options: ["24", "48", "72", "96"],
        correctAnswer: 2
      },
      {
        question: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
        type: "mcq",
        options: ["24", "32", "48", "64"],
        correctAnswer: 1
      },
      {
        question: "If a rectangle has a length of 8 units and a width of 6 units, what is its perimeter?",
        type: "mcq",
        options: ["14 units", "24 units", "28 units", "48 units"],
        correctAnswer: 2
      },
      {
        question: "What is the value of sin(30°)?",
        type: "mcq",
        options: ["0.25", "0.5", "0.75", "1"],
        correctAnswer: 1
      },
      {
        question: "What is the probability of rolling a 6 on a fair six-sided die?",
        type: "mcq",
        options: ["1/3", "1/4", "1/5", "1/6"],
        correctAnswer: 3
      }
    ]
  }

  // Function to add a new exam
  const handleCreateExam = (newExam) => {
    setExams(prevExams => [...prevExams, {
      ...newExam,
      id: Date.now(), // Simple way to generate unique IDs
      createdAt: new Date().toISOString(),
      createdBy: user.name
    }])
    setCurrentView('dashboard')
  }

  // Function to start an exam
  const handleStartExam = (exam) => {
    setCurrentExam(exam)
    setCurrentView('take-exam')
  }

  // Function to handle exam submission and store results
  const handleExamSubmit = (examId, results) => {
    const newAttempt = {
      id: Date.now(),
      examId,
      examTitle: exams.find(e => e.id === examId)?.title,
      studentName: user.name,
      studentId: user.email, // Using email as student ID
      submittedAt: new Date().toISOString(),
      ...results
    }
    setExamAttempts(prev => [...prev, newAttempt])
    setCurrentView('dashboard')
  }

  // Function to view exam results
  const handleViewResults = (attempt) => {
    setCurrentExam(exams.find(e => e.id === attempt.examId))
    setCurrentView('view-results')
    setCurrentAttempt(attempt)
  }

  // Dummy authentication function
  const handleSignIn = (credentials) => {
    // Dummy credentials
    const validCredentials = {
      student: {
        email: "student@test.com",
        password: "student123"
      },
      admin: {
        email: "admin@test.com",
        password: "admin123"
      }
    };

    const roleCredentials = validCredentials[selectedRole];

    if (credentials.email === roleCredentials.email && 
        credentials.password === roleCredentials.password) {
      setUser({
        name: selectedRole === 'student' ? 'Student User' : 'Admin User',
        role: selectedRole
      });
      setShowAuthForm(false);
      setSelectedRole(null);
      setAuthMode(null);
      setError(null);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  }

  // Dummy signup function
  const handleSignUp = (credentials) => {
    // For demo, just create a user with the provided email
    setUser({
      name: credentials.email.split('@')[0],
      role: selectedRole
    });
    setShowAuthForm(false);
    setSelectedRole(null);
    setAuthMode(null);
    setError(null);
  }

  const renderAuthForm = () => {
    if (!showAuthForm) return null;
    
    return (
      <div className="auth-form">
        <h3>{authMode} as {selectedRole}</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={(e) => {
          e.preventDefault();
          const credentials = {
            email: e.target.email.value,
            password: e.target.password.value
          };
          if (authMode === 'signin') {
            handleSignIn(credentials);
          } else {
            handleSignUp(credentials);
          }
        }}>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">{authMode}</button>
          <button type="button" onClick={() => {
            setShowAuthForm(false);
            setSelectedRole(null);
            setAuthMode(null);
            setError(null);
          }}>Cancel</button>
        </form>
      </div>
    )
  }

  const renderMainContent = () => {
    if (!user) {
      return (
        <div className="welcome-section">
          <h2>Welcome to Online Examination System</h2>
          {!showAuthForm ? (
            <div className="auth-container">
              <div className="auth-option">
                <h3>For Students</h3>
                <div className="auth-buttons">
                  <button onClick={() => {
                    setSelectedRole('student');
                    setShowAuthForm(true);
                    setAuthMode('signin');
                  }}>Sign In</button>
                  <button onClick={() => {
                    setSelectedRole('student');
                    setShowAuthForm(true);
                    setAuthMode('signup');
                  }}>Sign Up</button>
                </div>
              </div>
              <div className="auth-option">
                <h3>For Administrators</h3>
                <div className="auth-buttons">
                  <button onClick={() => {
                    setSelectedRole('admin');
                    setShowAuthForm(true);
                    setAuthMode('signin');
                  }}>Sign In</button>
                  <button onClick={() => {
                    setSelectedRole('admin');
                    setShowAuthForm(true);
                    setAuthMode('signup');
                  }}>Sign Up</button>
                </div>
              </div>
            </div>
          ) : (
            renderAuthForm()
          )}
        </div>
      )
    }

    if (user.role === 'admin') {
      if (currentView === 'create-exam') {
        return <CreateExam 
          onCreateExam={handleCreateExam} 
          onBack={() => setCurrentView('dashboard')}
        />
      }
      
      if (currentView === 'view-results') {
        return (
          <div className="admin-results-view">
            <button 
              className="back-btn"
              onClick={() => setCurrentView('dashboard')}
            >
              ← Back to Dashboard
            </button>
            <ExamResults 
              exam={currentExam}
              attempt={currentAttempt}
              isAdmin={true}
            />
          </div>
        )
      }

      return (
        <div className="admin-dashboard">
          <h2>Admin Dashboard</h2>
          <div className="admin-actions">
            <button onClick={() => setCurrentView('create-exam')}>Create Exam</button>
            <button>Manage Questions</button>
          </div>
          
          {/* Created Exams Section */}
          <div className="exams-list">
            <h3>Created Exams</h3>
            {exams.length === 0 ? (
              <p className="no-exams">No exams created yet</p>
            ) : (
              <div className="exams-grid">
                {exams.map(exam => (
                  <div key={exam.id} className="exam-card">
                    <h4>{exam.title}</h4>
                    <div className="exam-info">
                      <p>Duration: {exam.duration} minutes</p>
                      <p>Questions: {exam.questions.length}</p>
                      <p>Created: {new Date(exam.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="exam-actions">
                      <button onClick={() => handleStartExam(exam)}>Preview</button>
                      <button className="delete-btn" onClick={() => {
                        setExams(prevExams => prevExams.filter(e => e.id !== exam.id))
                      }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exam Results Section */}
          <div className="exam-results-list">
            <h3>Exam Results</h3>
            {examAttempts.length === 0 ? (
              <p className="no-results">No exam attempts yet</p>
            ) : (
              <div className="results-table-container">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Exam</th>
                      <th>Score</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examAttempts.map(attempt => (
                      <tr key={attempt.id}>
                        <td>{attempt.studentName}</td>
                        <td>{attempt.examTitle}</td>
                        <td>{attempt.score}%</td>
                        <td>
                          <span className={`status-badge ${
                            attempt.score >= attempt.passingScore ? 'pass' : 'fail'
                          }`}>
                            {attempt.score >= attempt.passingScore ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td>{new Date(attempt.submittedAt).toLocaleString()}</td>
                        <td>
                          <button 
                            className="view-results-btn"
                            onClick={() => handleViewResults(attempt)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )
    }

    // Student view
    if (currentView === 'take-exam') {
      return <TakeExam 
        exam={currentExam} 
        onSubmit={(results) => handleExamSubmit(currentExam.id, results)}
        onBack={() => setCurrentView('dashboard')}
      />
    }

    if (currentView === 'view-results') {
      return (
        <div className="student-results-view">
          <button 
            className="back-btn"
            onClick={() => setCurrentView('dashboard')}
          >
            ← Back to Dashboard
          </button>
          <ExamResults 
            exam={currentExam}
            attempt={currentAttempt}
            isAdmin={false}
          />
        </div>
      )
    }

    return (
      <div className="student-dashboard">
        <h2>Student Dashboard</h2>
        
        {/* Available Exams Section */}
        <div className="available-exams">
          <h3>Available Exams</h3>
          {exams.length === 0 ? (
            <p className="no-exams">No exams available</p>
          ) : (
            <div className="exams-grid">
              {exams.map(exam => (
                <div key={exam.id} className="exam-card">
                  <h4>{exam.title}</h4>
                  <div className="exam-info">
                    <p>Duration: {exam.duration} minutes</p>
                    <p>Questions: {exam.questions.length}</p>
                    <p>Created by: {exam.createdBy}</p>
                  </div>
                  <button 
                    className="start-exam-btn"
                    onClick={() => handleStartExam(exam)}
                  >
                    Start Exam
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student's Exam History */}
        <div className="exam-history">
          <h3>My Exam History</h3>
          {examAttempts.filter(a => a.studentId === user.email).length === 0 ? (
            <p className="no-results">No exam attempts yet</p>
          ) : (
            <div className="results-table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {examAttempts
                    .filter(a => a.studentId === user.email)
                    .map(attempt => (
                      <tr key={attempt.id}>
                        <td>{attempt.examTitle}</td>
                        <td>{attempt.score}%</td>
                        <td>
                          <span className={`status-badge ${
                            attempt.score >= attempt.passingScore ? 'pass' : 'fail'
                          }`}>
                            {attempt.score >= attempt.passingScore ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td>{new Date(attempt.submittedAt).toLocaleString()}</td>
                        <td>
                          <button 
                            className="view-results-btn"
                            onClick={() => handleViewResults(attempt)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="exam-system">
      <header className="app-header">
        <h1>Online Examination System</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button onClick={() => {
              setUser(null);
            }}>Logout</button>
          </div>
        )}
      </header>

      <main className="app-main">
        {renderMainContent()}
      </main>
    </div>
  )
}

export default App

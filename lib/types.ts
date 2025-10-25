export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  category: string
}

export interface QuizState {
  currentQuestionIndex: number
  score: number
  selectedAnswers: (number | null)[]
  isAnswered: boolean
  showFeedback: boolean
}

export interface LeaderboardEntry {
  id: string
  playerName: string
  score: number
  totalQuestions: number
  percentage: number
  timestamp: number
}

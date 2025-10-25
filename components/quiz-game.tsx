"use client"

import { useState, useEffect } from "react"
import type { Question, QuizState } from "@/lib/types"
import { QuestionCard } from "./question-card"
import { ResultsScreen } from "./results-screen"
import { Leaderboard } from "./leaderboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface QuizGameProps {
  questions: Question[]
}

type GameState = "playing" | "results" | "leaderboard"

export function QuizGame({ questions }: QuizGameProps) {
  const [gameState, setGameState] = useState<GameState>("playing")
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    selectedAnswers: Array(questions.length).fill(null),
    isAnswered: false,
    showFeedback: false,
  })
  const [timeLeft, setTimeLeft] = useState(30)
  const [showTimer, setShowTimer] = useState(true)

  const currentQuestion = questions[quizState.currentQuestionIndex]
  const isLastQuestion = quizState.currentQuestionIndex === questions.length - 1

  // Timer effect
  useEffect(() => {
    if (!showTimer || gameState !== "playing" || quizState.isAnswered) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showTimer, gameState, quizState.isAnswered])

  const handleTimeUp = () => {
    if (!quizState.isAnswered) {
      setQuizState((prev) => ({
        ...prev,
        isAnswered: true,
        showFeedback: true,
      }))
    }
  }

  const handleSelectAnswer = (index: number) => {
    if (quizState.isAnswered) return

    const newSelectedAnswers = [...quizState.selectedAnswers]
    newSelectedAnswers[quizState.currentQuestionIndex] = index

    const isCorrect = index === currentQuestion.correctAnswer
    const newScore = isCorrect ? quizState.score + 1 : quizState.score

    setQuizState((prev) => ({
      ...prev,
      selectedAnswers: newSelectedAnswers,
      score: newScore,
      isAnswered: true,
      showFeedback: true,
    }))
  }

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setGameState("results")
    } else {
      setTimeLeft(30)
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        isAnswered: false,
        showFeedback: false,
      }))
    }
  }

  const handleRestart = () => {
    setTimeLeft(30)
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      selectedAnswers: Array(questions.length).fill(null),
      isAnswered: false,
      showFeedback: false,
    })
    setGameState("playing")
  }

  if (gameState === "leaderboard") {
    return <Leaderboard onClose={() => setGameState("results")} />
  }

  if (gameState === "results") {
    return (
      <ResultsScreen
        score={quizState.score}
        totalQuestions={questions.length}
        onRestart={handleRestart}
        onViewLeaderboard={() => setGameState("leaderboard")}
      />
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quiz Game</h1>
        {showTimer && (
          <div className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-500" : "text-primary"}`}>{timeLeft}s</div>
        )}
      </div>

      <QuestionCard
        question={currentQuestion}
        questionNumber={quizState.currentQuestionIndex + 1}
        totalQuestions={questions.length}
        selectedAnswer={quizState.selectedAnswers[quizState.currentQuestionIndex]}
        isAnswered={quizState.isAnswered}
        showFeedback={quizState.showFeedback}
        onSelectAnswer={handleSelectAnswer}
      />

      {quizState.isAnswered && (
        <div className="space-y-4">
          {quizState.showFeedback && (
            <Card
              className={
                quizState.selectedAnswers[quizState.currentQuestionIndex] === currentQuestion.correctAnswer
                  ? "border-green-500"
                  : "border-red-500"
              }
            >
              <CardContent className="pt-6">
                <p
                  className={
                    quizState.selectedAnswers[quizState.currentQuestionIndex] === currentQuestion.correctAnswer
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {quizState.selectedAnswers[quizState.currentQuestionIndex] === currentQuestion.correctAnswer
                    ? "✓ Correct!"
                    : `✗ Incorrect. The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`}
                </p>
              </CardContent>
            </Card>
          )}
          <Button onClick={handleNextQuestion} className="w-full">
            {isLastQuestion ? "See Results" : "Next Question"}
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Score: {quizState.score}/{questions.length}
        </span>
        <Button variant="ghost" size="sm" onClick={() => setShowTimer(!showTimer)}>
          {showTimer ? "Hide" : "Show"} Timer
        </Button>
      </div>
    </div>
  )
}

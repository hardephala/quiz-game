"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveScore } from "@/lib/quiz-service"

interface ResultsScreenProps {
  score: number
  totalQuestions: number
  onRestart: () => void
  onViewLeaderboard: () => void
}

export function ResultsScreen({ score, totalQuestions, onRestart, onViewLeaderboard }: ResultsScreenProps) {
  const [playerName, setPlayerName] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const percentage = Math.round((score / totalQuestions) * 100)

  const handleSubmitScore = () => {
    if (playerName.trim()) {
      saveScore(playerName, score, totalQuestions)
      setSubmitted(true)
    }
  }

  const getPerformanceMessage = () => {
    if (percentage === 100) return "Perfect Score! Outstanding!"
    if (percentage >= 80) return "Excellent work!"
    if (percentage >= 60) return "Good job!"
    if (percentage >= 40) return "Not bad, try again!"
    return "Keep practicing!"
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-5xl font-bold text-primary">
            {score}/{totalQuestions}
          </div>
          <div className="text-2xl font-semibold text-muted-foreground">{percentage}%</div>
          <p className="text-lg text-foreground">{getPerformanceMessage()}</p>
        </div>

        {!submitted ? (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Enter your name to save your score:</label>
              <Input
                placeholder="Your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmitScore()}
              />
            </div>
            <Button onClick={handleSubmitScore} disabled={!playerName.trim()} className="w-full">
              Save Score
            </Button>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
            <p className="text-green-800 dark:text-green-200 font-medium">Score saved! Great job, {playerName}!</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={onViewLeaderboard} variant="outline" className="flex-1 bg-transparent">
            Leaderboard
          </Button>
          <Button onClick={onRestart} className="flex-1">
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

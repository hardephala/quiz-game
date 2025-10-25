"use client"

import { useEffect, useState } from "react"
import { QuizGame } from "@/components/quiz-game"
import { loadQuizzes } from "@/lib/quiz-service"
import type { Question } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadQuiz() {
      try {
        const quizzes = await loadQuizzes()
        if (quizzes && quizzes.length > 0) {
          setQuestions(quizzes[0].questions)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz")
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="space-y-4">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-lg text-muted-foreground">Loading quiz...</p>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-red-500">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto py-8">
        <QuizGame questions={questions} />
      </div>
    </main>
  )
}

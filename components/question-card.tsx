"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Question } from "@/lib/types"

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedAnswer: number | null
  isAnswered: boolean
  showFeedback: boolean
  onSelectAnswer: (index: number) => void
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isAnswered,
  showFeedback,
  onSelectAnswer,
}: QuestionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{question.question}</CardTitle>
          <span className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctAnswer
            const isSelected = index === selectedAnswer

            let buttonVariant: "default" | "outline" = "outline"
            let buttonClass = ""

            if (isAnswered && showFeedback) {
              if (isCorrect) {
                buttonClass = "bg-green-500 hover:bg-green-600 text-white border-green-500"
              } else if (isSelected && !isCorrect) {
                buttonClass = "bg-red-500 hover:bg-red-600 text-white border-red-500"
              }
            } else if (isSelected) {
              buttonVariant = "default"
            }

            return (
              <Button
                key={index}
                onClick={() => !isAnswered && onSelectAnswer(index)}
                disabled={isAnswered}
                variant={buttonVariant}
                className={`justify-start text-left h-auto py-3 px-4 ${buttonClass}`}
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

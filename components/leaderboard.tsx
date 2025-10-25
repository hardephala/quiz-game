"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getLeaderboard } from "@/lib/quiz-service"
import type { LeaderboardEntry } from "@/lib/types"

interface LeaderboardProps {
  onClose: () => void
}

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [scores, setScores] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const leaderboard = getLeaderboard()
      setScores(leaderboard)
    } catch (error) {
      console.error("Error loading leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Top Scores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading leaderboard...</p>
        ) : scores.length === 0 ? (
          <p className="text-center text-muted-foreground">No scores yet. Be the first!</p>
        ) : (
          <div className="space-y-2">
            {scores.map((entry, index) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-primary w-8">#{index + 1}</span>
                  <div>
                    <p className="font-semibold">{entry.playerName}</p>
                    <p className="text-sm text-muted-foreground">{new Date(entry.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {entry.score}/{entry.totalQuestions}
                  </p>
                  <p className="text-sm text-muted-foreground">{entry.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button onClick={onClose} className="w-full mt-4">
          Back to Quiz
        </Button>
      </CardContent>
    </Card>
  )
}

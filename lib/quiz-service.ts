import type { LeaderboardEntry } from "./types"

export async function loadQuizzes() {
  try {
    const response = await fetch("/quiz-data.json")
    if (!response.ok) throw new Error("Failed to load quiz data")
    const data = await response.json()
    return data.quizzes
  } catch (error) {
    console.error("Error loading quizzes:", error)
    throw new Error("Unable to load quiz questions. Please try again later.")
  }
}

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("quiz-leaderboard")
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading leaderboard:", error)
    return []
  }
}

export function saveScore(playerName: string, score: number, totalQuestions: number): void {
  if (typeof window === "undefined") return

  try {
    const leaderboard = getLeaderboard()
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      playerName,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      timestamp: Date.now(),
    }

    leaderboard.push(newEntry)
    leaderboard.sort((a, b) => b.score - a.score)
    const topScores = leaderboard.slice(0, 50)

    localStorage.setItem("quiz-leaderboard", JSON.stringify(topScores))
  } catch (error) {
    console.error("Error saving score:", error)
  }
}

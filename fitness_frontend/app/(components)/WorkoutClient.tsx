"use client"

import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'
import { Clock, Dumbbell, Calendar } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Exercise {
    name: string
    sets: number
    reps: number
    rest: number
    image: string
}

interface WorkoutDay {
    day: string
    exercises: Exercise[]
}

export default function WorkoutClient() {
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>([])
    const [loading, setLoading] = useState(false)

    const searchParams = useSearchParams()
    const shouldGenerate = searchParams.get("generate") === "true"

    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null

    const fetchWorkout = async () => {
        try {
            setLoading(true)

            if (shouldGenerate) {
                const res = await axios.post(
                    "https://aifitnessappnew.pythonanywhere.com/generate-workout/",
                    {},
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                )

                setWorkoutPlan(res.data.plan)

                const url = new URL(window.location.href)
                url.searchParams.delete("generate")
                window.history.replaceState({}, "", url.toString())
            } else {
                const res = await axios.get(
                    "https://aifitnessappnew.pythonanywhere.com/workout-plans/",
                    {
                        headers: { Authorization: `Token ${token}` },
                    }
                )

                const latest = res.data[0]?.plan_json || []
                setWorkoutPlan(latest)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWorkout()
    }, [shouldGenerate])

    if (loading) {
        return (
            <div className="text-center space-y-4 p-8">
                <div className="text-2xl">Generating your workout...</div>
                <div className="opacity-60">This may take 30–60 seconds</div>
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-8">
            {workoutPlan.map((dayPlan, dayIndex) => (
                <div key={dayIndex} className="space-y-6">
                    <div className="p-6 border rounded-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold">{dayPlan.day}</h2>
                            <Calendar />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dayPlan.exercises.map((ex, i) => (
                            <Card key={i}>
                                <img src={ex.image} alt={ex.name} />
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Dumbbell className="w-5 h-5" />
                                        {ex.name}
                                    </h3>

                                    <div className="flex justify-between">
                                        <span>Sets: {ex.sets}</span>
                                        <span>Reps: {ex.reps}</span>
                                        <span>Rest: {ex.rest}s</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {Math.round((ex.sets * (ex.rest + 40)) / 60)} min
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

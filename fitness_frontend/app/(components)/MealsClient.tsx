"use client"

import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'
import { Utensils } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Meal {
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
}

export default function MealsClient() {
    const [meals, setMeals] = useState<Meal[]>([])
    const [loading, setLoading] = useState(true)

    const searchParams = useSearchParams()
    const shouldGenerate = searchParams.get("generate") === "true"

    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null

    const fetchMeals = async () => {
        try {
            setLoading(true)

            if (shouldGenerate) {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/generate-meal-plan/`,
                    {},
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                )

                setMeals(res.data.meals)

                const url = new URL(window.location.href)
                url.searchParams.delete("generate")
                window.history.replaceState({}, "", url.toString())
            } else {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/meal-plans/`,
                    {
                        headers: { Authorization: `Token ${token}` },
                    }
                )

                const latest = res.data[0]?.meals_json || []
                setMeals(latest)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMeals()
    }, [shouldGenerate])

    if (loading) {
        return <p className="animate-pulse">Generating meal plan...</p>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">
                Your Daily Meal Plan
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {meals.map((meal, i) => (
                    <Card key={i}>
                        <CardContent className="p-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <Utensils className="w-6 h-6" />
                                <h2 className="text-xl font-semibold">{meal.name}</h2>
                            </div>

                            <div className="grid grid-cols-4 text-center">
                                <div>
                                    <p>{meal.calories}</p>
                                    <p>Calories</p>
                                </div>
                                <div>
                                    <p>{meal.protein}g</p>
                                    <p>Protein</p>
                                </div>
                                <div>
                                    <p>{meal.carbs}g</p>
                                    <p>Carbs</p>
                                </div>
                                <div>
                                    <p>{meal.fats}g</p>
                                    <p>Fats</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

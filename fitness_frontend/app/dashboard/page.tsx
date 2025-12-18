"use client";

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios';
import { Activity, Brain, Dumbbell, Salad } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'



function page() {
  const router = useRouter();
  const [weightData, setWeightData] = useState([])
  const [aiTip, setAiTip] = useState("Keep pushing! Consistency is key")

  useEffect(() => {
    const token = localStorage.getItem("token")
    axios.get("https://aifitnessappnew.pythonanywhere.com/progress/", {
      headers: { Authorization: `Token ${token}` },


    })
      .then((res) => {
        const formatteddata = res.data.map((entry: any) => ({
          date: entry.date,
          weight: entry.weight,
        }))
        setWeightData(formatteddata)
      })
      .catch(() => { })
  }, [])

  const generateAiTip = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await axios.post("https://aifitnessappnew.pythonanywhere.com/chat/",
        { message: "Give me a short fitness motivation tip" },
        { headers: { Authorization: `Token ${token}` } }
      )
      setAiTip(res.data.reply)
    } catch (error) {
      setAiTip("Stay strong! Your future self will thank you.");
    }
  }
  return (
    <div className='space-y-6'>

      <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-glow-strong bg-clip-text text-transparent">
        Your Fitness Overview
      </h1>

      {/* Quick Actions */}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>

        <Button onClick={() => router.push("/dashboard/workout?generate=true")} className="bg-primary hover:bg-primary/darker flex items-center gap-2">
          <Dumbbell size={20} /> Generate Workout Plan
        </Button>
        <Button onClick={() => router.push("/dashboard/meals?generate=true")} className="bg-primary hover:bg-primary/darker flex items-center gap-2">
          <Salad size={20} /> Generate Meal Plan
        </Button>
        <Button className="bg-primary hover:bg-primary/darker flex items-center gap-2">
          <Activity size={20} /> Log Progress
        </Button>
      </div>
      {/* Stats Cards */}


      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

        <Card className='bg-card border border-primary/20 shadow-md hover:shadow-lg transition rounded-xl'>
          <CardContent className="p-6 text-center">
            <h2 className="text-lg text-primary font-semibold">Weekly Calories</h2>
            <p className="text-3xl font-bold  mt-2">12,450</p>
          </CardContent>
        </Card>


        <Card className="bg-card border border-primary/20 shadow-md hover:shadow-lg transition rounded-xl">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg text-primary font-semibold">Workouts Completed</h2>
            <p className="text-3xl font-bold  mt-2">4</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-primary/20 shadow-md hover:shadow-lg transition rounded-xl">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg text-primary font-semibold">Hydration</h2>
            <p className="text-3xl font-bold  mt-2">2.3 L</p>
          </CardContent>
        </Card>
      </div>
      {/* Weight Progress Chart */}

      <Card className='bg-card border border-primary/20 rounded-xl shadow-md'>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-primary">Weight Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <XAxis dataKey="date" />
              <YAxis stroke="#4ade80" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#22c55e" }} />
              <Line stroke="#22c55e" strokeWidth={3} type="monotone" dataKey="weight" />


            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Tip Card */}

      <Card className='bg-linear-to-br from-primary/40 to-card border border-primary/30 backdrop-blur-md rounded-xl shadow-lg'>

        <CardContent className='p-6 flex items-start gap-4'>
          <Brain size={40} className="text-primary" />
          <div>
            <h3 className='text-xl font-semibold text-primary mb-2'>AI Tip of the Day</h3>

            <p className='text-black'>{aiTip}</p>
            <Button onClick={generateAiTip} className="mt-4 bg-primary hover:bg-primary/darker">Refresh Tip</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default page
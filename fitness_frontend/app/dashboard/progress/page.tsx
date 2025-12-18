"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';

function page() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    date: "",
    weight: "",
    calories: "",
    workouts_done: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;


  const fetchProgress = async () => {
    try {
      const res = await axios.get("https://aifitnessappnew.pythonanywhere.com/progress/",
        { headers: { Authorization: `Token ${token}` } }
      )
      setLogs(res.data);
    } catch (error) {
      console.error("Failed to load progress:", error);
    } finally {
      setLoading(false)
    }
  }

  // Save Progress Entry
  const saveProgress = async () => {
    if (!form.date) {
      toast.error("Date is required.");
      return;
    }

    try {
      const res = await axios.post("https://aifitnessappnew.pythonanywhere.com/progress/", form,
        { headers: { Authorization: `Token ${token}` } }
      )

      toast.success("Progress saved!");
      setForm({
        date: "",
        weight: "",
        calories: "",
        workouts_done: "",
      });
      fetchProgress()
    } catch (error) {
      toast.error("Failed to save progress.");
      console.error(error)
    }

  }
  useEffect(() => {
    fetchProgress()
  }, [])
  return (
    <div className='space-y-10'>

      {/* Input Form */}
      <Card className="bg-card border border-primary/20 p-6 rounded-xl">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Date */}
          <div>
            <label>Date</label>
            <Input
              type="date"
              className="bg-white mt-1"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          {/* Weight */}
          <div>
            <label>Weight (kg)</label>
            <Input
              type="number"
              className="bg-white mt-1"
              value={form.weight}
              onChange={(e) =>
                setForm({ ...form, weight: e.target.value })
              }
            />
          </div>

          {/* Calories */}
          <div>
            <label>Calories (eaten or burned)</label>
            <Input
              type="number"
              className="bg-white mt-1"
              value={form.calories}
              onChange={(e) =>
                setForm({ ...form, calories: e.target.value })
              }
            />
          </div>

          {/* Workouts Done */}
          <div>
            <label>Workouts Done</label>
            <Input
              type="number"
              className="bg-white mt-1"
              value={form.workouts_done}
              onChange={(e) =>
                setForm({ ...form, workouts_done: e.target.value })
              }
            />
          </div>

          <Button
            onClick={saveProgress}
            className="bg-primary col-span-1 md:col-span-2"
          >
            Save Progress
          </Button>
        </CardContent>
      </Card>


      {/* Weight Progress Chart */}

      <Card className='bg-card border border-primary/20 rounded-xl shadow-md'>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-primary">Weight Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={logs}>
              <XAxis dataKey="date" />
              <YAxis stroke="#4ade80" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#22c55e" }} />
              <Line stroke="#22c55e" strokeWidth={3} type="monotone" dataKey="weight" />


            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>



      {/* Calories */}

      <Card className='bg-card border border-primary/20 rounded-xl shadow-md'>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-primary">Calories Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={logs}>
              <XAxis dataKey="date" />
              <YAxis stroke="#4ade80" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#22c55e" }} />
              <Line stroke="#22c55e" strokeWidth={3} type="monotone" dataKey="calories" />


            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>



      {/* Workouts Done Chart */}

      <Card className='bg-card border border-primary/20 rounded-xl shadow-md'>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-primary">Workout Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={logs}>
              <XAxis dataKey="date" />
              <YAxis stroke="#4ade80" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#22c55e" }} />
              <Line stroke="#22c55e" strokeWidth={3} type="monotone" dataKey="workouts_done" />


            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default page
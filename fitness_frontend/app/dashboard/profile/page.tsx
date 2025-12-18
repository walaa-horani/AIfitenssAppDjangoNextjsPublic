"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


interface Profile {
  age: string;
  weight: string;
  height: string;
  gender: string;
  goal: string;
  activity_level: string;
}

interface ProfileAPIResponse {
  id: number;
  age: number;
  weight: number;
  height: number;
  gender: string;
  goal: string;
  activity_level: string;
}

function ProfilePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    age: "",
    weight: "",
    height: "",
    gender: "",
    goal: "",
    activity_level: "",
  });
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch Profile

  const loadProfile = async () => {
    try {
      const res = await axios.get<ProfileAPIResponse[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      )
      if (res.data.length > 0) {
        const p = res.data[0];
        setProfile({
          age: p.age.toString(),
          weight: p.weight.toString(),
          height: p.height.toString(),
          gender: p.gender,
          goal: p.goal,
          activity_level: p.activity_level,
        });
      }
    } catch (error) {
      console.log("No profile found — user must create one.");
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  // Save Profile
  const saveProfile = async () => {
    setSaving(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/`,
        {
          age: Number(profile.age),
          weight: Number(profile.weight),
          height: Number(profile.height),
          gender: profile.gender.trim(),
          goal: profile.goal.trim(),
          activity_level: profile.activity_level.trim(),
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      alert("Profile saved successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card className="bg-card border border-primary/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary text-2xl">
            Your Fitness Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Age */}
          <div>
            <Label className="text-black">Age</Label>
            <Input
              type="number"
              placeholder="Enter your age"
              className="bg-input text-black mt-1"
              value={profile.age}
              onChange={(e) =>
                setProfile({ ...profile, age: e.target.value })
              }
            />
          </div>

          {/* Weight */}
          <div>
            <Label className="text-black">Weight (kg)</Label>
            <Input
              type="number"
              placeholder="e.g. 70"
              className="bg-input text-black mt-1"
              value={profile.weight}
              onChange={(e) =>
                setProfile({ ...profile, weight: e.target.value })
              }
            />
          </div>

          {/* Height */}
          <div>
            <Label className="text-black">Height (cm)</Label>
            <Input
              type="number"
              placeholder="e.g. 170"
              className="bg-input text-black mt-1"
              value={profile.height}
              onChange={(e) =>
                setProfile({ ...profile, height: e.target.value })
              }
            />
          </div>

          {/* Gender */}
          <div>
            <Label className="text-black">Gender</Label>
            <Input
              placeholder="male / female"
              className="bg-input text-black mt-1"
              value={profile.gender}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
            />
          </div>

          {/* Goal */}
          <div>
            <Label className="text-black">Goal</Label>
            <Input
              placeholder="muscle_gain / fat_loss / maintain"
              className="bg-input text-black mt-1"
              value={profile.goal}
              onChange={(e) =>
                setProfile({ ...profile, goal: e.target.value })
              }
            />
          </div>

          {/* Activity Level */}
          <div>
            <Label className="text-black">Activity Level</Label>
            <Input
              placeholder="low / moderate / high"
              className="bg-input text-black mt-1"
              value={profile.activity_level}
              onChange={(e) =>
                setProfile({ ...profile, activity_level: e.target.value })
              }
            />
          </div>

          {/* Save button */}
          <Button
            onClick={saveProfile}
            className="w-full bg-primary hover:bg-primary/darker"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
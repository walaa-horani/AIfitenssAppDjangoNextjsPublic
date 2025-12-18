"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/`, {
                username,
                password,
            });
            console.log("LOGIN RESPONSE:", res.data)

            localStorage.setItem("token", res.data.token);
            router.push("/dashboard");
        } catch (err) {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="bg-card w-full max-w-md rounded-xl p-8 shadow-lg border border-primary/20">
                <h1 className="text-3xl font-bold text-primary mb-6 text-center">Welcome Back</h1>

                <div className="space-y-4">
                    <Input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button className="w-full bg-primary hover:bg-primary/darker" onClick={handleLogin}>
                        Login
                    </Button>

                    <p className="text-center text-sm mt-4 text-glow-strong">
                        Don't have an account? <a href="/auth/register" className="underline">Register</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
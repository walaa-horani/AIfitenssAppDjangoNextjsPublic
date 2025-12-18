"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register/`, {
                username,
                email,
                password,
            });

            router.push("/auth/login");
        } catch (err) {
            setError("Registration failed.");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="bg-card w-full max-w-md rounded-xl p-8 shadow-lg border border-primary/20">
                <h1 className="text-3xl font-bold text-primary mb-6 text-center">Create Account</h1>

                <div className="space-y-4">
                    <Input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button className="w-full bg-primary hover:bg-primary/darker" onClick={handleRegister}>
                        Register
                    </Button>

                    <p className="text-center text-sm mt-4 text-glow-strong">
                        Already have an account? <a href="/auth/login" className="underline">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
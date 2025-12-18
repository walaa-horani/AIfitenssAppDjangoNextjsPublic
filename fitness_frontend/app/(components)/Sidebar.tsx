"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Salad, Activity, MessageSquare, Home, User2Icon } from "lucide-react";

const items = [
  { name: "profile", href: "/dashboard/profile", icon: User2Icon },
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Workout Plan", href: "/dashboard/workout", icon: Dumbbell },
  { name: "Meals", href: "/dashboard/meals", icon: Salad },
  { name: "Progress", href: "/dashboard/progress", icon: Activity },
  { name: "AI Coach", href: "/dashboard/chat", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-primary/20 p-4 min-h-screen">
      <h2 className="text-xl font-semibold mb-6 bg-linear-to-r from-primary to-glow-strong bg-clip-text text-transparent">
        Fitness Dashboard
      </h2>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                ${active ? "bg-primary/20 text-primary border border-primary" : "hover:bg-primary/10"}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
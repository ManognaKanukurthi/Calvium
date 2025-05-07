"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { name: "Generate", path: "/generate" },
    { name: "Dashboard", path: "/dashboard" },
  ]

  return (
    <header className="border-b px-20">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <Link href="/" className="text-xl font-bold">
            CourseGPT
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.path ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

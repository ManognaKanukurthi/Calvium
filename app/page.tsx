import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Layers, Edit3 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="block">Create Courses with</span>
          <span className="block text-primary">AI-Powered Assistance</span>
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          CourseGPT helps educators and content creators build structured, high-quality educational materials with the
          power of AI.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/generate">Start Creating</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="mt-20 grid gap-8 md:grid-cols-3 max-w-5xl">
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
          <BookOpen className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-bold mb-2">Lesson Generator</h2>
          <p className="text-muted-foreground">
            Generate complete lesson plans from simple topic inputs with AI assistance.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
          <Layers className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-bold mb-2">Module Organizer</h2>
          <p className="text-muted-foreground">
            Group and sequence lessons into structured modules with drag-and-drop simplicity.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
          <Edit3 className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-bold mb-2">Interactive Editor</h2>
          <p className="text-muted-foreground">
            Refine AI-generated content with a rich text editor and regenerate specific sections.
          </p>
        </div>
      </div>
    </div>
  )
}

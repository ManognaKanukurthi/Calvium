"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getLessons, getModules, deleteLesson } from "@/lib/actions"

export default function DashboardPage() {
  const [lessons, setLessons] = useState<any[]>([])
  const [modules, setModules] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch lessons from database
        const lessonsData = await getLessons()
        setLessons(lessonsData)

        // Fetch modules from database
        const modulesData = await getModules()
        setModules(modulesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error loading data",
          description: "There was a problem loading your lessons and modules.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleDeleteLesson = async (id: string) => {
    try {
      const result = await deleteLesson(id)

      if (result.success) {
        // Update the local state
        setLessons(lessons.filter((lesson) => lesson.id !== id))

        toast({
          title: "Lesson deleted",
          description: "The lesson has been removed from your dashboard.",
        })
      } else {
        throw new Error(result.error || "Unknown error")
      }
    } catch (error) {
      toast({
        title: "Error deleting lesson",
        description: "There was a problem deleting the lesson. Please try again.",
        variant: "destructive",
      })
    }

    setDeleteId(null)
  }

  return (
    <div className="container mx-auto px-5 w-full py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Course Dashboard</h1>

        <Button asChild>
          <Link href="/generate">
            <Plus className="mr-2 h-4 w-4" />
            New Lesson
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Modules</h2>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-9 bg-muted rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : modules.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <Card key={module.id}>
                  <CardHeader>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>
                      {module.lessons.length} lessons • {module.difficulty}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground">{module.description}</p>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View Module
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">You haven't created any modules yet.</p>
                <Button>Create Your First Module</Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Lessons</h2>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-9 bg-muted rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : lessons.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson) => (
                <Card key={lesson.id}>
                  <CardHeader>
                    <CardTitle>{lesson.title}</CardTitle>
                    <CardDescription>
                      {new Date(lesson.createdAt).toLocaleDateString()} • {lesson.metadata?.difficulty}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{lesson.description}</p>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/editor?id=${lesson.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setDeleteId(lesson.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Lesson</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this lesson? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={() => deleteId && handleDeleteLesson(deleteId)}>
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">You haven't created any lessons yet.</p>
                <Button asChild>
                  <Link href="/generate">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Lesson
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

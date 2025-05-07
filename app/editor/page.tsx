"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, ArrowLeft, RefreshCw } from "lucide-react"
import { saveLesson, getLesson } from "@/lib/actions"
import BlockNoteEditor from "@/components/block-note-editor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EditorPage() {
  const [lesson, setLesson] = useState<any>(null)
  const [loading, setSaving] = useState(false)
  const [regenerating, setRegenerating] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("metadata")
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lessonId = searchParams.get("id")

  useEffect(() => {
    const fetchLesson = async () => {
      if (lessonId) {
        // Fetch lesson from database
        const lessonData = await getLesson(lessonId)
        if (lessonData) {
          setLesson(lessonData)
        } else {
          toast({
            title: "Lesson not found",
            description: "The requested lesson could not be found.",
            variant: "destructive",
          })
          router.push("/dashboard")
        }
      } else {
        // Load the lesson from localStorage for new lessons
        const savedLesson = localStorage.getItem("currentLesson")
        if (savedLesson) {
          setLesson(JSON.parse(savedLesson))
        } else {
          // If no lesson is found, redirect to the generate page
          router.push("/generate")
        }
      }
    }

    fetchLesson()
  }, [lessonId, router, toast])

  const handleSave = async () => {
    if (!lesson) return

    setSaving(true)

    try {
      const result = await saveLesson(lesson)

      if (result.success) {
        toast({
          title: "Lesson saved successfully!",
          description: "Your lesson has been saved to the database.",
        })

        // Navigate to the dashboard
        router.push("/dashboard")
      } else {
        throw new Error(result.error || "Unknown error")
      }
    } catch (error) {
      toast({
        title: "Error saving lesson",
        description: "There was a problem saving your lesson. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setLesson((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleOutcomeChange = (index: number, value: string) => {
    const updatedOutcomes = [...lesson.learningOutcomes]
    updatedOutcomes[index] = value

    setLesson((prev: any) => ({
      ...prev,
      learningOutcomes: updatedOutcomes,
    }))
  }

  const handleConceptChange = (index: number, field: string, value: string) => {
    const updatedConcepts = [...lesson.keyConcepts]
    updatedConcepts[index] = {
      ...updatedConcepts[index],
      [field]: value,
    }

    setLesson((prev: any) => ({
      ...prev,
      keyConcepts: updatedConcepts,
    }))
  }

  const handleActivityChange = (index: number, field: string, value: string) => {
    const updatedActivities = [...lesson.activities]
    updatedActivities[index] = {
      ...updatedActivities[index],
      [field]: value,
    }

    setLesson((prev: any) => ({
      ...prev,
      activities: updatedActivities,
    }))
  }

  const handleContentChange = (content: any) => {
    setLesson((prev: any) => ({
      ...prev,
      content,
    }))
  }

  const regenerateSection = async (section: string) => {
    setRegenerating(section)

    // Simulate API call to regenerate content
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock regenerated content
    const updatedLesson = { ...lesson }

    switch (section) {
      case "title":
        updatedLesson.title = `Mastering ${lesson.topic}: A Comprehensive Guide`
        break
      case "description":
        updatedLesson.description = `An in-depth exploration of ${lesson.topic} designed for learners of all levels. This lesson provides both theoretical foundations and practical applications to ensure a well-rounded understanding.`
        break
      case "learningOutcomes":
        updatedLesson.learningOutcomes = [
          `Comprehensively explain the theory behind ${lesson.topic}`,
          `Demonstrate proficiency in applying ${lesson.topic} concepts`,
          `Evaluate and critique examples of ${lesson.topic} in various contexts`,
          `Create original solutions using principles of ${lesson.topic}`,
        ]
        break
      case "keyConcepts":
        updatedLesson.keyConcepts = [
          {
            name: `${lesson.topic} Fundamentals`,
            description: `Essential principles and components that form the foundation of ${lesson.topic}.`,
          },
          {
            name: `${lesson.topic} Methodologies`,
            description: `Systematic approaches and frameworks used in ${lesson.topic}.`,
          },
          {
            name: `${lesson.topic} Applications`,
            description: `Practical implementations and real-world uses of ${lesson.topic}.`,
          },
          {
            name: `Future of ${lesson.topic}`,
            description: `Emerging trends and developments in the field of ${lesson.topic}.`,
          },
        ]
        break
      case "activities":
        updatedLesson.activities = [
          {
            title: "Case Study Analysis",
            description: `Analyze the provided case studies related to ${lesson.topic} and identify key principles in action.`,
          },
          {
            title: "Collaborative Projects",
            description: `Work in teams to develop a solution to a problem using ${lesson.topic} concepts.`,
          },
          {
            title: "Reflective Journal",
            description: `Document your learning journey with ${lesson.topic}, noting challenges, insights, and applications.`,
          },
          {
            title: "Peer Teaching",
            description: `Prepare a mini-lesson on an aspect of ${lesson.topic} and teach it to a small group of peers.`,
          },
        ]
        break
    }

    setLesson(updatedLesson)
    setRegenerating(null)

    toast({
      title: "Content regenerated",
      description: `The ${section} section has been updated with new content.`,
    })
  }

  if (!lesson) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard")} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Lesson</h1>
        </div>

        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Lesson
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metadata">Lesson Metadata</TabsTrigger>
          <TabsTrigger value="content">Lesson Content</TabsTrigger>
        </TabsList>

        <TabsContent value="metadata" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Edit the core details of your lesson</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="title">Lesson Title</Label>
                    <Input
                      id="title"
                      value={lesson.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => regenerateSection("title")}
                    disabled={regenerating === "title"}
                  >
                    {regenerating === "title" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={lesson.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => regenerateSection("description")}
                    disabled={regenerating === "description"}
                  >
                    {regenerating === "description" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Learning Outcomes</CardTitle>
                  <CardDescription>What students will learn from this lesson</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => regenerateSection("learningOutcomes")}
                  disabled={regenerating === "learningOutcomes"}
                >
                  {regenerating === "learningOutcomes" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate All
                    </>
                  )}
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                {lesson.learningOutcomes.map((outcome: string, index: number) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`outcome-${index}`}>Outcome {index + 1}</Label>
                    <Input
                      id={`outcome-${index}`}
                      value={outcome}
                      onChange={(e) => handleOutcomeChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Key Concepts</CardTitle>
                  <CardDescription>Core ideas and principles covered in the lesson</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => regenerateSection("keyConcepts")}
                  disabled={regenerating === "keyConcepts"}
                >
                  {regenerating === "keyConcepts" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate All
                    </>
                  )}
                </Button>
              </CardHeader>

              <CardContent className="space-y-6">
                {lesson.keyConcepts.map((concept: any, index: number) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor={`concept-name-${index}`}>Concept Name</Label>
                      <Input
                        id={`concept-name-${index}`}
                        value={concept.name}
                        onChange={(e) => handleConceptChange(index, "name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`concept-desc-${index}`}>Description</Label>
                      <Textarea
                        id={`concept-desc-${index}`}
                        value={concept.description}
                        onChange={(e) => handleConceptChange(index, "description", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Activities</CardTitle>
                  <CardDescription>Engaging exercises to reinforce learning</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => regenerateSection("activities")}
                  disabled={regenerating === "activities"}
                >
                  {regenerating === "activities" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate All
                    </>
                  )}
                </Button>
              </CardHeader>

              <CardContent className="space-y-6">
                {lesson.activities.map((activity: any, index: number) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor={`activity-title-${index}`}>Activity Title</Label>
                      <Input
                        id={`activity-title-${index}`}
                        value={activity.title}
                        onChange={(e) => handleActivityChange(index, "title", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`activity-desc-${index}`}>Description</Label>
                      <Textarea
                        id={`activity-desc-${index}`}
                        value={activity.description}
                        onChange={(e) => handleActivityChange(index, "description", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
                <CardDescription>Additional information about your lesson</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Input
                      id="difficulty"
                      value={lesson.metadata?.difficulty || ""}
                      onChange={(e) =>
                        setLesson((prev: any) => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            difficulty: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedTime">Estimated Time</Label>
                    <Input
                      id="estimatedTime"
                      value={lesson.metadata?.estimatedTime || ""}
                      onChange={(e) =>
                        setLesson((prev: any) => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            estimatedTime: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
              <CardDescription>Create rich, interactive content for your lesson</CardDescription>
            </CardHeader>
            <CardContent>
              <BlockNoteEditor initialContent={lesson.content} onChange={handleContentChange} />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Lesson...
                  </>
                ) : (
                  "Save and Continue"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { generateLesson, saveLesson } from "@/lib/actions"

export default function GeneratePage() {
  const [topic, setTopic] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!topic.trim()) {
      toast({
        title: "Topic is required",
        description: "Please enter a course topic to generate content.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Generate lesson content
      const lessonData = await generateLesson(topic, additionalInfo)

      // Save the generated lesson to the database
      const result = await saveLesson(lessonData)

      if (result.success) {
        toast({
          title: "Lesson generated successfully!",
          description: "Your lesson has been created and is ready for editing.",
        })

        // Navigate to the editor page with the new lesson ID
        //@ts-ignore
        router.push(`/editor?id=${result?.lesson.id}`)
      } else {
        throw new Error(result.error || "Unknown error")
      }
    } catch (error) {
      toast({
        title: "Error generating lesson",
        description: "There was a problem generating your lesson. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mx-10 mb-10">Generate a New Lesson</h1>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Lesson Generator</CardTitle>
            <CardDescription>Enter a topic and our AI will create a structured lesson plan for you.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Course Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Introduction to Photosynthesis"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Target audience, specific aspects to cover, etc."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                disabled={loading}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Lesson...
                </>
              ) : (
                "Generate Lesson"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

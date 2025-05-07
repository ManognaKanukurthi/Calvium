"use server"

import { revalidatePath } from "next/cache"
import prisma from "./prisma"

// This function will call the OpenAI API in a real implementation
// For now, it returns mock data
export async function generateLesson(topic: string, additionalInfo?: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock response data
  const lessonData = {
    topic,
    title: `Understanding ${topic}`,
    description: `A comprehensive introduction to ${topic} designed for beginners. This lesson covers the fundamental concepts and provides practical examples.`,
    learningOutcomes: [
      `Explain the core principles of ${topic}`,
      `Identify key components involved in ${topic}`,
      `Apply knowledge of ${topic} to solve basic problems`,
      `Analyze real-world examples of ${topic}`,
    ],
    keyConcepts: [
      {
        name: `Foundation of ${topic}`,
        description: `The basic building blocks and principles that make up ${topic}.`,
      },
      {
        name: `${topic} in Practice`,
        description: `How ${topic} is applied in real-world scenarios and its practical implications.`,
      },
      {
        name: `Advanced ${topic} Concepts`,
        description: `More complex aspects of ${topic} for deeper understanding.`,
      },
    ],
    activities: [
      {
        title: "Group Discussion",
        description: `Break into small groups and discuss how ${topic} affects everyday life. Share examples and insights.`,
      },
      {
        title: "Problem-Solving Exercise",
        description: `Complete the worksheet with problems related to ${topic} and apply the concepts learned.`,
      },
      {
        title: "Research Project",
        description: `Research a specific aspect of ${topic} and prepare a short presentation for the class.`,
      },
    ],
    metadata: {
      difficulty: "Beginner",
      estimatedTime: "45 minutes",
      prerequisites: [],
    },
    content: null, // Will be populated with BlockNote content later
  }

  return lessonData
}

export async function saveLesson(lessonData: any) {
  try {
    // Check if the lesson already exists
    if (lessonData.id) {
      // Update existing lesson
      const updatedLesson = await prisma.lesson.update({
        where: { id: lessonData.id },
        data: {
          topic: lessonData.topic,
          title: lessonData.title,
          description: lessonData.description,
          learningOutcomes: lessonData.learningOutcomes,
          keyConcepts: lessonData.keyConcepts,
          activities: lessonData.activities,
          content: lessonData.content,
          metadata: lessonData.metadata,
        },
      })

      revalidatePath("/dashboard")
      return { success: true, lesson: updatedLesson }
    } else {
      // Create new lesson
      const newLesson = await prisma.lesson.create({
        data: {
          topic: lessonData.topic,
          title: lessonData.title,
          description: lessonData.description,
          learningOutcomes: lessonData.learningOutcomes,
          keyConcepts: lessonData.keyConcepts,
          activities: lessonData.activities,
          content: lessonData.content,
          metadata: lessonData.metadata,
        },
      })

      revalidatePath("/dashboard")
      return { success: true, lesson: newLesson }
    }
  } catch (error) {
    console.error("Error saving lesson:", error)
    return { success: false, error: "Failed to save lesson" }
  }
}

export async function getLessons() {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: { createdAt: "desc" },
    })
    return lessons
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return []
  }
}

export async function getLesson(id: string) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
    })
    return lesson
  } catch (error) {
    console.error("Error fetching lesson:", error)
    return null
  }
}

export async function deleteLesson(id: string) {
  try {
    await prisma.lesson.delete({
      where: { id },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting lesson:", error)
    return { success: false, error: "Failed to delete lesson" }
  }
}

export async function getModules() {
  try {
    const modules = await prisma.module.findMany({
      include: {
        lessons: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return modules
  } catch (error) {
    console.error("Error fetching modules:", error)
    return []
  }
}

export async function createModule(moduleData: any) {
  try {
    const newModule = await prisma.module.create({
      data: {
        title: moduleData.title,
        description: moduleData.description,
        difficulty: moduleData.difficulty,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, module: newModule }
  } catch (error) {
    console.error("Error creating module:", error)
    return { success: false, error: "Failed to create module" }
  }
}

export async function addLessonToModule(lessonId: string, moduleId: string) {
  try {
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        moduleId,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, lesson: updatedLesson }
  } catch (error) {
    console.error("Error adding lesson to module:", error)
    return { success: false, error: "Failed to add lesson to module" }
  }
}

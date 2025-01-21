"use client";

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useSession } from "next-auth/react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { StepIndicator } from '@/components/generate/StepIndicator'
import { SettingsStep } from '@/components/generate/SettingsStep'
import { OutlineStep } from '@/components/generate/OutlineStep'
import { ContentStep } from '@/components/generate/ContentStep'
import { GenerationSettings, OutlineItem, GeneratedContent, GenerationStep } from '@/types/generate'

const STEPS = [
  { title: 'Settings', description: 'Configure your content' },
  { title: 'Outline', description: 'Structure your content' },
  { title: 'Generate', description: 'Generate content' },
]

export default function GenerateContent() {
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = React.useState<GenerationStep>('settings')
  const [error, setError] = React.useState<string | null>(null)
  const [localCredits, setLocalCredits] = React.useState(session?.user?.credits || 0)
  const [outlineLoading, setOutlineLoading] = React.useState(false)
  const [currentGeneratingId, setCurrentGeneratingId] = React.useState<string | null>(null)
  const [creditsRemaining, setCreditsRemaining] = React.useState(session?.user?.credits || 0)

  const [settings, setSettings] = React.useState<GenerationSettings>({
    contentType: 'blog-post',
    tone: 'professional',
    language: 'en',
    writingLevel: 'intermediate',
    prompt: '',
    targetLength: 1000,
    keywords: [],
  })

  const [outline, setOutline] = React.useState<OutlineItem[]>([])
  const [generatedContent, setGeneratedContent] = React.useState<GeneratedContent>({
    title: '',
    outline: [],
    content: {},
    currentGeneratingId: null
  })

  const handleNextStep = React.useCallback(() => {
    setCurrentStep(current => {
      switch (current) {
        case 'settings':
          return 'outline'
        case 'outline':
          setGeneratedContent({
            title: '',
            outline: [],
            content: {},
            currentGeneratingId: null
          })
          return 'content'
        default:
          return current
      }
    })
  }, [])

  const handlePreviousStep = React.useCallback(() => {
    setCurrentStep(current => {
      switch (current) {
        case 'outline':
          return 'settings'
        case 'content':
          setGeneratedContent({
            title: '',
            outline: [],
            content: {},
            currentGeneratingId: null
          })
          return 'outline'
        default:
          return current
      }
    })
  }, [])

  React.useEffect(() => {
    if (session?.user?.credits !== undefined) {
      setLocalCredits(session.user.credits)
    }
  }, [session?.user?.credits])

  const handleGenerateOutline = React.useCallback(async () => {
    if (!session?.user) {
      setError('Please log in to use this feature')
      return
    }

    setOutlineLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate outline')
      }

      const data = await response.json()
      setOutline(data.outline)
      handleNextStep()
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setOutlineLoading(false)
    }
  }, [session?.user, settings, handleNextStep])

  const handleGenerateContent = async (sectionId: string) => {
    if (!session?.user) {
      setError('Please log in to use this feature')
      return
    }

    if (currentGeneratingId) return

    setCurrentGeneratingId(sectionId)
    setError(null)

    try {
      const response = await fetch('/api/generate/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings,
          outline,
          sectionId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate content')
      }

      const data = await response.json()
      setGeneratedContent(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [sectionId]: data.content
        }
      }))
      setCreditsRemaining(data.creditsRemaining)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setCurrentGeneratingId(null)
    }
  }

  const currentStepComponent = React.useMemo(() => {
    switch (currentStep) {
      case 'settings':
        return (
          <SettingsStep
            settings={settings}
            onSettingsChange={setSettings}
            onNext={handleGenerateOutline}
          />
        )
      case 'outline':
        return (
          <OutlineStep
            outline={outline}
            onOutlineChange={setOutline}
            onBack={handlePreviousStep}
            onNext={handleNextStep}
            isLoading={outlineLoading}
          />
        )
      case 'content':
        return (
          <ContentStep
            outline={outline}
            generatedContent={generatedContent}
            onContentChange={setGeneratedContent}
            onBack={handlePreviousStep}
            onComplete={() => {/* Handle completion */}}
            currentGeneratingId={currentGeneratingId}
            onGenerateContent={handleGenerateContent}
            isGenerating={!!currentGeneratingId}
          />
        )
    }
  }, [
    currentStep,
    settings,
    outline,
    generatedContent,
    outlineLoading,
    currentGeneratingId,
    handleGenerateOutline,
    handleNextStep,
    handlePreviousStep
  ])

  return (
    <div className="h-full flex">
      <Card className="w-full">
        <CardContent className="p-6 h-full flex flex-col">
          <StepIndicator
            currentStep={STEPS.findIndex(step => step.title.toLowerCase() === currentStep)}
            steps={STEPS}
          />
          
          <div className="mt-8 flex-1">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {currentStepComponent}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
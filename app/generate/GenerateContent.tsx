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
import { useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'

const STEPS = [
  { title: 'Settings', description: 'Configure your content' },
  { title: 'Outline', description: 'Structure your content' },
  { title: 'Generate', description: 'Generate content' },
]

export default function GenerateContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const generationId = params?.id;
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
    currentGeneratingId: null,
    isLoading: false
  })

  // Add this function to ensure IDs are assigned
  const assignIds = (items: OutlineItem[], depth = 1): OutlineItem[] => {
    return items.map((item, index) => ({
      ...item,
      id: item.id || `${depth}-${index}-${Date.now()}`,
      subItems: item.subItems ? assignIds(item.subItems, depth + 1) : undefined
    }));
  };

  // Add this effect to load generation data when ID is present
  React.useEffect(() => {
    const loadGeneration = async () => {
      if (!generationId || !session?.user) return;

      try {
        const response = await fetch(`/api/generate/load/${generationId}`);
        if (!response.ok) throw new Error('Failed to load generation');
        
        const data = await response.json();
        setCurrentStep(data.currentStep);
        setSettings(data.settings);
        
        // Ensure outline items have IDs
        const outlineWithIds = data.outline ? assignIds(data.outline) : [];
        setOutline(outlineWithIds);
        
        // Parse the HTML content to extract sections
        if (data.content) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data.content, 'text/html');
          
          // Extract title
          const titleElement = doc.querySelector('h1');
          const title = titleElement?.textContent || '';

          // Create a map of section contents
          const contentMap: { [key: string]: string } = {};
          
          // Process each section
          outlineWithIds.forEach(item => {
            // Find the corresponding section in the HTML
            const section = doc.querySelector(`section:has(h2:contains("${item.title}"))`);
            if (section) {
              // Remove the h2 title and get the content
              const h2 = section.querySelector('h2');
              if (h2) h2.remove();
              contentMap[item.id] = section.innerHTML.trim();
            }
          });
          
          setGeneratedContent({
            title,
            outline: outlineWithIds,
            content: contentMap,
            currentGeneratingId: null,
            isLoading: false
          });
        } else {
          setGeneratedContent({
            title: '',
            outline: outlineWithIds,
            content: {},
            currentGeneratingId: null,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Error loading generation:', error);
        setError('Failed to load generation');
      }
    };

    loadGeneration();
  }, [generationId, session?.user]);

  const handleNextStep = React.useCallback(async () => {
    if (!generationId) return;

    setCurrentStep(current => {
      const nextStep = (() => {
        switch (current) {
          case 'settings':
            return 'outline'
          case 'outline':
            setGeneratedContent({
              title: '',
              outline: [],
              content: {},
              currentGeneratingId: null,
              isLoading: true
            })
            return 'content'
          default:
            return current
        }
      })();

      // Update step in database
      fetch(`/api/generate/save/${generationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          step: nextStep
        }),
      }).catch(error => {
        console.error('Failed to update step:', error);
      });

      return nextStep;
    });
  }, [generationId])

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
            currentGeneratingId: null,
            isLoading: true
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

  // Modify handleGenerateOutline to update URL after creating generation
  const handleGenerateOutline = React.useCallback(async () => {
    if (!session?.user) {
      setError('Please log in to use this feature')
      return
    }

    setOutlineLoading(true)
    setError(null)

    try {
      let currentGenerationId = generationId;

      // Only create new generation if we don't have one
      if (!currentGenerationId) {
        const saveResponse = await fetch('/api/generate/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            settings,
            step: 'settings'
          }),
        })

        if (!saveResponse.ok) {
          throw new Error('Failed to save generation')
        }

        const { generationId: newId } = await saveResponse.json()
        currentGenerationId = newId;
        
        // Update URL with generation ID
        router.push(`/generate/${newId}`);
      }

      // Generate the outline
      const response = await fetch('/api/generate/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          settings,
          generationId: currentGenerationId 
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate outline')
      }

      const data = await response.json()
      const outlineWithIds = assignIds(data.outline)
      
      // Update the generation with the outline
      await fetch(`/api/generate/save/${currentGenerationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          outline: outlineWithIds,
          step: 'outline'
        }),
      })

      // Set outline state first
      setOutline(outlineWithIds)
      
      // Wait for state update before moving to next step
      setTimeout(() => {
        handleNextStep()
      }, 0)

    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setOutlineLoading(false)
    }
  }, [session?.user, settings, handleNextStep, router, generationId])

  const handleGenerateContent = async (sectionId: string) => {
    if (!session?.user) {
      setError('Please log in to use this feature');
      return;
    }

    if (currentGeneratingId) return;

    setCurrentGeneratingId(sectionId);
    setError(null);

    try {
      const response = await fetch('/api/generate/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings,
          outline,
          sectionId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate content');
      }

      const data = await response.json();
      
      // Update local state
      setGeneratedContent(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [sectionId]: data.content,
        },
      }));

      // Format the entire content as HTML
      const allContent = formatContentAsHtml();

      // Save to database
      await fetch(`/api/generate/save/${generationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: allContent
        }),
      });

      setCreditsRemaining(data.creditsRemaining);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setCurrentGeneratingId(null);
    }
  };

  // Add this helper function to format content as HTML
  const formatContentAsHtml = () => {
    const formattedContent = outline.map(item => {
      const content = generatedContent.content[item.id] || '';
      return `
        <section>
          <h2>${item.title}</h2>
          ${content}
          ${item.subItems?.map(subItem => `
            <section>
              <h3>${subItem.title}</h3>
              ${generatedContent.content[subItem.id] || ''}
            </section>
          `).join('') || ''}
        </section>
      `;
    }).join('');

    return `
      <article>
        <h1>${generatedContent.title || 'Untitled'}</h1>
        ${formattedContent}
      </article>
    `;
  };

  // Modify handleNextStep to clear progress on completion
  const handleComplete = useCallback(() => {
    // Add your completion logic here
  }, []);

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
            onComplete={handleComplete}
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
    handlePreviousStep,
    handleComplete
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
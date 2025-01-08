"use client";

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Clipboard, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSession } from "next-auth/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

export default function DetectorContent() {
  const { data: session } = useSession();
  const [inputText, setInputText] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<{
    humanScore: number;
    aiScore: number;
  } | null>(null)

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error("Error pasting:", err);
      setError('Unable to paste. Please try copying and pasting manually.');
    }
  }

  const handleDetect = async () => {
    if (isLoading) return;
    
    if (!session?.user) {
      setError('Please log in to use this feature');
      return;
    }

    const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
    
    if (!inputText || inputText.length < 100) {
      setError('Text must be at least 100 characters');
      return;
    }

    if (wordCount > 4000) {
      setError('Text cannot exceed 4000 words');
      return;
    }

    setError(null);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze text');
      }

      const data = await response.json();
      setResult({
        humanScore: data.humanScore,
        aiScore: data.aiScore
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-full flex">
      <Card className="w-full">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex flex-col flex-1 space-y-6">
            <div className="grid gap-4 md:grid-cols-4 flex-1 min-h-0">
              <div className="flex flex-col space-y-2 md:col-span-3">
                <label className="text-sm font-medium">
                  Input Text <span className="text-muted-foreground">({inputText.length} chars, {inputText.trim().split(/\s+/).filter(Boolean).length}/4000 words)</span>
                </label>
                <div className="relative flex-1 min-h-[300px]">
                  <ScrollArea className="h-full absolute inset-0">
                    <Textarea 
                      placeholder="Insert text to analyze..." 
                      className="w-full min-h-[500px] border-0 focus-visible:ring-0 resize-none text-md"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={isLoading}
                    />
                  </ScrollArea>
                  {!inputText && (
                    <Button 
                      variant="outline" 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-1/2" 
                      onClick={handlePaste}
                      disabled={isLoading}
                    >
                      <Clipboard className="w-4 h-4 mr-2" />
                      Click here to paste text
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Analysis Results</label>
                <div className="flex-1 flex flex-col justify-center items-center gap-8 p-8">
                  {result && (
                    <>
                      <div className="text-center">
                        <div className="text-6xl font-bold mb-2">{result.humanScore}%</div>
                        <div className="text-xl text-muted-foreground">Human</div>
                      </div>
                      <div className="w-full space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Human-written</span>
                            <span>{result.humanScore}%</span>
                          </div>
                          <Progress value={result.humanScore} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>AI-generated</span>
                            <span>{result.aiScore}%</span>
                          </div>
                          <Progress value={result.aiScore} className="bg-red-200" />
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground text-center mt-auto">
                        <p className="mb-1">Note: Results are not 100% reliable. AI detection technology has inherent limitations.</p>
                        <p>Best accuracy with English text. Other languages may have reduced accuracy.</p>
                      </div>
                    </>
                  )}
                  {!result && !isLoading && (
                    <div className="text-center text-muted-foreground">
                      Analysis results will appear here
                    </div>
                  )}
                  {isLoading && (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span>Analyzing text...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                onClick={handleDetect} 
                className="text-md w-full h-16 text-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Text'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
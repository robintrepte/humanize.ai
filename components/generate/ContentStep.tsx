import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { OutlineItem, GeneratedContent } from '@/types/generate'
import { Loader2, Check } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import React from 'react'

interface ContentStepProps {
  outline: OutlineItem[];
  generatedContent: GeneratedContent;
  onContentChange: (content: GeneratedContent | ((prev: GeneratedContent) => GeneratedContent)) => void;
  onBack: () => void;
  onComplete: () => void;
  isGenerating: boolean;
  currentGeneratingId: string | null;
  onGenerateContent: (sectionId: string) => Promise<void>;
}

export function ContentStep({
  outline,
  generatedContent,
  onContentChange,
  onBack,
  onComplete,
  isGenerating,
  currentGeneratingId,
  onGenerateContent
}: ContentStepProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSections = outline.reduce((count, item) => {
    return count + 1 + (item.subItems?.length || 0)
  }, 0)

  const completedSections = Object.keys(generatedContent.content || {}).length
  const progress = (completedSections / totalSections) * 100

  const getAllItems = (items: OutlineItem[], parentTitle?: string, depth = 1): OutlineItem[] => {
    return items.reduce((acc: OutlineItem[], item, index) => {
      const itemWithParent = {
        ...item,
        id: item.id || `${depth}-${index}-${Date.now()}`,
        parentTitle,
        depth
      };
      
      acc.push(itemWithParent);
      
      if (item.subItems?.length) {
        acc.push(...getAllItems(item.subItems, item.title, depth + 1));
      }
      return acc;
    }, []);
  };

  const allItems = useMemo(() => getAllItems(outline), [outline]);

  const getPreviousContent = (currentItem: OutlineItem, allItems: OutlineItem[], generatedContent: GeneratedContent) => {
    const currentIndex = allItems.findIndex(item => item.id === currentItem.id);
    const previousItems = allItems.slice(0, currentIndex);
    
    if (currentItem.parentTitle) {
      const parentItem = allItems.find(item => item.title === currentItem.parentTitle);
      if (parentItem && generatedContent.content[parentItem.id]) {
        return generatedContent.content[parentItem.id];
      }
    }
    
    const previousSiblings = previousItems.filter(item => item.depth === currentItem.depth);
    return previousSiblings
      .map(item => generatedContent.content[item.id])
      .filter(Boolean)
      .join('\n\n');
  };

  const generateContent = useCallback(async (itemId: string) => {
    if (currentGeneratingId || generatedContent.content[itemId]) {
      return;
    }
    
    const currentItem = allItems.find(item => item.id === itemId);
    if (!currentItem) return;

    try {
      onContentChange({
        ...generatedContent,
        currentGeneratingId: itemId
      });

      const requestBody = {
        title: currentItem.title,
        parentTitle: currentItem.parentTitle,
        depth: currentItem.depth || 1,
        previousContent: getPreviousContent(currentItem, allItems, generatedContent),
        outline: allItems.map(item => ({
          ...item,
          content: generatedContent.content[item.id] || null
        }))
      };

      const response = await fetch('/api/generate/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const { content } = await response.json();

      onContentChange((prev: GeneratedContent) => {
        return {
          ...prev,
          currentGeneratingId: null,
          content: {
            ...prev.content,
            [itemId]: content
          }
        };
      });

    } catch (error) {
      console.error(`Error generating content for section: ${currentItem.title}`, error);
      onContentChange((prev: GeneratedContent) => ({
        ...prev,
        currentGeneratingId: null
      }));
    }
  }, [allItems, currentGeneratingId, generatedContent, onContentChange]);

  useEffect(() => {
    const generateNextContent = async () => {
      if (currentGeneratingId || progress >= 100) return;

      const hasExistingContent = Object.keys(generatedContent.content || {}).length > 0;
      
      if (hasExistingContent && Object.keys(generatedContent.content).length === allItems.length) {
        return;
      }

      const nextItem = allItems.find(item => !generatedContent.content[item.id]);
      if (nextItem) {
        await onGenerateContent(nextItem.id);
      }
    };

    if (allItems.length > 0 && !isGenerating) {
      generateNextContent();
    }
  }, [allItems, progress, isGenerating, generatedContent.content, onGenerateContent, currentGeneratingId]);

  const formatContent = (items: OutlineItem[], depth = 1): string => {
    return items.map(item => {
      const headerStyle = `font-bold ${
        depth === 1 ? 'text-2xl mb-4' :
        depth === 2 ? 'text-xl mb-3' :
        'text-lg mb-2'
      }`;
      
      let content = `<div class="${headerStyle}">${item.title}</div>\n\n`;
      
      if (item.id && generatedContent.content[item.id]) {
        content += `<div class="mb-6">${generatedContent.content[item.id]}</div>\n\n`;
      } else if (currentGeneratingId === item.id) {
        content += `<div class="mb-6 text-muted-foreground">Generating content...</div>\n\n`;
      } else {
        content += `<div class="mb-6 text-muted-foreground">Waiting to generate content...</div>\n\n`;
      }

      if (item.subItems?.length) {
        content += formatContent(item.subItems, depth + 1);
      }

      return content;
    }).join('\n');
  };

  const formattedContent = useMemo(
    () => formatContent(outline),
    [outline, generatedContent.content, currentGeneratingId, formatContent]
  );

  const handleBack = () => {
    if (progress > 0) {
      if (window.confirm('Going back will save your progress. You can return to continue where you left off. Continue?')) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  const handleComplete = () => {
    if (window.confirm('Completing will clear your progress. Are you sure you want to finish?')) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Generation Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <ScrollArea className="h-[500px] border rounded-md p-4">
        <div 
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      </ScrollArea>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isGenerating}
        >
          Back
        </Button>
        <Button
          onClick={handleComplete}
          disabled={isGenerating || progress < 100}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : progress < 100 ? (
            'Complete'
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Complete
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 
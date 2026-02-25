"use client"

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OutlineItem } from '@/types/generate'
import { Loader2, Plus, Minus, GripVertical, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import React from 'react'

interface OutlineStepProps {
  outline: OutlineItem[];
  onOutlineChange: (outline: OutlineItem[]) => void;
  onBack: () => void;
  onNext: () => void;
  isLoading: boolean;
}

export function OutlineStep({ outline, onOutlineChange, onBack, onNext, isLoading }: OutlineStepProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = useCallback((id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }, [])

  const addItem = useCallback((parentId?: string) => {
    const newItem: OutlineItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      depth: parentId ? 1 : 0,
      parentTitle: parentId ? outline.find(item => item.id === parentId)?.title || '' : ''
    }

    if (!parentId) {
      onOutlineChange([...outline, newItem]);
      return;
    }

    const updateItems = (items: OutlineItem[]): OutlineItem[] => {
      return items.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            subItems: [...(item.subItems || []), newItem]
          }
        }
        if (item.subItems) {
          return {
            ...item,
            subItems: updateItems(item.subItems)
          }
        }
        return item
      })
    }

    onOutlineChange(updateItems(outline))
  }, [outline, onOutlineChange])

  const updateItemTitle = useCallback((id: string, title: string) => {
    const updateItems = (items: OutlineItem[]): OutlineItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, title }
        }
        if (item.subItems) {
          return {
            ...item,
            subItems: updateItems(item.subItems)
          }
        }
        return item
      })
    }

    onOutlineChange(updateItems(outline))
  }, [outline, onOutlineChange])

  const removeItem = useCallback((id: string) => {
    const filterItems = (items: OutlineItem[]): OutlineItem[] => {
      return items
        .filter(item => item.id !== id)
        .map(item => ({
          ...item,
          subItems: item.subItems ? filterItems(item.subItems) : undefined
        }))
    }

    onOutlineChange(filterItems(outline))
  }, [outline, onOutlineChange])

  const renderOutlineItem = useCallback((item: OutlineItem, depth = 0) => {
    const isExpanded = expandedItems.includes(item.id)

    return (
      <div key={item.id} className="space-y-2">
        <div className={cn(
          "flex items-center gap-2",
          depth > 0 && "ml-6"
        )}>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          {item.subItems && (
            <button
              onClick={() => toggleExpand(item.id)}
              className="p-1 hover:bg-accent rounded-sm"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          <Input
            value={item.title}
            onChange={(e) => updateItemTitle(item.id, e.target.value)}
            placeholder="Section title..."
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => addItem(item.id)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.id)}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
        {item.subItems && isExpanded && (
          <div className="space-y-2">
            {item.subItems.map(subItem => (
              <div key={subItem.id}>
                {renderOutlineItem(subItem, depth + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }, [expandedItems, addItem, removeItem, updateItemTitle, toggleExpand])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {outline.map((item, index) => (
          <React.Fragment key={item.id || index}>
            {renderOutlineItem(item, 0)}
          </React.Fragment>
        ))}
      </div>
      
      <Button
        variant="outline"
        onClick={() => addItem()}
        className="w-full"
      >
        Add Section
      </Button>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={isLoading || outline.length === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Outline...
            </>
          ) : (
            'Next Step'
          )}
        </Button>
      </div>
    </div>
  )
} 
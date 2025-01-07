"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { MessageCircle } from "lucide-react"

interface HelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Tips for best results</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <span>Input 1-3 paragraphs at a time.</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <span>Give the exact text you want to rewrite.</span>
            </div>
            <div className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-500 mt-0.5" />
              <span>Do not include titles or headers.</span>
            </div>
            <div className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-500 mt-0.5" />
              <span>Do not input questions or prompts.</span>
            </div>
            <div className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-500 mt-0.5" />
              <span>Do not input random characters.</span>
            </div>
          </div>

          {/* <div className="space-y-2">
            <h3 className="text-xl font-semibold">Video walkthrough</h3>
            <div className="aspect-video w-full bg-black rounded-lg">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/your-video-id"
                title="twainGPT Walkthrough"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div> */}

          <div className="flex justify-center pt-2">
            <Button className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
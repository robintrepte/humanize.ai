"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface PricingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PricingDialog({ open, onOpenChange }: PricingDialogProps) {
  const handlePurchase = (plan: string) => {
    // TODO: Implement purchase logic
    console.log(`Purchasing ${plan} plan`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Pricing</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Basic Plan */}
          <div className="rounded-lg border p-6 space-y-4">
            <h3 className="text-xl font-semibold">Basic</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">$10</span>
              <span className="text-muted-foreground ml-1">/ mo</span>
            </div>
            <p className="text-lg">8,000 Credits</p>
            <Button 
              className="w-full" 
              onClick={() => handlePurchase('basic')}
            >
              Purchase
            </Button>
            <div className="pt-4">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>6,000 words</span>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="rounded-lg border p-6 space-y-4">
            <h3 className="text-xl font-semibold">Premium</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">$25</span>
              <span className="text-muted-foreground ml-1">/ mo</span>
            </div>
            <p className="text-lg">30,000 Credits</p>
            <Button 
              className="w-full" 
              onClick={() => handlePurchase('premium')}
            >
              Purchase
            </Button>
            <div className="pt-4">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>22,500 words</span>
              </div>
            </div>
          </div>

          {/* Ultimate Plan */}
          <div className="rounded-lg border p-6 space-y-4">
            <h3 className="text-xl font-semibold">Ultimate</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">$50</span>
              <span className="text-muted-foreground ml-1">/ mo</span>
            </div>
            <p className="text-lg text-blue-500">Unlimited Credits *</p>
            <Button 
              className="w-full" 
              onClick={() => handlePurchase('ultimate')}
            >
              Purchase
            </Button>
            <div className="pt-4">
              <div className="text-sm text-muted-foreground">
                * Usage is capped at 100,000 credits per week
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
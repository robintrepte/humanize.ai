"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useToast } from "@/components/hooks/use-toast"
import { useEffect, useState } from "react"
import { Plan } from "@prisma/client"

interface PricingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PricingDialog({ open, onOpenChange }: PricingDialogProps) {
  const { toast } = useToast()
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans')
        const data = await response.json()
        if (data.plans) {
          setPlans(data.plans)
        }
      } catch (error) {
        console.error('Error fetching plans:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load pricing plans.",
        })
      }
    }

    if (open) {
      fetchPlans()
    }
  }, [open, toast])

  const handleSubscribe = async (plan: Plan) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: plan.name }),
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      if (!data.checkoutUrl) {
        throw new Error('No checkout URL received from server')
      }

      window.location.href = data.checkoutUrl
    } catch (error) {
      console.error('Subscribe error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to initiate subscription. Please try again.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Pricing</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-lg border p-6 space-y-4">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground ml-1">/ mo</span>
              </div>
              <p className="text-lg">
                {plan.credits === -1 ? (
                  <span className="text-blue-500">Unlimited Credits *</span>
                ) : (
                  `${plan.credits.toLocaleString()} Credits`
                )}
              </p>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe(plan)}
              >
                Subscribe
              </Button>
              <div className="pt-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.credits === -1 && (
                  <div className="text-sm text-muted-foreground mt-2">
                    * Usage is capped at 100,000 credits per week
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 
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
import { PricingCard } from "@/components/PricingCard"

interface PricingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlan: Plan | null
}

export function PricingDialog({ open, onOpenChange, currentPlan }: PricingDialogProps) {
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
            <PricingCard
              key={plan.id}
              title={plan.name}
              price={`$${plan.price}`}
              features={plan.features}
              description={plan.description}
              popular={plan.isPopular}
              credits={plan.credits}
              currentPlan={currentPlan ? { title: currentPlan.name, price: `$${currentPlan.price}` } : undefined}
              onOpenChange={onOpenChange}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 
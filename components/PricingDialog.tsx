"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from "@/components/hooks/use-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PricingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PricingDialog({ open, onOpenChange }: PricingDialogProps) {
  const { toast } = useToast();

  const handlePurchase = async (plan: string) => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();
      
      if (!data.sessionId) {
        throw new Error('No session ID received from server');
      }

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error.message,
        });
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate purchase. Please try again.",
      });
    }
  };

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
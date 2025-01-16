"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export default function SubscriptionContent({ user, subscription, error }: any) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Warning",
        description: error,
      });
    }
  }, [error, toast]);

  if (!user) {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Unable to load subscription information. Please try again later.</p>
            <Button onClick={() => router.push('/humanize')} className="mt-4">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.subscriptionStatus !== "active" && user.subscriptionStatus !== "canceled_end_period") {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>You currently don't have an active subscription.</p>
            <Button onClick={() => router.push('/humanize')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    setLocalError(null);
    
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      toast({
        title: "Success",
        description: "Your subscription has been cancelled",
      });

      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to cancel subscription";
      setLocalError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {localError && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-4">
              <p>{localError}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="font-semibold">Current Plan</h3>
            <p className="text-2xl font-bold">{user.plan?.name || 'Unknown Plan'}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Status</h3>
            <p className="capitalize">
              {subscription?.status === 'canceled' || user.subscriptionStatus === 'canceled_end_period' 
                ? 'Canceled' 
                : subscription?.status || user.subscriptionStatus}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">
              {subscription?.status === 'canceled' || user.subscriptionStatus === 'canceled_end_period'
                ? 'Active Until'
                : 'Next Payment'}
            </h3>
            <p>
              {user.currentPeriodEnd 
                ? new Date(user.currentPeriodEnd).toLocaleDateString() 
                : 'Not available'}
            </p>
          </div>

          {error && (
            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="pt-4">
            {subscription?.status === 'canceled' || user.subscriptionStatus === 'canceled_end_period' ? (
              <Button 
                onClick={() => router.push('/humanize')} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Renew Subscription'
                )}
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      'Cancel Subscription'
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will cancel your subscription at the end of your current billing period.
                      You will still have access to your subscription benefits until then.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelSubscription}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Cancel Subscription
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
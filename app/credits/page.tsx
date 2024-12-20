"use client";

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from 'next/navigation';

export default function CreditsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreditsContent />
    </Suspense>
  );
}

function CreditsContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('success')) {
      toast({
        title: "Payment successful",
        description: "Your credits have been added to your account.",
      });
      router.push('/humanize');
    }

    if (searchParams.get('canceled')) {
      toast({
        variant: "destructive",
        title: "Payment canceled",
        description: "Your payment was canceled.",
      });
      router.push('/humanize');
    }
  }, [searchParams, toast, router]);

  return null;
} 
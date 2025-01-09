import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section id="hero" className="relative flex w-full flex-col items-center justify-start px-4 pt-32 sm:px-6 sm:pt-24 md:pt-32 lg:px-8">
      <div className="flex w-full max-w-2xl flex-col space-y-4 overflow-hidden pt-8">
        <h1 className="text-center text-4xl font-medium leading-tight sm:text-5xl md:text-6xl">
          <span className="inline-block px-1 md:px-2 text-balance font-semibold">Humanize</span>
          <span className="inline-block px-1 md:px-2 text-balance font-semibold">your</span>
          <span className="inline-block px-1 md:px-2 text-balance font-semibold">writing.</span>
        </h1>
        <p className="mx-auto max-w-xl text-center text-lg leading-7 text-muted-foreground sm:text-xl sm:leading-9 text-balance">
          Our humanizer transforms any AI-generated text into expressive human-like content. Bypass any AI detector.
        </p>
      </div>
      <div className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Button asChild size="lg">
          <Link href="/register">Get started for free</Link>
        </Button>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">
        250 free credits. No credit card required.
      </p>
      <div className="relative mx-auto mt-24 h-full w-full max-w-[768px] rounded-xl border shadow-2xl">
        <div className="absolute inset-0 bottom-1/2 h-full w-full transform-gpu [filter:blur(120px)] [background-image:linear-gradient(to_bottom,#93c5fd,transparent_30%)] dark:[background-image:linear-gradient(to_bottom,#ffffff,transparent_30%)]"></div>
        <Image
          src="/images/placeholder.svg?height=400&width=768"
          width={768}
          height={400}
          className="relative h-full w-full rounded-xl"
          alt="Humanizer by 21AI dashboard"
          unoptimized
        />
      </div>
    </section>
  )
} 
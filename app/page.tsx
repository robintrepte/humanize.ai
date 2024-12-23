'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PencilLine, Send, NotebookPen, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-50 py-2 bg-background/60 backdrop-blur">
      <div className="flex justify-between items-center container px-4 md:px-6">
        <Link href="/" className="text-xl font-bold">
          Humanizer by 21AI
        </Link>
        <div className="flex items-center">
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
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

function Features() {
  return (
    <section id="built-for-everyone" className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center space-y-4 pb-6 mx-auto">
          <h2 className="text-sm text-primary font-mono font-medium tracking-wider uppercase">BUILT FOR EVERYONE</h2>
          <h3 className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">Humanize any AI-generated text</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <FeatureCard
            icon={<PencilLine className="w-6 h-6 text-primary" />}
            title="Writers"
            description="Transform AI text and drafts into high quality writing, speeding up workflows and giving peace of mind knowing the content is original."
          />
          <FeatureCard
            icon={<Send className="w-6 h-6 text-primary" />}
            title="Marketers"
            description="Prevent being flagged as AI-generated, low quality, or spam when posting to social media platforms or sending marketing emails."
          />
          <FeatureCard
            icon={<NotebookPen className="w-6 h-6 text-primary" />}
            title="Bloggers"
            description="Enhance bland AI text into engaging and readable content that won't get flagged by Google as low quality AI-generated content."
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-6 space-y-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const testimonials = [
    { 
      quote: "Humanizer by 21AI has transformed our content workflow. The humanized text reads naturally and consistently passes AI detection.", 
      author: "Sarah Chen", 
      source: "Marketing Director" 
    },
    { 
      quote: "As a content creator, this tool is invaluable. It helps maintain authenticity while leveraging AI for efficiency.", 
      author: "Michael Rodriguez", 
      source: "Content Strategist" 
    },
    { 
      quote: "The quality of humanization is remarkable. It's become an essential part of our writing process.", 
      author: "Emma Thompson", 
      source: "Editor-in-Chief" 
    },
    { 
      quote: "Finally, a solution that delivers on its promise. The transformed content maintains its meaning while reading naturally.", 
      author: "David Park", 
      source: "Digital Publisher" 
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonial-highlight" className="py-16 bg-secondary">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center space-y-4 pb-6 mx-auto">
          <h2 className="text-sm text-primary font-mono font-medium tracking-wider uppercase">Testimonial Highlight</h2>
          <h3 className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">What our customers are saying</h3>
        </div>
        <div className="max-w-2xl mx-auto relative">
          <button onClick={prevTestimonial} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-background rounded-full p-2 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="p-2 pb-5">
            <div className="text-center">
              <svg className="text-4xl text-muted-foreground my-4 mx-auto" viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
                <path d="M18.62 18h-5.24l2-4H13V6h8v7.24L18.62 18zm-2-2h.76L19 12.76V8h-4v4h3.62l-2 4zm-8 2H3.38l2-4H3V6h8v7.24L8.62 18zm-2-2h.76L9 12.76V8H5v4h3.62l-2 4z" />
              </svg>
              <h4 className="text-xl font-semibold max-w-lg mx-auto px-10">{testimonials[currentTestimonial].quote}</h4>
              <h4 className="text-xl font-semibold my-2">{testimonials[currentTestimonial].author}</h4>
              <div className="mb-3">
                <span className="text-sm text-muted-foreground">{testimonials[currentTestimonial].source}</span>
              </div>
            </div>
          </div>
          <button onClick={nextTestimonial} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-background rounded-full p-2 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center space-y-4 pb-6 mx-auto">
          <h2 className="text-sm text-primary font-mono font-medium tracking-wider uppercase">Pricing</h2>
          <h3 className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">Choose the plan that&apos;s right for you</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 sm:2 gap-4">
          <PricingCard
            title="BASIC"
            price="$10"
            features={[
              "8,000 credits",
              "~6,000 words",
              "Standard Support"
            ]}
            description="Perfect for small text and limited usage"
          />
          <PricingCard
            title="PREMIUM"
            price="$25"
            features={[
              "30,000 credits",
              "~22,500 words",
              "Priority Support"
            ]}
            description="Ideal for essays and blogs"
            popular
          />
          <PricingCard
            title="ULTIMATE"
            price="$50"
            features={[
              "Unlimited Credits*",
              "Unlimited words*",
              "Priority Support"
            ]}
            description="For large-scale operations and high-volume users"
            footnote="* Usage is capped at 100,000 words per week."
          />
        </div>
      </div>
    </section>
  )
}

function PricingCard({ title, price, features, description, popular, footnote }: {
  title: string;
  price: string;
  features: string[];
  description: string;
  popular?: boolean;
  footnote?: string;
}) {
  return (
    <Card className={`relative ${popular ? 'border-primary border-2 z-10' : 'z-0'}`}>
      <CardHeader>
        <p className="text-base font-semibold text-muted-foreground">{title}</p>
        <p className="mt-6 flex items-center justify-center gap-x-2">
          <span className="text-5xl font-bold tracking-tight">{price}</span>
          <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">/ month</span>
        </p>
      </CardHeader>
      <CardContent>
        <ul className="mt-5 gap-2 flex flex-col">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button asChild className="w-full" variant={popular ? "default" : "secondary"}>
          <Link href="/register">Subscribe</Link>
        </Button>
        <p className="text-xs leading-5 text-muted-foreground">{description}</p>
        {footnote && <p className="text-xs leading-5 text-muted-foreground">{footnote}</p>}
      </CardFooter>
    </Card>
  )
}

function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    if (openItem === index) {
      setOpenItem(null);
    } else {
      setOpenItem(index);
    }
  };

  const faqItems = [
    {
      question: "What exactly is Humanizer by 21AI?",
      answer: "Humanizer by 21AI is your secret weapon for creating authentic, human-like content. Our advanced AI technology transforms machine-generated text into natural, flowing writing that's indistinguishable from human-written content. Whether you're a content creator, marketer, or business professional, our tool ensures your writing maintains that essential human touch."
    },
    {
      question: "How effective is Humanizer against AI detection?",
      answer: "Extremely effective! Our tool consistently bypasses all major AI detection systems including GPTZero, ZeroGPT, Copyleaks, Grammarly, Turnitin, and more. We're constantly updating our technology to stay ahead of new detection methods, ensuring your content remains undetectable. Our success rate is one of the highest in the industry."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide comprehensive support through multiple channels! You can reach us via email at support@twentyfirst.ai, join our active Discord community for real-time assistance, or use our website's support system. Our dedicated team typically responds within hours, and we're committed to ensuring your success with our platform."
    },
    {
      question: "Is using Humanizer ethical?",
      answer: "Absolutely! Humanizer by 21AI is designed to enhance genuine content creation, not to deceive. Think of it as a sophisticated writing assistant that helps you express your ideas more naturally. We encourage using our tool responsibly to improve communication while maintaining authenticity and originality. Our goal is to help you create better, more engaging content while upholding ethical standards."
    },
    {
      question: "What's your guarantee on AI detection?",
      answer: "We stand behind our product with confidence! While our success rate is exceptionally high, we understand the importance of reliability. If your humanized text is flagged by AI detection tools after using our service (including the free retry), simply contact our support team. We'll analyze the case and can offer a credit refund for that specific text. Your satisfaction and success are our top priorities."
    }
  ];

  return (
    <section id="faq" className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center space-y-4 pb-6 mx-auto">
          <h2 className="text-sm text-primary font-mono font-medium tracking-wider uppercase">FAQ</h2>
          <h3 className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">Got questions? We&apos;ve got answers</h3>
        </div>
        <div className="mx-auto my-12 md:max-w-[800px]">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b border-muted">
              <button
                className="flex justify-between items-center w-full py-4 text-left"
                onClick={() => toggleItem(index)}
              >
                <span className="font-medium">{item.question}</span>
                <svg
                  className={`w-6 h-6 transition-transform ${openItem === index ? 'transform rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openItem === index && (
                <div className="pb-4 text-muted-foreground">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <h4 className="mb-12 text-center text-sm font-medium tracking-tight text-muted-foreground">
          Still have questions? We&apos;re here to help! Email us at <a href="mailto:support@twentyfirst.ai" className="underline hover:text-primary transition-colors">support@twentyfirst.ai</a>
        </h4>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to humanize your AI-generated content?</h2>
        <p className="text-xl mb-8">Start transforming your text today with our powerful AI humanizer.</p>
        <Button asChild variant="secondary" size="lg">
          <Link href="/register">Get Started for Free</Link>
        </Button>
        <p className="mt-4 text-sm">No credit card required. 250 free credits.</p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold">
              Humanizer by 21AI
            </Link>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end gap-4">
            <Link href="/imprint" className="text-sm text-muted-foreground hover:text-foreground">
              Imprint
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact Us
            </Link>
          </nav>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} <Link href="https://twentyfirst.media/" className="underline">Twentyfirst Media Group</Link>. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
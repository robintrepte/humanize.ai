"use client"

import { useState } from 'react'

export function Testimonials() {
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
          <h2 className="mx-auto max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
            <span className="block text-sm text-primary font-mono font-medium tracking-wider uppercase mb-2">Testimonial highlight</span>
            What our customers are saying
          </h2>
        </div>
        <div className="max-w-2xl mx-auto relative" role="region" aria-label="Customer testimonials carousel">
          <button
            type="button"
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-background rounded-full p-2 shadow-md border border-border hover:bg-muted"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="p-2 pb-5">
            <blockquote className="text-center">
              <svg className="text-4xl text-muted-foreground my-4 mx-auto" viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" aria-hidden>
                <path d="M18.62 18h-5.24l2-4H13V6h8v7.24L18.62 18zm-2-2h.76L19 12.76V8h-4v4h3.62l-2 4zm-8 2H3.38l2-4H3V6h8v7.24L8.62 18zm-2-2h.76L9 12.76V8H5v4h3.62l-2 4z" />
              </svg>
              <p className="text-xl font-semibold max-w-lg mx-auto px-10">{testimonials[currentTestimonial].quote}</p>
              <footer className="mt-2">
                <cite className="text-xl font-semibold not-italic">{testimonials[currentTestimonial].author}</cite>
                <span className="block text-sm text-muted-foreground">{testimonials[currentTestimonial].source}</span>
              </footer>
            </blockquote>
          </div>
          <button
            type="button"
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-background rounded-full p-2 shadow-md border border-border hover:bg-muted"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
} 
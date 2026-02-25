"use client"

import { useState } from 'react'
import { faqItems } from '@/lib/landing-content'

export function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index)
  }

  return (
    <section id="faq" className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center space-y-4 pb-6 mx-auto">
          <h2 className="mx-auto max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
            <span className="block text-sm text-primary font-mono font-medium tracking-wider uppercase mb-2">FAQ</span>
            Got questions? We&apos;ve got answers
          </h2>
        </div>
        <dl className="mx-auto my-12 md:max-w-[800px] divide-y divide-border">
          {faqItems.map((item, index) => {
            const id = `faq-answer-${index}`;
            const isOpen = openItem === index;
            return (
              <div key={index}>
                <dt>
                  <button
                    type="button"
                    className="flex justify-between items-center w-full py-4 text-left font-medium text-foreground hover:text-muted-foreground transition-colors"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    aria-controls={id}
                  >
                    {item.question}
                    <svg
                      className={`w-6 h-6 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </dt>
                <dd id={id} className="pb-4 text-muted-foreground" hidden={!isOpen}>
                  <p>{item.answer}</p>
                </dd>
              </div>
            );
          })}
        </dl>
        <h4 className="mb-12 text-center text-sm font-medium tracking-tight text-muted-foreground">
          Still have questions? We&apos;re here to help! Email us at <a href="mailto:support@twentyfirst.ai" className="underline hover:text-primary transition-colors">support@twentyfirst.ai</a>
        </h4>
      </div>
    </section>
  )
} 
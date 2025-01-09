"use client"

import { useState } from 'react'

export function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index)
  }

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
      answer: "Absolutely! Humanizer by 21AI is designed to enhance genuine content creation, not to deceive. Think of it as a sophisticated writing assistant that helps you express your ideas more naturally. We encourage using our tool responsibly to improve communication while maintaining authenticity and originality."
    },
    {
      question: "What's your guarantee on AI detection?",
      answer: "We stand behind our product with confidence! While our success rate is exceptionally high, we understand the importance of reliability. If your humanized text is flagged by AI detection tools after using our service (including the free retry), simply contact our support team. We'll analyze the case and can offer a credit refund for that specific text."
    }
  ]

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
  )
} 
import { getPricingPlans } from '@/lib/pricing'
import { PricingCard } from '../PricingCard'

export async function Pricing() {
  const plans = await getPricingPlans()

  return (
    <section id="pricing" className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center space-y-4 pb-6 mx-auto">
          <h2 className="mx-auto max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
            <span className="block text-sm text-primary font-mono font-medium tracking-wider uppercase mb-2">Pricing</span>
            Choose the plan that&apos;s right for you
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 sm:2 gap-4">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              title={plan.name}
              price={`$${plan.price}`}
              features={plan.features}
              description={plan.description}
              popular={plan.isPopular}
              credits={plan.credits}
              onOpenChange={() => {}}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 
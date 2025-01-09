import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

interface PricingCardProps {
  title: string
  price: string
  features: string[]
  description: string
  popular?: boolean
  credits?: number
}

export function PricingCard({
  title,
  price,
  features,
  description,
  popular = false,
  credits
}: PricingCardProps) {
  return (
    <Card className={popular ? 'border-primary' : ''}>
      <CardHeader>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="flex items-baseline text-gray-900">
          <span className="text-5xl font-bold tracking-tight">{price}</span>
          <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">/ month</span>
        </p>
        <p className="text-lg">
          {credits === -1 ? (
            <span className="text-blue-500">Unlimited Credits *</span>
          ) : (
            `${credits?.toLocaleString()} Credits`
          )}
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
          {credits === -1 && (
            <li className="text-sm text-muted-foreground mt-2">
              * Usage is capped at 100,000 credits per week
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button asChild className="w-full" variant={popular ? "default" : "secondary"}>
          <Link href="/register">Subscribe</Link>
        </Button>
        <p className="text-xs leading-5 text-muted-foreground">{description}</p>
      </CardFooter>
    </Card>
  )
} 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Check, Gem } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface PricingCardProps {
  title: string
  price: string
  features: string[]
  description: string
  popular?: boolean
  credits?: number
  currentPlan?: {
    title: string
    price: string
  }
  onOpenChange: (open: boolean) => void
}

export function PricingCard({
  title,
  price,
  features,
  description,
  popular = false,
  credits,
  currentPlan,
  onOpenChange
}: PricingCardProps) {
  let buttonText = "Subscribe";
  const isCurrentPlan = currentPlan && title === currentPlan.title;

  console.log("Current Plan:", currentPlan);
  console.log("Title:", title);
  console.log("Price:", price);

  if (currentPlan) {
    if (isCurrentPlan) {
      buttonText = "Manage Plan";
    } else if (parseFloat(price.replace('$', '')) > parseFloat(currentPlan.price.replace('$', ''))) {
      buttonText = "Upgrade";
    } else {
      buttonText = "Downgrade";
    }
  }

  return (
    <Card className={`${popular ? 'border-primary' : ''} ${isCurrentPlan ? 'border-green-500' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{title}</h3>
          {isCurrentPlan && (
            <Badge variant="outline" className="bg-green-500 text-white">Active</Badge>
          )}
        </div>
        <p className="text-s leading-5 text-muted-foreground pb-4">{description}</p>
        <p className="flex items-baseline text-foreground pb-4">
          <span className="text-5xl font-bold tracking-tight">{price}</span>
          <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">/ month</span>
        </p>
        <Button asChild className="w-full mt-4" variant={popular ? "default" : "secondary"}>
          {buttonText === "Manage Plan" ? (
            <Link href="/subscription" onClick={() => onOpenChange(false)}>
              {buttonText}
            </Link>
          ) : (
            <Link href="/register">{buttonText}</Link>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-lg flex items-center mb-4">
          <Gem className="mr-2 h-4 w-4 text-primary" />
          {credits === -1 ? (
            <span className="text-blue-500">Unlimited Credits *</span>
          ) : (
            `${credits?.toLocaleString()} Credits`
          )}
        </p>
        <hr className="my-4" />
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
        {/* Removed the Button from here */}
      </CardFooter>
    </Card>
  )
} 
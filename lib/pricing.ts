import prisma from '@/lib/prisma'

export async function getPricingPlans() {
  const plans = await prisma.plan.findMany({
    where: {
      isActive: true
    },
    orderBy: {
      price: 'asc'
    }
  })
  
  return plans
} 
import prisma from '@/lib/prisma';

async function refillCredits() {
  try {
    // Get all users with active subscriptions
    const users = await prisma.user.findMany({
      where: {
        subscriptionStatus: 'active',
        currentPeriodEnd: {
          gte: new Date() // Only active subscriptions
        },
        planId: {
          not: null
        }
      },
      include: {
        plan: true
      }
    });

    console.log(`Found ${users.length} users with active subscriptions`);

    for (const user of users) {
      if (user.plan) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: user.plan.credits
          }
        });
        console.log(`Refilled credits for user ${user.id} to ${user.plan.credits}`);
      }
    }

    console.log('Credit refill completed successfully');
  } catch (error) {
    console.error('Error refilling credits:', error);
  } finally {
    await prisma.$disconnect();
  }
}

refillCredits(); 
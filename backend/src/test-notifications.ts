import { prisma } from './config/prisma';

async function test() {
  console.log("Starting test...");
  
  try {
    // Test simple - créer une notification
    const userId = "test-user-123";
    
    console.log("Testing findMany...");
    const notifs = await prisma.notification.findMany({
      where: { userId: userId },
      take: 5
    });
    
    console.log("Found:", notifs.length);
    console.log("Result:", JSON.stringify(notifs, null, 2));
    
    process.exit(0);
  } catch (error: any) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

test();

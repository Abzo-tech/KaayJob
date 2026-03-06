/**
 * Script pour créer un profil prestataire
 */

import { prisma } from "../config/prisma";

async function createProviderProfile() {
  const userId = process.argv[2];

  if (!userId) {
    console.log("Usage: npx tsx src/config/createProviderProfile.ts <userId>");
    const users = await prisma.user.findMany({
      where: { role: "PRESTATAIRE" },
      select: { id: true, email: true },
    });
    console.log("Prestataires sans profil:", users.length);
    for (const u of users) {
      const profile = await prisma.providerProfile.findUnique({
        where: { userId: u.id },
      });
      if (!profile) {
        console.log(`  - ${u.email} (${u.id})`);
        // Créer le profil
        await prisma.providerProfile.create({
          data: { userId: u.id },
        });
        console.log(`  ✅ Profil créé pour ${u.email}`);
      }
    }
  } else {
    const profile = await prisma.providerProfile.create({
      data: { userId },
    });
    console.log("Profil créé:", profile.id);
  }

  await prisma.$disconnect();
}

createProviderProfile();

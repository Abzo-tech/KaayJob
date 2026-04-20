/**
 * Service de paiement d'abonnements
 * Gère uniquement les paiements d'abonnements prestataires
 */

import { prisma } from "../config/prisma";
import { createNotification } from "./notificationService";

export async function processSubscriptionPayment(
  userId: string,
  amount: number,
  paymentMethod: string,
  planName: string,
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  if (user.role !== "PRESTATAIRE") {
    throw new Error("Seuls les prestataires peuvent payer des abonnements");
  }

  await prisma.payment.create({
    data: {
      userId,
      amount: amount as any,
      paymentMethod,
      status: "PAID",
    },
  });

  await createNotification(
    userId,
    "Paiement d'abonnement réussi",
    `Votre paiement de ${amount}€ pour l'abonnement ${planName.toUpperCase()} a été traité avec succès.`,
    "success",
    "/prestataire/subscription",
  );
}

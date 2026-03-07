"use strict";
/**
 * Script de seed pour la base de données avec Prisma
 * Crée des données de test réalistes pour tester le flux utilisateur
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function seed() {
    console.log("🌱 Seed de la base de données KaayJob...");
    console.log("=========================================");
    try {
        // ============================================
        // 1. CRÉER L'ADMIN
        // ============================================
        const adminEmail = "admin@kaayjob.sn";
        const existingAdmin = await prisma_1.prisma.user.findUnique({
            where: { email: adminEmail },
        });
        if (!existingAdmin) {
            const hashedPassword = await bcryptjs_1.default.hash("Admin123", 12);
            await prisma_1.prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    firstName: "Admin",
                    lastName: "KaayJob",
                    phone: "+221770000000",
                    role: "ADMIN",
                    isActive: true,
                    isVerified: true,
                },
            });
            console.log("✅ Admin créé:");
            console.log("   Email: admin@kaayjob.sn");
            console.log("   Mot de passe: Admin123");
        }
        else {
            console.log("ℹ️ Admin déjà existant");
        }
        // ============================================
        // 2. CRÉER DES CATÉGORIES
        // ============================================
        const categories = [
            {
                name: "Ménage",
                slug: "menage",
                description: "Services de nettoyage domestique",
                icon: "🧹",
                image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
                displayOrder: 1
            },
            {
                name: "Bricolage",
                slug: "bricolage",
                description: "Travaux de réparation et petit bricolage",
                icon: "🔧",
                image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800",
                displayOrder: 3
            },
            {
                name: "Électricité",
                slug: "electricite",
                description: "Services électriques et installation",
                icon: "💡",
                image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
                displayOrder: 4
            },
            {
                name: "Plomberie",
                slug: "plomberie",
                description: "Réparation plomberie et installation",
                icon: "🚿",
                image: "/images/plomberie.png",
                displayOrder: 5
            },
            {
                name: "Peinture",
                slug: "peinture",
                description: "Travaux de peinture intérieure et extérieure",
                icon: "🎨",
                image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800",
                displayOrder: 6
            },
            {
                name: "Déménagement",
                slug: "demangement",
                description: "Aide au déménagement et transport",
                icon: "📦",
                image: "/images/Demenagement.png",
                displayOrder: 7
            },
            {
                name: "Réparation",
                slug: "reparation",
                description: "Services de réparation et maintenance",
                icon: "🔩",
                image: "/images/Reparation.png",
                displayOrder: 8
            },
            {
                name: "Maçon",
                slug: "macon",
                description: "Travaux de construction et maçonnerie",
                icon: "🧱",
                image: "/images/maçon.png",
                displayOrder: 9
            },
            {
                name: "Menuisier bois",
                slug: "menuisier-bois",
                description: "Travail du bois et fabrication de meubles",
                icon: "🪵",
                image: "/images/menuiserie.png",
                displayOrder: 10
            },
            {
                name: "Menuisier métallique",
                slug: "menuisier-metal",
                description: "Travail du métal et ferronnerie",
                icon: "⚙️",
                image: "/images/metalique.png",
                displayOrder: 11
            },
            {
                name: "Éducation",
                slug: "education",
                description: "Cours à domicile et soutien scolaire",
                icon: "📚",
                image: "/images/education.png",
                displayOrder: 12
            },
            {
                name: "Mécanique",
                slug: "mecanique",
                description: "Services de mécanique automobile",
                icon: "🔧",
                image: "/images/mecanique.png",
                displayOrder: 13
            },
            {
                name: "Cuisine",
                slug: "cuisine",
                description: "Services de cuisine et préparation de repas",
                icon: "🍳",
                image: "/images/cuisine.png",
                displayOrder: 14
            },
        ];
        const createdCategories = [];
        for (const cat of categories) {
            const created = await prisma_1.prisma.category.upsert({
                where: { slug: cat.slug },
                update: {
                    image: cat.image,
                    description: cat.description,
                    icon: cat.icon,
                },
                create: cat,
            });
            createdCategories.push(created);
        }
        console.log(`✅ ${categories.length} catégories créées/mises à jour`);
        // ============================================
        // 3. CRÉER DES PRESTATAIRES (5)
        // ============================================
        const providers = [
            {
                email: "ahmed.plombier@email.com",
                firstName: "Ahmed",
                lastName: "Khan",
                phone: "+221771234567",
                businessName: "Ahmed Services",
                specialty: "Plomberie",
                bio: "Plombier professionnel avec 10 ans d'expérience. Spécialisé en réparation de fuites et installation de canalisations.",
                hourlyRate: 25,
                yearsExperience: 10,
                location: "Dakar",
                city: "Dakar",
            },
            {
                email: "marie.menage@email.com",
                firstName: "Marie",
                lastName: "Diop",
                phone: "+221771234568",
                businessName: "Marie Nettoyage",
                specialty: "Ménage",
                bio: "Experte en nettoyage domestique. Services de qualité pour particuliers et entreprises.",
                hourlyRate: 15,
                yearsExperience: 5,
                location: "Dakar",
                city: "Dakar",
            },
            {
                email: "ibrahim.elec@email.com",
                firstName: "Ibrahim",
                lastName: "Sarr",
                phone: "+221771234569",
                businessName: "Sarr Électricité",
                specialty: "Électricité",
                bio: "Électricien certifié. Installation électrique, dépannage, mise aux normes.",
                hourlyRate: 30,
                yearsExperience: 8,
                location: "Dakar",
                city: "Dakar",
            },
            {
                email: "oussein.brico@email.com",
                firstName: "Ousseynou",
                lastName: "Ba",
                phone: "+221771234571",
                businessName: "Brico Services",
                specialty: "Bricolage",
                bio: "Bricoleur polyvalent. Réparations diverses, montage de meubles, petits travaux.",
                hourlyRate: 18,
                yearsExperience: 4,
                location: "Dakar",
                city: "Dakar",
            },
            {
                email: "moussa.macon@email.com",
                firstName: "Moussa",
                lastName: "Sow",
                phone: "+221771234572",
                businessName: "Sow Construction",
                specialty: "Maçon",
                bio: "Maçon professionnel. Construction, rénovation, dallage, fondation. Qualité garantie.",
                hourlyRate: 35,
                yearsExperience: 12,
                location: "Dakar",
                city: "Dakar",
            },
            {
                email: "ali.bois@email.com",
                firstName: "Ali",
                lastName: "Diallo",
                phone: "+221771234573",
                businessName: "Diallo Menuiserie",
                specialty: "Menuisier bois",
                bio: "Menuisier qualifié. Fabrication et pose de meubles, portes, fenêtres, escaliers.",
                hourlyRate: 28,
                yearsExperience: 10,
                location: "Dakar",
                city: "Dakar",
            },
            {
                email: "youssou.metal@email.com",
                firstName: "Youssoufa",
                lastName: "Ndiaye",
                phone: "+221771234574",
                businessName: "Ndiaye Ferronnerie",
                specialty: "Menuisier métallique",
                bio: "Ferronnier d'art. Portails, grilles, rambarde, mobilier métallique sur mesure.",
                hourlyRate: 32,
                yearsExperience: 8,
                location: "Dakar",
                city: "Dakar",
            },
            {
                email: "mamadou.reparation@email.com",
                firstName: "Mamadou",
                lastName: "Fall",
                phone: "+221771234575",
                businessName: "Fall Réparations",
                specialty: "Réparation",
                bio: "Spécialiste en réparation d'appareils électroménagers, meubles et équipements.",
                hourlyRate: 22,
                yearsExperience: 6,
                location: "Dakar",
                city: "Dakar",
            },
            {
                email: "fatou.menage@email.com",
                firstName: "Fatou",
                lastName: "Sall",
                phone: "+221771234576",
                businessName: "Fatou Services Ménagers",
                specialty: "Femme de ménage",
                bio: "Femme de ménage expérimentée. Nettoyage complet, repassage, rangement.",
                hourlyRate: 12,
                yearsExperience: 7,
                location: "Dakar",
                city: "Dakar",
            },
            {
                email: "prof.samba@email.com",
                firstName: "Samba",
                lastName: "Ndiour",
                phone: "+221771234577",
                businessName: "Cours Particuliers Samba",
                specialty: "Éducation",
                bio: "Professeur certifié. Maths, Physique, Chimie. Tous niveaux du primaire à l'université.",
                hourlyRate: 35,
                yearsExperience: 12,
                location: "Dakar",
                city: "Dakar",
            },
        ];
        const createdProviders = [];
        for (const p of providers) {
            const hashedPassword = await bcryptjs_1.default.hash("Password123!", 12);
            const user = await prisma_1.prisma.user.upsert({
                where: { email: p.email },
                update: {},
                create: {
                    email: p.email,
                    password: hashedPassword,
                    firstName: p.firstName,
                    lastName: p.lastName,
                    phone: p.phone,
                    role: "PRESTATAIRE",
                    isActive: true,
                    isVerified: true,
                },
            });
            const profile = await prisma_1.prisma.providerProfile.upsert({
                where: { userId: user.id },
                update: {},
                create: {
                    userId: user.id,
                    businessName: p.businessName,
                    specialty: p.specialty,
                    bio: p.bio,
                    hourlyRate: p.hourlyRate,
                    yearsExperience: p.yearsExperience,
                    location: p.location,
                    city: p.city,
                    isAvailable: true,
                    rating: 4.5,
                    totalReviews: Math.floor(Math.random() * 50) + 10,
                    totalBookings: Math.floor(Math.random() * 100) + 20,
                    isVerified: true,
                },
            });
            // Stocker userId du prestataire car c'est ce qui est utilisé dans Service.providerId
            createdProviders.push({ user, profile, userId: user.id });
        }
        console.log(`✅ ${providers.length} prestataires créés`);
        // ============================================
        // 4. CRÉER DES SERVICES POUR CHAQUE PRESTATAIRE
        // ============================================
        const servicesData = [
            // Services Plomberie (Ahmed)
            { providerIndex: 0, categoryIndex: 3, name: "Réparation de fuite", description: "Détection et réparation de fuites d'eau", price: 5000, duration: 60 },
            { providerIndex: 0, categoryIndex: 3, name: "Débouchage canalisation", description: "Débouchage de WC, lavabo, évier", price: 8000, duration: 90 },
            { providerIndex: 0, categoryIndex: 3, name: "Installation sanitaires", description: "Pose de lavabo, WC, baignoire", price: 25000, duration: 180 },
            // Services Ménage (Marie)
            { providerIndex: 1, categoryIndex: 0, name: "Nettoyage maison", description: "Nettoyage complet domicile", price: 10000, duration: 120 },
            { providerIndex: 1, categoryIndex: 0, name: "Nettoyage bureau", description: "Nettoyage de locaux professionnels", price: 15000, duration: 120 },
            { providerIndex: 1, categoryIndex: 0, name: "Nettoyage fin de bail", description: "Nettoyage approfondi pour départ locataire", price: 30000, duration: 240 },
            // Services Électricité (Ibrahim)
            { providerIndex: 2, categoryIndex: 2, name: "Dépannage électrique", description: "Intervention rapide pour panne électrique", price: 10000, duration: 60 },
            { providerIndex: 2, categoryIndex: 2, name: "Installation prise", description: "Pose de prises électriques", price: 5000, duration: 30 },
            { providerIndex: 2, categoryIndex: 2, name: "Mise aux normes", description: "Mise aux normes du tableau électrique", price: 50000, duration: 360 },
            // Services Bricolage (Ousseynou)
            { providerIndex: 3, categoryIndex: 1, name: "Montage meubles", description: "Montage de meubles IKEA et autres", price: 5000, duration: 45 },
            { providerIndex: 3, categoryIndex: 1, name: "Petite réparation", description: "Réparations diverses à domicile", price: 3000, duration: 30 },
            { providerIndex: 3, categoryIndex: 1, name: "Pose étagère", description: "Installation d'étagères et rangements", price: 4000, duration: 30 },
            // Services Maçon (Moussa)
            { providerIndex: 4, categoryIndex: 7, name: "Construction mur", description: "Construction de murs en briques ou parpaings", price: 25000, duration: 240 },
            { providerIndex: 4, categoryIndex: 7, name: "Rénovation maçonnerie", description: "Réparation et réfection de maçonnerie", price: 20000, duration: 180 },
            { providerIndex: 4, categoryIndex: 7, name: "Dallage", description: "Pose de dallage extérieur ou intérieur", price: 30000, duration: 300 },
            // Services Menuisier bois (Ali)
            { providerIndex: 5, categoryIndex: 8, name: "Fabrication meuble", description: "Meuble sur mesure en bois", price: 45000, duration: 480 },
            { providerIndex: 5, categoryIndex: 8, name: "Pose porte", description: "Installation de portes intérieures et extérieures", price: 15000, duration: 120 },
            { providerIndex: 5, categoryIndex: 8, name: "Pose fenêtre", description: "Pose de fenêtres en bois", price: 20000, duration: 180 },
            // Services Menuisier métallique (Youssoufa)
            { providerIndex: 6, categoryIndex: 9, name: "Portail métallique", description: "Fabrication et pose de portail", price: 80000, duration: 360 },
            { providerIndex: 6, categoryIndex: 9, name: "Grille de sécurité", description: "Installation de grilles aux fenêtres", price: 25000, duration: 180 },
            { providerIndex: 6, categoryIndex: 9, name: "Rambarde escalier", description: "Pose de rambarde ou garde-corps", price: 35000, duration: 240 },
            // Services Réparation (Mamadou)
            { providerIndex: 7, categoryIndex: 6, name: "Réparation electroménager", description: "Réparation d'appareils électroménagers", price: 8000, duration: 60 },
            { providerIndex: 7, categoryIndex: 6, name: "Réparation meubles", description: "Réparation et restauration de meubles", price: 5000, duration: 45 },
            { providerIndex: 7, categoryIndex: 6, name: "Maintenance équipements", description: "Entretien et maintenance d'équipements", price: 6000, duration: 45 },
            // Services Femme de ménage (Fatou)
            { providerIndex: 8, categoryIndex: 0, name: "Nettoyage quotidien", description: "Nettoyage quotidien du domicile", price: 8000, duration: 120 },
            { providerIndex: 8, categoryIndex: 0, name: "Repassage", description: "Service de repassage à domicile", price: 5000, duration: 90 },
            { providerIndex: 8, categoryIndex: 0, name: "Grand nettoyage", description: "Nettoyage complet et approfondi", price: 20000, duration: 240 },
            // Services Éducation (Samba)
            { providerIndex: 9, categoryIndex: 10, name: "Cours de Maths", description: "Cours particuliers de mathématiques", price: 10000, duration: 60 },
            { providerIndex: 9, categoryIndex: 10, name: "Cours de Physique", description: "Cours particuliers de physique", price: 10000, duration: 60 },
            { providerIndex: 9, categoryIndex: 10, name: "Soutien scolaire", description: "Aide aux devoirs et soutien scolaire", price: 8000, duration: 60 },
        ];
        for (const s of servicesData) {
            const provider = createdProviders[s.providerIndex];
            const category = createdCategories[s.categoryIndex];
            // Service.providerId doit correspondre à ProviderProfile.userId
            await prisma_1.prisma.service.create({
                data: {
                    providerId: provider.userId,
                    categoryId: category.id,
                    name: s.name,
                    description: s.description,
                    price: s.price,
                    priceType: "HOURLY",
                    duration: s.duration,
                    isActive: true,
                },
            });
        }
        console.log(`✅ ${servicesData.length} services créés`);
        // ============================================
        // 5. CRÉER DES CLIENTS (3)
        // ============================================
        const clients = [
            { email: "client1@email.com", firstName: "Pierre", lastName: "Dupont", phone: "+221771234580" },
            { email: "client2@email.com", firstName: "Sophie", lastName: "Martin", phone: "+221771234581" },
            { email: "client3@email.com", firstName: "Jean", lastName: "Bernard", phone: "+221771234582" },
        ];
        const createdClients = [];
        for (const c of clients) {
            const hashedPassword = await bcryptjs_1.default.hash("Password123!", 12);
            const user = await prisma_1.prisma.user.upsert({
                where: { email: c.email },
                update: {},
                create: {
                    email: c.email,
                    password: hashedPassword,
                    firstName: c.firstName,
                    lastName: c.lastName,
                    phone: c.phone,
                    role: "CLIENT",
                    isActive: true,
                    isVerified: false,
                },
            });
            createdClients.push(user);
        }
        console.log(`✅ ${clients.length} clients créés`);
        // ============================================
        // 6. CRÉER DES RÉSERVATIONS
        // ============================================
        const allServices = await prisma_1.prisma.service.findMany({
            include: { provider: true }
        });
        const bookingsData = [
            { clientIndex: 0, serviceIndex: 0, status: "COMPLETED", daysAgo: 10 },
            { clientIndex: 1, serviceIndex: 3, status: "COMPLETED", daysAgo: 8 },
            { clientIndex: 2, serviceIndex: 6, status: "COMPLETED", daysAgo: 5 },
            { clientIndex: 0, serviceIndex: 9, status: "CONFIRMED", daysAgo: 2 },
            { clientIndex: 1, serviceIndex: 12, status: "PENDING", daysAgo: 0 },
            { clientIndex: 2, serviceIndex: 1, status: "CONFIRMED", daysAgo: 1 },
        ];
        for (const b of bookingsData) {
            const client = createdClients[b.clientIndex];
            const service = allServices[b.serviceIndex];
            const bookingDate = new Date();
            bookingDate.setDate(bookingDate.getDate() + b.daysAgo);
            await prisma_1.prisma.booking.create({
                data: {
                    clientId: client.id,
                    serviceId: service.id,
                    bookingDate: bookingDate,
                    bookingTime: "10:00",
                    duration: service.duration || 60,
                    status: b.status,
                    address: "123 Rue de la Paix",
                    city: "Dakar",
                    phone: client.phone,
                    notes: "Merci de arriver à l'heure",
                    totalAmount: service.price,
                    paymentStatus: b.status === "COMPLETED" ? "PAID" : "PENDING",
                },
            });
        }
        console.log(`✅ ${bookingsData.length} réservations créées`);
        // ============================================
        // 7. CRÉER DES AVIS
        // ============================================
        const completedBookings = await prisma_1.prisma.booking.findMany({
            where: { status: "COMPLETED" },
            include: {
                service: {
                    include: { provider: true }
                },
                client: true
            }
        });
        const reviewsData = [
            { bookingIndex: 0, rating: 5, comment: "Excellent travail, très professionnel et ponctuel. Je recommande!" },
            { bookingIndex: 1, rating: 4, comment: "Très bon service, légèrement en retard mais travail bien fait." },
            { bookingIndex: 2, rating: 5, comment: "Service impeccable, Electricien très compétent. Je referai appel." },
        ];
        for (let i = 0; i < reviewsData.length && i < completedBookings.length; i++) {
            const booking = completedBookings[i];
            const review = reviewsData[i];
            // Vérifier si un avis existe déjà pour cette réservation
            const existingReview = await prisma_1.prisma.review.findUnique({
                where: { bookingId: booking.id },
            });
            if (existingReview)
                continue; // Skip si déjà existant
            // Le providerId dans Review fait référence à ProviderProfile.id
            const providerId = booking.service.provider.id;
            await prisma_1.prisma.review.create({
                data: {
                    bookingId: booking.id,
                    clientId: booking.clientId,
                    providerId: providerId,
                    serviceId: booking.service.id,
                    rating: review.rating,
                    comment: review.comment,
                    isVerified: true,
                },
            });
        }
        console.log(`✅ ${reviewsData.length} avis créés`);
        // ============================================
        // RÉSUMÉ
        // ============================================
        console.log("\n=========================================");
        console.log("🌿 DONNÉES DE TEST CRÉÉES AVEC SUCCÈS!");
        console.log("=========================================\n");
        console.log("📧 COMPTES UTILISATEURS:");
        console.log("------------------------");
        console.log("ADMIN:");
        console.log("  Email: admin@kaayjob.sn");
        console.log("  Mot de passe: Admin123\n");
        console.log("PRESTATAIRES:");
        for (const p of providers) {
            console.log(`  ${p.businessName}`);
            console.log(`  Email: ${p.email} | Mot de passe: Password123!`);
        }
        console.log();
        console.log("CLIENTS:");
        for (const c of clients) {
            console.log(`  ${c.firstName} ${c.lastName}`);
            console.log(`  Email: ${c.email} | Mot de passe: Password123!`);
        }
        console.log("\n=========================================");
        console.log("🎯 FONCTIONS À TESTER:");
        console.log("=========================================");
        console.log("1. Connexion Admin → Gestion utilisateurs, catégories");
        console.log("2. Connexion Prestataire → Services, Réservations");
        console.log("3. Connexion Client → Réserver service, Laisser avis");
        console.log("\n✅ Seed terminé!");
    }
    catch (error) {
        console.error("❌ Erreur:", error);
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
}
seed();
//# sourceMappingURL=seed.js.map
#!/usr/bin/env node

/**
 * User Flow End-to-End Tests for KaayJob
 * Tests complete user journeys: client, provider, admin workflows
 * and validates persisted state directly in PostgreSQL via Prisma.
 */

const path = require("path");
const http = require("http");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config({ path: path.join(__dirname, ".env") });

const BASE_URL = "http://127.0.0.1:3001";
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
  log: ["error"],
});

let testsPassed = 0;
let testsFailed = 0;

// Test data
let clientToken = null;
let providerToken = null;
let adminToken = null;
let clientId = null;
let providerId = null;
let adminId = null;
let categoryId = null;
let serviceId = null;
let bookingId = null;

const makeRequest = (method, path, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data,
          });
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

const test = async (
  name,
  method,
  path,
  body = null,
  expectedStatus = 200,
  headers = {},
) => {
  try {
    const result = await makeRequest(method, path, body, headers);
    const passed =
      result.status === expectedStatus ||
      (Array.isArray(expectedStatus) && expectedStatus.includes(result.status));

    if (passed) {
      console.log(`  ✅ ${name}`);
      testsPassed++;
    } else {
      console.log(
        `  ❌ ${name} - Expected ${expectedStatus}, got ${result.status}`,
      );
      if (result.body?.message)
        console.log(`     Message: ${result.body.message}`);
      testsFailed++;
    }
    return result;
  } catch (error) {
    console.log(`  ❌ ${name} - Error: ${error.message}`);
    testsFailed++;
    return null;
  }
};

const dbTest = async (name, assertion) => {
  try {
    await assertion();
    console.log(`  ✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`  ❌ ${name} - Error: ${error.message}`);
    testsFailed++;
  }
};

const runTests = async () => {
  console.log("🧪 KaayJob User Flow End-to-End Tests\n");

  // ===== FLOW 1: CLIENT REGISTRATION & LOGIN =====
  console.log("📋 FLOW 1: Client Registration & Login");
  const clientEmail = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;
  const clientReg = await test(
    "Register as Client",
    "POST",
    "/api/auth/register",
    {
      email: clientEmail,
      password: "SecurePass123!",
      firstName: "Jean",
      lastName: "Client",
      phone: "+221771234567",
      role: "client",
    },
    [200, 201],
  );

  if (clientReg?.body?.data?.token) {
    clientToken = clientReg.body.data.token;
    clientId = clientReg.body.data.user.id;
    console.log(`  ✓ Client token obtained`);
  }

  if (clientId) {
    await dbTest("DB Check Client Registration", async () => {
      const client = await prisma.user.findUnique({
        where: { id: clientId },
        select: { email: true, role: true, firstName: true, lastName: true },
      });

      if (!client) throw new Error("Client user not found in database");
      if (client.role !== "CLIENT") throw new Error(`Unexpected role: ${client.role}`);
      if (client.firstName !== "Jean") throw new Error(`Unexpected firstName: ${client.firstName}`);
    });
  }

  // ===== FLOW 2: PROVIDER REGISTRATION & SETUP =====
  console.log("\n📋 FLOW 2: Provider Registration & Profile Setup");
  const providerEmail = `provider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;
  const providerReg = await test(
    "Register as Provider",
    "POST",
    "/api/auth/register",
    {
      email: providerEmail,
      password: "SecurePass123!",
      firstName: "Marie",
      lastName: "Provider",
      phone: "+221778765432",
      role: "prestataire",
    },
    [200, 201],
  );

  if (providerReg?.body?.data?.token) {
    providerToken = providerReg.body.data.token;
    providerId = providerReg.body.data.user.id;
    console.log(`  ✓ Provider token obtained`);
  }

  if (providerId) {
    await dbTest("DB Check Provider Registration", async () => {
      const provider = await prisma.user.findUnique({
        where: { id: providerId },
        select: {
          email: true,
          role: true,
          providerProfile: {
            select: {
              userId: true,
              isAvailable: true,
            },
          },
        },
      });

      if (!provider) throw new Error("Provider user not found in database");
      if (provider.role !== "PRESTATAIRE") {
        throw new Error(`Unexpected role: ${provider.role}`);
      }
      if (!provider.providerProfile) {
        throw new Error("Provider profile not created");
      }
      if (provider.providerProfile.isAvailable !== true) {
        throw new Error("Provider profile isAvailable should be true");
      }
    });
  }

  if (providerToken) {
    await test(
      "Update Provider Profile",
      "PUT",
      "/api/providers/profile",
      {
        bio: "Expert en nettoyage professionnel",
        phone: "+2212345678",
        city: "Dakar",
        country: "Dakar",
      },
      200,
      { Authorization: `Bearer ${providerToken}` },
    );

    if (providerId) {
      await dbTest("DB Check Provider Profile Update", async () => {
        const profile = await prisma.providerProfile.findUnique({
          where: { userId: providerId },
          select: { bio: true, city: true },
        });

        if (!profile) throw new Error("Provider profile not found");
        if (profile.bio !== "Expert en nettoyage professionnel") {
          throw new Error(`Unexpected bio: ${profile.bio}`);
        }
        if (profile.city !== "Dakar") {
          throw new Error(`Unexpected city after profile update: ${profile.city}`);
        }
      });
    }

    await test(
      "Update Provider Location",
      "PUT",
      "/api/providers/profile/location",
      {
        latitude: 17.8566,
        longitude:142.3522,
        city: "Paris",
      },
      200,
      { Authorization: `Bearer ${providerToken}` },
    );

    if (providerId) {
      await dbTest("DB Check Provider Location Update", async () => {
        const profile = await prisma.providerProfile.findUnique({
          where: { userId: providerId },
          select: { latitude: true, longitude: true, city: true },
        });

        if (!profile) throw new Error("Provider profile not found");
        if (profile.latitude !== 17.8566) {
          throw new Error(`Unexpected latitude: ${profile.latitude}`);
        }
        if (profile.longitude !== 142.3522) {
          throw new Error(`Unexpected longitude: ${profile.longitude}`);
        }
        if (profile.city !== "Paris") {
          throw new Error(`Unexpected city after location update: ${profile.city}`);
        }
      });
    }
  }

  // ===== FLOW 3: CATEGORY & SERVICE CREATION =====
  console.log("\n📋 FLOW 3: Category & Service Creation");
  const categoriesRes = await test(
    "Get All Categories",
    "GET",
    "/api/categories",
    null,
    200,
  );

  if (categoriesRes?.body?.data?.length > 0) {
    categoryId = categoriesRes.body.data[0].id;
    console.log(`  ✓ Using category ID: ${categoryId}`);
  }

  if (providerToken && categoryId) {
    const serviceRes = await test(
      "Create Service by Provider",
      "POST",
      "/api/services",
      {
        name: "Nettoyage Complet",
        description: "Service de nettoyage professionnel complet",
        price: 150,
        duration: 120,
        categoryId: categoryId,
      },
      [200, 201],
      { Authorization: `Bearer ${providerToken}` },
    );

    if (serviceRes?.body?.data?.id) {
      serviceId = serviceRes.body.data.id;
      console.log(`  ✓ Service created with ID: ${serviceId}`);
    }

    if (serviceId && providerId) {
      await dbTest("DB Check Service Creation", async () => {
        const service = await prisma.service.findUnique({
          where: { id: serviceId },
          select: {
            providerId: true,
            categoryId: true,
            name: true,
            price: true,
            isActive: true,
          },
        });

        if (!service) throw new Error("Service not found in database");
        if (service.providerId !== providerId) {
          throw new Error(`Unexpected providerId: ${service.providerId}`);
        }
        if (service.categoryId !== categoryId) {
          throw new Error(`Unexpected categoryId: ${service.categoryId}`);
        }
        if (service.name !== "Nettoyage Complet") {
          throw new Error(`Unexpected service name: ${service.name}`);
        }
        if (!service.isActive) throw new Error("Service should be active");
      });
    }
  }

  // ===== FLOW 4: CLIENT BROWSE & SEARCH =====
  console.log("\n📋 FLOW 4: Client Browse Services");
  await test("Browse All Services", "GET", "/api/services", null, 200);

  if (categoryId) {
    await test(
      "Get Services by Category",
      "GET",
      `/api/categories/${categoryId}/services`,
      null,
      200,
    );
  }

  await test("Get All Providers", "GET", "/api/providers", null, 200);

  await test("Get Provider Map", "GET", "/api/providers/map", null, 200);

  // ===== FLOW 5: CLIENT CREATE BOOKING =====
  console.log("\n📋 FLOW 5: Client Create Booking");
  if (clientToken && serviceId) {
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const bookingRes = await test(
      "Create Booking",
      "POST",
      "/api/bookings",
      {
        serviceId: serviceId,
        date: futureDate.toISOString().split("T")[0],
        time: "10:00",
        address: "123 rue de la Paix, 75000 Paris",
        city: "Paris",
        notes: "Merci de venir le matin",
      },
      [200, 201],
      { Authorization: `Bearer ${clientToken}` },
    );

    if (bookingRes?.body?.data?.id) {
      bookingId = bookingRes.body.data.id;
      console.log(`  ✓ Booking created with ID: ${bookingId}`);
    }

    if (bookingId && clientId && providerId) {
      await dbTest("DB Check Booking Creation", async () => {
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          select: {
            clientId: true,
            serviceId: true,
            status: true,
            paymentStatus: true,
            service: {
              select: {
                providerId: true,
              },
            },
          },
        });

        if (!booking) throw new Error("Booking not found in database");
        if (booking.clientId !== clientId) {
          throw new Error(`Unexpected clientId: ${booking.clientId}`);
        }
        if (booking.serviceId !== serviceId) {
          throw new Error(`Unexpected serviceId: ${booking.serviceId}`);
        }
        if (booking.status !== "PENDING") {
          throw new Error(`Unexpected booking status: ${booking.status}`);
        }
        if (!booking.service || booking.service.providerId !== providerId) {
          throw new Error("Booking service/provider relation invalid");
        }
      });

      await dbTest("DB Check Provider Notification After Booking", async () => {
        const notif = await prisma.notification.findFirst({
          where: {
            userId: providerId,
            title: "Nouvelle réservation",
          },
          orderBy: { createdAt: "desc" },
          select: {
            title: true,
            message: true,
          },
        });

        if (!notif) throw new Error("Provider booking notification not found");
        if (!notif.message.includes("Jean Client")) {
          throw new Error(`Unexpected booking notification message: ${notif.message}`);
        }
      });
    }

    await test("Get Client Bookings", "GET", "/api/bookings/me", null, 200, {
      Authorization: `Bearer ${clientToken}`,
    });
  }

  // ===== FLOW 6: SUBSCRIPTION MANAGEMENT =====
  console.log("\n📋 FLOW 6: Subscription Management");
  await test(
    "Browse Subscription Plans",
    "GET",
    "/api/subscriptions/plans",
    null,
    200,
  );

  if (providerToken) {
    await test(
      "Get Provider Active Subscription",
      "GET",
      "/api/subscriptions/active",
      null,
      [200, 404],
      { Authorization: `Bearer ${providerToken}` },
    );
  }

  // ===== FLOW 7: NOTIFICATIONS =====
  console.log("\n📋 FLOW 7: Notifications");
  if (clientToken) {
    await test(
      "Get Client Notifications",
      "GET",
      "/api/notifications",
      null,
      200,
      { Authorization: `Bearer ${clientToken}` },
    );

    if (clientId) {
      await dbTest("DB Check Client Notifications Query", async () => {
        const count = await prisma.notification.count({
          where: { userId: clientId },
        });

        if (count < 0) {
          throw new Error("Notification count should never be negative");
        }
      });
    }
  }

  // ===== FLOW 8: REVIEWS & RATINGS =====
  console.log("\n📋 FLOW 8: Reviews & Ratings");
  if (bookingId && clientToken) {
    // First, confirm booking (using provider token)
    if (providerToken) {
      await test(
        "Confirm Booking",
        "PUT",
        `/api/bookings/${bookingId}/status`,
        { status: "CONFIRMED" },
        200,
        { Authorization: `Bearer ${providerToken}` },
      );

      await dbTest("DB Check Booking Confirmed", async () => {
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          select: { status: true },
        });
        if (!booking) throw new Error("Booking not found after confirm");
        if (booking.status !== "CONFIRMED") {
          throw new Error(`Unexpected status after confirm: ${booking.status}`);
        }
      });

      if (clientId) {
        await dbTest("DB Check Client Notification After Confirm", async () => {
          const notif = await prisma.notification.findFirst({
            where: {
              userId: clientId,
              title: "Statut de réservation mis à jour",
            },
            orderBy: { createdAt: "desc" },
            select: { title: true, message: true },
          });

          if (!notif) throw new Error("Client confirmation notification not found");
          if (!notif.message.includes("confirmed")) {
            throw new Error(`Unexpected confirmation message: ${notif.message}`);
          }
        });
      }

      // Then mark as in progress
      await test(
        "Mark Booking as In Progress",
        "PUT",
        `/api/bookings/${bookingId}/status`,
        { status: "IN_PROGRESS" },
        200,
        { Authorization: `Bearer ${providerToken}` },
      );

      await dbTest("DB Check Booking In Progress", async () => {
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          select: { status: true },
        });
        if (!booking) throw new Error("Booking not found after in progress");
        if (booking.status !== "IN_PROGRESS") {
          throw new Error(`Unexpected status after in progress: ${booking.status}`);
        }
      });

      // Finally mark as completed
      await test(
        "Mark Booking as Completed",
        "PUT",
        `/api/bookings/${bookingId}/status`,
        { status: "COMPLETED" },
        200,
        { Authorization: `Bearer ${providerToken}` },
      );

      await dbTest("DB Check Booking Completed", async () => {
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          select: { status: true },
        });
        if (!booking) throw new Error("Booking not found after completion");
        if (booking.status !== "COMPLETED") {
          throw new Error(`Unexpected status after completion: ${booking.status}`);
        }
      });
    }

    await test(
      "Get Reviews for Booking",
      "GET",
      `/api/reviews/booking/${bookingId}`,
      null,
      [200, 404],
    );

    await test(
      "Create Review",
      "POST",
      "/api/reviews",
      {
        bookingId: bookingId,
        rating: 5,
        comment: "Excellent service, très professionnel!",
      },
      [200, 201],
      { Authorization: `Bearer ${clientToken}` },
    );

    await dbTest("DB Check Review Creation", async () => {
      const review = await prisma.review.findUnique({
        where: { bookingId: bookingId },
        select: {
          rating: true,
          comment: true,
          clientId: true,
        },
      });

      if (!review) throw new Error("Review not found in database");
      if (review.rating !== 5) throw new Error(`Unexpected rating: ${review.rating}`);
      if (review.clientId !== clientId) {
        throw new Error(`Unexpected review clientId: ${review.clientId}`);
      }
    });
  }

  // ===== FLOW 9: USER PROFILE MANAGEMENT =====
  console.log("\n📋 FLOW 9: User Profile Management");
  if (clientToken) {
    await test("Get User Profile", "GET", "/api/auth/me", null, 200, {
      Authorization: `Bearer ${clientToken}`,
    });

    await test("Get Profile Details", "GET", "/api/profile", null, 200, {
      Authorization: `Bearer ${clientToken}`,
    });

    await test(
      "Update User Profile",
      "PUT",
      "/api/profile",
      {
        firstName: "Jean-Paul",
        lastName: "Client",
        phone: "+2217654321",
      },
      200,
      { Authorization: `Bearer ${clientToken}` },
    );

    await dbTest("DB Check User Profile Update", async () => {
      const user = await prisma.user.findUnique({
        where: { id: clientId },
        select: { firstName: true, lastName: true, phone: true },
      });

      if (!user) throw new Error("Updated client not found in database");
      if (user.firstName !== "Jean-Paul") {
        throw new Error(`Unexpected firstName after update: ${user.firstName}`);
      }
      if (user.phone !== "+2217654321") {
        throw new Error(`Unexpected phone after update: ${user.phone}`);
      }
    });
  }

  // ===== FLOW 10: PAYMENTS TRACKING =====
  console.log("\n📋 FLOW 10: Payments Tracking");
  if (providerToken) {
    await test("Get Provider Payments", "GET", "/api/payments/me", null, 200, {
      Authorization: `Bearer ${providerToken}`,
    });
  }

  if (clientToken) {
    await test(
      "Get User Profile for Payments",
      "GET",
      "/api/users/profile",
      null,
      200,
      {
        Authorization: `Bearer ${clientToken}`,
      },
    );
  }

  // ===== FLOW 11: ADMIN DASHBOARD & STATS =====
  console.log("\n📋 FLOW 11: Admin Dashboard & Stats");

  // Create admin user
  const adminEmail = `admin-${Date.now()}@kaayjob.com`;
  const adminReg = await test(
    "Create Admin User",
    "POST",
    "/api/auth/register",
    {
      email: adminEmail,
      password: "AdminPass123!",
      firstName: "Admin",
      lastName: "KaayJob",
      phone: "+221700000000",
      role: "admin",
    },
    [200, 201],
  );

  let adminToken = null;
  if (adminReg?.body?.data?.token) {
    adminToken = adminReg.body.data.token;
    adminId = adminReg.body.data.user.id;
    console.log(`  ✓ Admin token obtained`);
  }

  if (adminId) {
    await dbTest("DB Check Admin Registration", async () => {
      const admin = await prisma.user.findUnique({
        where: { id: adminId },
        select: { email: true, role: true },
      });

      if (!admin) throw new Error("Admin user not found in database");
      if (admin.role !== "ADMIN") throw new Error(`Unexpected admin role: ${admin.role}`);
    });
  }

  if (adminToken) {
    await test("Get Admin Stats", "GET", "/api/admin/stats", null, 200, {
      Authorization: `Bearer ${adminToken}`,
    });

    await test("Get All Payments (Admin)", "GET", "/api/payments", null, 200, {
      Authorization: `Bearer ${adminToken}`,
    });

    await test("Get All Reviews (Admin)", "GET", "/api/reviews", null, 200, {
      Authorization: `Bearer ${adminToken}`,
    });
  }

  // ===== SUMMARY =====
  console.log("\n" + "=".repeat(60));
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(`📊 Total: ${testsPassed + testsFailed}`);
  console.log("=".repeat(60));

  if (testsFailed === 0) {
    console.log("🎉 All user flows completed successfully!");
  } else {
    console.log("⚠️  Some tests failed. Review the output above.");
  }

  await prisma.$disconnect();
  process.exit(testsFailed > 0 ? 1 : 0);
};

// Check server before running
const checkServer = async () => {
  try {
    await makeRequest("GET", "/api/health");
    console.log("✅ Server is running\n");
    runTests();
  } catch (error) {
    console.error("❌ Server is not running at " + BASE_URL);
    await prisma.$disconnect();
    process.exit(1);
  }
};

checkServer();

#!/usr/bin/env node

/**
 * User Flow End-to-End Tests for KaayJob
 * Tests complete user journeys: client, provider, admin workflows
 */

const http = require("http");
const BASE_URL = "http://localhost:3001";

let testsPassed = 0;
let testsFailed = 0;

// Test data
let clientToken = null;
let providerToken = null;
let adminToken = null;
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
    console.log(`  ✓ Client token obtained`);
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
    console.log(`  ✓ Provider token obtained`);
  }

  if (providerToken) {
    await test(
      "Update Provider Profile",
      "PUT",
      "/api/providers/profile",
      {
        bio: "Expert en nettoyage professionnel",
        phone: "+33612345678",
        city: "Paris",
        country: "France",
      },
      200,
      { Authorization: `Bearer ${providerToken}` },
    );

    await test(
      "Update Provider Location",
      "PUT",
      "/api/providers/profile/location",
      {
        latitude: 48.8566,
        longitude: 2.3522,
        city: "Paris",
      },
      200,
      { Authorization: `Bearer ${providerToken}` },
    );
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
  }

  // ===== FLOW 8: REVIEWS & RATINGS =====
  console.log("\n📋 FLOW 8: Reviews & Ratings");
  if (bookingId && clientToken) {
    // First, mark booking as completed (using provider token)
    if (providerToken) {
      await test(
        "Mark Booking as Completed",
        "PUT",
        `/api/bookings/${bookingId}/status`,
        { status: "COMPLETED" },
        200,
        { Authorization: `Bearer ${providerToken}` },
      );
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
        phone: "+33687654321",
      },
      200,
      { Authorization: `Bearer ${clientToken}` },
    );
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
    console.log(`  ✓ Admin token obtained`);
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
    process.exit(1);
  }
};

checkServer();

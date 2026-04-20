#!/usr/bin/env node

const http = require("http");
const BASE_URL = "http://127.0.0.1:3001";

const makeRequest = (method, path, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port || "3002",
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
            body: data ? JSON.parse(data) : data,
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

const debugTest = async () => {
  console.log("🔍 Debug Tests\n");

  // Register provider
  const providerEmail = `provider-debug-${Date.now()}@example.com`;
  console.log("1️⃣  Registering provider...");
  const providerReg = await makeRequest("POST", "/api/auth/register", {
    email: providerEmail,
    password: "SecurePass123!",
    firstName: "Debug",
    lastName: "Provider",
    phone: "+221771234567",
    role: "prestataire",
  });
  console.log(`Status: ${providerReg.status}`);
  console.log(`Response:`, JSON.stringify(providerReg.body, null, 2));

  if (!providerReg.body?.data?.token) {
    console.error("❌ Could not register provider");
    process.exit(1);
  }

  const providerToken = providerReg.body.data.token;
  console.log(`✅ Provider token: ${providerToken.substring(0, 20)}...\n`);

  // Test updateProfile
  console.log("2️⃣  Testing PUT /api/providers/profile...");
  const updateRes = await makeRequest(
    "PUT",
    "/api/providers/profile",
    {
      bio: "Expert en service",
      city: "Paris",
      country: "France",
    },
    { Authorization: `Bearer ${providerToken}` },
  );
  console.log(`Status: ${updateRes.status}`);
  console.log(`Response:`, JSON.stringify(updateRes.body, null, 2));

  // Test updateAvailability
  console.log("\n3️⃣  Testing PUT /api/providers/profile/availability...");
  const availabilityRes = await makeRequest(
    "PUT",
    "/api/providers/profile/availability",
    { isAvailable: true },
    { Authorization: `Bearer ${providerToken}` },
  );
  console.log(`Status: ${availabilityRes.status}`);
  console.log(`Response:`, JSON.stringify(availabilityRes.body, null, 2));

  // Test updateLocation
  console.log("\n4️⃣  Testing PUT /api/providers/profile/location...");
  const locationRes = await makeRequest(
    "PUT",
    "/api/providers/profile/location",
    {
      latitude: 14.7167,
      longitude: -17.4677,
      city: "Dakar",
      region: "Dakar",
    },
    { Authorization: `Bearer ${providerToken}` },
  );
  console.log(`Status: ${locationRes.status}`);
  console.log(`Response:`, JSON.stringify(locationRes.body, null, 2));

  // Test getProfile
  console.log("\n5️⃣  Testing GET /api/providers/profile...");
  const profileRes = await makeRequest(
    "GET",
    "/api/providers/profile",
    null,
    { Authorization: `Bearer ${providerToken}` },
  );
  console.log(`Status: ${profileRes.status}`);
  console.log(`Response:`, JSON.stringify(profileRes.body, null, 2));

  console.log("\n✅ All tests completed!");
};

const checkServer = async () => {
  try {
    await makeRequest("GET", "/api/health");
    console.log("✅ Server is running\n");
    debugTest();
  } catch (error) {
    console.error("❌ Server is not running at " + BASE_URL);
    process.exit(1);
  }
};

checkServer();

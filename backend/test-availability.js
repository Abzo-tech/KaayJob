#!/usr/bin/env node

const http = require("http");
const BASE_URL = "http://127.0.0.1:3001";

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

const testAvailability = async () => {
  console.log("🔧 Testing availability route...\n");

  // Register provider
  const providerEmail = `provider-availability-${Date.now()}@example.com`;
  console.log("1️⃣  Registering provider...");
  const providerReg = await makeRequest("POST", "/api/auth/register", {
    email: providerEmail,
    password: "SecurePass123!",
    firstName: "Test",
    lastName: "Provider",
    phone: "+221771234567",
    role: "prestataire",
  });

  if (!providerReg.body?.data?.token) {
    console.error("❌ Could not register provider");
    process.exit(1);
  }

  const providerToken = providerReg.body.data.token;
  console.log(`✅ Provider token obtained\n`);

  // Test update availability
  console.log("2️⃣  Testing PUT /api/providers/profile/availability...");
  const availabilityRes = await makeRequest(
    "PUT",
    "/api/providers/profile/availability",
    { isAvailable: true },
    { Authorization: `Bearer ${providerToken}` },
  );

  console.log(`Status: ${availabilityRes.status}`);
  console.log(`Response:`, JSON.stringify(availabilityRes.body, null, 2));
};

const checkServer = async () => {
  try {
    await makeRequest("GET", "/api/health");
    console.log("✅ Server is running\n");
    testAvailability();
  } catch (error) {
    console.error("❌ Server is not running at " + BASE_URL);
    process.exit(1);
  }
};

checkServer();

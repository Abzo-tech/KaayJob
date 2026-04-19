#!/usr/bin/env node

const http = require("http");
const BASE_URL = "http://localhost:3001";

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

const performanceTest = async () => {
  console.log("🚀 Performance Tests\n");

  const startTime = Date.now();

  // Test health endpoint
  console.log("1️⃣  Testing health endpoint...");
  const healthStart = Date.now();
  const healthRes = await makeRequest("GET", "/api/health");
  const healthTime = Date.now() - healthStart;
  console.log(`   Status: ${healthRes.status} (${healthTime}ms)`);

  // Test categories endpoint
  console.log("2️⃣  Testing categories endpoint...");
  const categoriesStart = Date.now();
  const categoriesRes = await makeRequest("GET", "/api/categories");
  const categoriesTime = Date.now() - categoriesStart;
  console.log(`   Status: ${categoriesRes.status} (${categoriesTime}ms)`);

  // Test providers endpoint
  console.log("3️⃣  Testing providers endpoint...");
  const providersStart = Date.now();
  const providersRes = await makeRequest("GET", "/api/providers");
  const providersTime = Date.now() - providersStart;
  console.log(`   Status: ${providersRes.status} (${providersTime}ms)`);

  const totalTime = Date.now() - startTime;
  console.log(`\n📊 Total test time: ${totalTime}ms`);
  console.log(`📈 Average response time: ${(totalTime / 3).toFixed(1)}ms`);

  if (totalTime < 1000) {
    console.log("✅ Performance: EXCELLENT (< 1s total)");
  } else if (totalTime < 3000) {
    console.log("✅ Performance: GOOD (< 3s total)");
  } else {
    console.log("⚠️  Performance: NEEDS OPTIMIZATION (> 3s total)");
  }
};

const checkServer = async () => {
  try {
    await makeRequest("GET", "/api/health");
    console.log("✅ Server is running\n");
    performanceTest();
  } catch (error) {
    console.error("❌ Server is not running at " + BASE_URL);
    process.exit(1);
  }
};

checkServer();

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const searchResponseTime = new Trend('search_response_time');
const bookingResponseTime = new Trend('booking_response_time');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users over 2 minutes
    { duration: '5m', target: 50 },   // Stay at 50 users for 5 minutes
    { duration: '2m', target: 100 },  // Ramp up to 100 users over 2 minutes
    { duration: '5m', target: 100 },  // Stay at 100 users for 5 minutes
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.1'],    // Error rate should be below 10%
    errors: ['rate<0.1'],
  },
};

// Base URL
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Test data
const testUsers = [
  { email: 'test1@example.com', password: 'password123' },
  { email: 'test2@example.com', password: 'password123' },
  { email: 'test3@example.com', password: 'password123' },
];

// Setup function - runs before the test starts
export function setup() {
  console.log('Setting up load test...');

  // Create test users if they don't exist
  const responses = [];
  for (const user of testUsers) {
    const payload = JSON.stringify({
      email: user.email,
      password: user.password,
      firstName: 'Test',
      lastName: 'User',
      phone: '+221771234567',
      role: 'CLIENT'
    });

    const response = http.post(`${BASE_URL}/api/auth/register`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    responses.push(response);
  }

  return { testUsers };
}

// Main test function
export default function (data) {
  const user = data.testUsers[Math.floor(Math.random() * data.testUsers.length)];

  // Authentication
  const loginPayload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  const loginResponse = http.post(`${BASE_URL}/api/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginResponse, {
    'login status is 200': (r) => r.status === 200,
    'login response has token': (r) => r.json().data?.token,
  });

  if (loginResponse.status !== 200) {
    errorRate.add(1);
    return;
  }

  const token = loginResponse.json().data.token;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // Simulate user behavior
  const scenario = Math.random();

  if (scenario < 0.3) {
    // 30% - Search for providers (geolocation)
    const searchStart = new Date().getTime();

    const searchResponse = http.get(`${BASE_URL}/api/providers/map?lat=14.6937&lng=-17.4441&radius=10`, {
      headers,
    });

    const searchEnd = new Date().getTime();
    searchResponseTime.add(searchEnd - searchStart);

    const searchCheck = check(searchResponse, {
      'search status is 200': (r) => r.status === 200,
      'search has providers': (r) => r.json().data?.length >= 0,
      'search response time < 1000ms': (r) => r.timings.duration < 1000,
    });

    if (!searchCheck) {
      errorRate.add(1);
    }

  } else if (scenario < 0.6) {
    // 30% - Get user profile
    const profileResponse = http.get(`${BASE_URL}/api/auth/profile`, {
      headers,
    });

    check(profileResponse, {
      'profile status is 200': (r) => r.status === 200,
      'profile has user data': (r) => r.json().data?.email,
    }) || errorRate.add(1);

  } else if (scenario < 0.8) {
    // 20% - Get categories
    const categoriesResponse = http.get(`${BASE_URL}/api/categories`, {
      headers,
    });

    check(categoriesResponse, {
      'categories status is 200': (r) => r.status === 200,
      'categories has data': (r) => Array.isArray(r.json().data),
    }) || errorRate.add(1);

  } else {
    // 20% - Get bookings
    const bookingsResponse = http.get(`${BASE_URL}/api/bookings`, {
      headers,
    });

    check(bookingsResponse, {
      'bookings status is 200': (r) => r.status === 200,
      'bookings has pagination': (r) => r.json().data && r.json().pagination,
    }) || errorRate.add(1);
  }

  // Wait between requests (simulate user think time)
  sleep(Math.random() * 3 + 1); // 1-4 seconds
}

// Teardown function - runs after the test completes
export function teardown(data) {
  console.log('Load test completed!');
  console.log('Test users created:', data.testUsers.length);
}

// Handle summary - custom summary output
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'performance-report.json': JSON.stringify(data),
    'performance-summary.html': htmlReport(data),
  };
}

function textSummary(data, options) {
  return `
📊 KaayJob Load Test Results
═══════════════════════════════════════════════

Test Duration: ${data.metrics.duration.values.avg}ms
Total Requests: ${data.metrics.http_reqs.values.count}
Failed Requests: ${data.metrics.http_req_failed.values.rate * 100}%

Response Times:
  Average: ${Math.round(data.metrics.http_req_duration.values.avg)}ms
  95th percentile: ${Math.round(data.metrics.http_req_duration.values['p(95)'])}ms
  99th percentile: ${Math.round(data.metrics.http_req_duration.values['p(99)'])}ms

Search Performance:
  Average response time: ${Math.round(searchResponseTime.values.avg)}ms
  95th percentile: ${Math.round(searchResponseTime.values['p(95)'])}ms

Custom Metrics:
  Error rate: ${(errorRate.values.rate * 100).toFixed(2)}%

Thresholds:
  ${data.metrics.http_req_duration.thresholds['p(95)<500'].ok ? '✅' : '❌'} 95% of requests < 500ms
  ${data.metrics.http_req_failed.thresholds['rate<0.1'].ok ? '✅' : '❌'} Error rate < 10%
  ${data.metrics.errors.thresholds['rate<0.1'].ok ? '✅' : '❌'} Custom error rate < 10%
`;
}

function htmlReport(data) {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>KaayJob Performance Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .metric { background: #f5f5f5; padding: 20px; margin: 10px 0; border-radius: 5px; }
        .success { border-left: 5px solid #28a745; }
        .warning { border-left: 5px solid #ffc107; }
        .error { border-left: 5px solid #dc3545; }
        h1 { color: #007bff; }
        h2 { color: #6c757d; }
    </style>
</head>
<body>
    <h1>🚀 KaayJob Performance Test Report</h1>

    <div class="metric success">
        <h2>📈 Global Metrics</h2>
        <p><strong>Test Duration:</strong> ${Math.round(data.metrics.duration.values.avg / 1000)}s</p>
        <p><strong>Total Requests:</strong> ${data.metrics.http_reqs.values.count}</p>
        <p><strong>Failed Requests:</strong> ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%</p>
    </div>

    <div class="metric ${data.metrics.http_req_duration.values['p(95)'] < 500 ? 'success' : 'warning'}">
        <h2>⚡ Response Times</h2>
        <p><strong>Average:</strong> ${Math.round(data.metrics.http_req_duration.values.avg)}ms</p>
        <p><strong>95th percentile:</strong> ${Math.round(data.metrics.http_req_duration.values['p(95)'])}ms</p>
        <p><strong>99th percentile:</strong> ${Math.round(data.metrics.http_req_duration.values['p(99)'])}ms</p>
    </div>

    <div class="metric ${searchResponseTime.values['p(95)'] < 1000 ? 'success' : 'warning'}">
        <h2>🔍 Search Performance</h2>
        <p><strong>Average:</strong> ${Math.round(searchResponseTime.values.avg)}ms</p>
        <p><strong>95th percentile:</strong> ${Math.round(searchResponseTime.values['p(95)'])}ms</p>
    </div>

    <div class="metric ${errorRate.values.rate < 0.1 ? 'success' : 'error'}">
        <h2>🚨 Error Rates</h2>
        <p><strong>HTTP Error Rate:</strong> ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%</p>
        <p><strong>Custom Error Rate:</strong> ${(errorRate.values.rate * 100).toFixed(2)}%</p>
    </div>
</body>
</html>
`;
}
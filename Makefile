# KaayJob - Tests Automation Makefile

.PHONY: help test test-backend test-frontend test-e2e test-performance test-security test-all clean install setup

# Default target
help:
	@echo "KaayJob Testing Commands:"
	@echo ""
	@echo "Backend Tests:"
	@echo "  make test-backend          # Run all backend tests"
	@echo "  make test-unit            # Run backend unit tests"
	@echo "  make test-integration     # Run backend integration tests"
	@echo "  make test-backend-coverage # Run backend tests with coverage"
	@echo ""
	@echo "Frontend Tests:"
	@echo "  make test-frontend        # Run all frontend tests"
	@echo "  make test-e2e             # Run E2E tests (Playwright)"
	@echo "  make test-e2e-ui          # Run E2E tests with UI"
	@echo "  make test-e2e-headed      # Run E2E tests in headed mode"
	@echo ""
	@echo "Performance & Security:"
	@echo "  make test-performance     # Run performance tests (k6)"
	@echo "  make test-security        # Run security tests (ZAP)"
	@echo ""
	@echo "Full Test Suite:"
	@echo "  make test-all             # Run complete test suite"
	@echo "  make test-ci              # Run tests for CI/CD"
	@echo ""
	@echo "Setup & Maintenance:"
	@echo "  make setup                # Setup test environment"
	@echo "  make install              # Install all dependencies"
	@echo "  make clean                # Clean test artifacts"

# Setup test environment
setup:
	@echo "Setting up test environment..."
	@docker-compose up -d postgres redis
	@sleep 5
	@cd backend && npm run db:init
	@echo "Test environment ready!"

# Install dependencies
install:
	@echo "Installing dependencies..."
	@cd backend && npm install
	@cd front && npm install
	@cd front && npx playwright install
	@echo "Dependencies installed!"

# Backend Tests
test-backend: test-unit test-integration

test-unit:
	@echo "Running backend unit tests..."
	@cd backend && npm run test:unit

test-integration:
	@echo "Running backend integration tests..."
	@cd backend && npm run test:integration

test-backend-coverage:
	@echo "Running backend tests with coverage..."
	@cd backend && npm run test:coverage

# Frontend Tests
test-frontend: test-e2e

test-e2e:
	@echo "Running E2E tests..."
	@cd front && npm run test

test-e2e-ui:
	@echo "Running E2E tests with UI..."
	@cd front && npm run test:ui

test-e2e-headed:
	@echo "Running E2E tests in headed mode..."
	@cd front && npm run test:headed

# Performance Tests (requires k6)
test-performance:
	@echo "Running performance tests..."
	@if command -v k6 >/dev/null 2>&1; then \
		k6 run tests/performance/load-test.js; \
	else \
		echo "k6 not installed. Install from https://k6.io/docs/get-started/installation/"; \
		exit 1; \
	fi

# Security Tests (requires OWASP ZAP)
test-security:
	@echo "Running security tests..."
	@if command -v zap.sh >/dev/null 2>&1; then \
		zap.sh -cmd -autorun tests/security/zap-policy.yml; \
	else \
		echo "OWASP ZAP not installed. Install from https://www.zaproxy.org/download/"; \
		exit 1; \
	fi

# Full Test Suite
test-all: setup test-backend test-frontend test-performance test-security
	@echo "All tests completed successfully! ✅"

test-ci: install
	@echo "Running CI/CD test suite..."
	@cd backend && npm run test:ci
	@cd front && npm run test:chromium
	@echo "CI/CD tests completed!"

# Clean test artifacts
clean:
	@echo "Cleaning test artifacts..."
	@rm -rf backend/coverage
	@rm -rf backend/test-results
	@rm -rf front/test-results
	@rm -rf front/playwright-report
	@docker-compose down -v 2>/dev/null || true
	@echo "Test artifacts cleaned!"

# Development helpers
dev-test-backend:
	@echo "Running backend tests in watch mode..."
	@cd backend && npm run test:watch

dev-test-frontend:
	@echo "Running frontend tests in watch mode..."
	@cd front && npx playwright test --watch

# Database helpers
db-reset:
	@echo "Resetting test database..."
	@cd backend && npm run db:init

db-seed:
	@echo "Seeding test database..."
	@cd backend && npm run db:seed

# Quick test commands
test-smoke:
	@echo "Running smoke tests..."
	@cd backend && npm run test:unit -- --testNamePattern="should create"
	@cd front && npx playwright test auth.spec.ts --project=chromium

test-critical:
	@echo "Running critical path tests..."
	@cd backend && npm run test:integration -- --testNamePattern="auth|geolocation"
	@cd front && npx playwright test auth.spec.ts geolocation.spec.ts --project=chromium

# Generate test reports
report-backend:
	@echo "Generating backend test report..."
	@cd backend && npm run test:coverage && open coverage/lcov-report/index.html

report-frontend:
	@echo "Generating frontend test report..."
	@cd front && npm run test:report

# Lint and format check
lint:
	@echo "Running linting..."
	@cd backend && npx eslint src/**/*.ts
	@cd front && npx eslint src/**/*.{ts,tsx}

format-check:
	@echo "Checking code formatting..."
	@cd backend && npx prettier --check src/**/*.ts
	@cd front && npx prettier --check src/**/*.{ts,tsx}

# Pre-commit checks
pre-commit: lint format-check test-smoke
	@echo "Pre-commit checks passed! ✅"

# Environment checks
check-env:
	@echo "Checking test environment..."
	@docker --version
	@node --version
	@npm --version
	@cd backend && npx prisma --version
	@cd front && npx playwright --version
	@echo "Environment check complete!"

# Load testing with different scenarios
load-test-small:
	@echo "Running small load test..."
	@k6 run -e LOAD_TEST_TYPE=small tests/performance/load-test.js

load-test-medium:
	@echo "Running medium load test..."
	@k6 run -e LOAD_TEST_TYPE=medium tests/performance/load-test.js

load-test-large:
	@echo "Running large load test..."
	@k6 run -e LOAD_TEST_TYPE=large tests/performance/load-test.js

# Stress testing
stress-test:
	@echo "Running stress test..."
	@k6 run -e TEST_TYPE=stress tests/performance/stress-test.js

# API testing
api-test:
	@echo "Running API contract tests..."
	@cd backend && npx supertest tests/integration/*.test.ts

# Visual regression testing
visual-test:
	@echo "Running visual regression tests..."
	@cd front && npx playwright test visual.spec.ts

# Accessibility testing
accessibility-test:
	@echo "Running accessibility tests..."
	@cd front && npx playwright test accessibility.spec.ts

# Cross-browser testing
cross-browser-test:
	@echo "Running cross-browser tests..."
	@cd front && npm run test:chromium && npm run test:firefox && npm run test:webkit

# Mobile testing
mobile-test:
	@echo "Running mobile tests..."
	@cd front && npm run test:mobile

# Performance monitoring
performance-monitor:
	@echo "Starting performance monitoring..."
	@k6 run --out json=performance-results.json tests/performance/monitor.js

# Default target shows help
.DEFAULT_GOAL := help

# Testing Guide

This document provides comprehensive instructions for running test cases in this project.

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

## Installation

1. Install dependencies:
```bash
npm install
```

## Running Tests

### 1. Run All Tests
```bash
npm test
```

### 2. Run Tests in Watch Mode
```bash
npm run test:watch
```

### 3. Run Tests with Coverage
```bash
npm run test:coverage
```

### 4. Run Specific Test File
```bash
npm test -- test/createPayment-comprehensive-fixed.test.ts
```

### 5. Run Tests with Verbose Output
```bash
npm test -- --verbose
```

### 6. Run Tests with Specific Pattern
```bash
npm test -- --testNamePattern="createPayment"
```

## Test Structure

### Test Files Organization
```
test/
├── createPayment-comprehensive-fixed.test.ts  # Main comprehensive test
├── getPayment-comprehensive.test.ts          # Get payment tests
├── getPayment.test.ts                        # Basic get payment tests
└── listPayments.test.ts                      # List payments tests
```

### Test Categories

#### **Payment Creation Tests**
- **File**: `createPayment-comprehensive-fixed.test.ts`
- **Purpose**: Tests all aspects of payment creation including validation, error handling, and success scenarios

#### **Payment Retrieval Tests**
- **File**: `getPayment-comprehensive.test.ts`
- **Purpose**: Tests retrieving payment details with various scenarios

#### **Payment Listing Tests**
- **File**: `listPayments.test.ts`
- **Purpose**: Tests listing multiple payments with filtering and pagination

## Environment Setup

### Local Testing
1. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

2. Run tests:
   ```bash
   npm test
   ```

### Environment Variables
For local testing, ensure you have the following environment variables set:
```bash
# Example .env.test file
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
DYNAMODB_ENDPOINT=http://localhost:8000
```

## Test Commands Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm test -- --verbose` | Run tests with detailed output |
| `npm test -- --testNamePattern="pattern"` | Run tests matching pattern |

## Troubleshooting

### Common Issues

1. **Tests failing due to missing dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Tests failing due to environment variables**
   - Check that all required environment variables are set
   - Use `.env.test` file for local testing

3. **Tests running slowly**
   - Use `--runInBand` flag for sequential test execution
   - Check for memory issues with large test suites

4. **Coverage not showing**
   ```bash
   npm run test:coverage
   ```

## Writing New Tests

### Test File Structure
```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup code
  });

  afterEach(() => {
    // Cleanup code
  });

  it('should do something specific', () => {
    // Test implementation
  });
});
```

### Best Practices
1. Use descriptive test names
2. Follow AAA pattern (Arrange, Act, Assert)
3. Keep tests independent
4. Use appropriate test data
5. Mock external dependencies

## CI/CD Testing

For automated testing in CI/CD pipelines:
```yaml
# Example GitHub Actions
- name: Run Tests
  run: npm test
- name: Run Coverage
  run: npm run test:coverage
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TypeScript Testing Guide](https://jestjs.io/docs/getting-started#using-typescript)
- [AWS SDK Mocking Guide](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/unit-testing.html)

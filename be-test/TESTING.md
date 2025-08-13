# Quick Testing Guide

## Quick Start
```bash
npm install
npm test
```

## Commands
- `npm test` - Run all tests
- `npm run test:watch` - Watch mode
- `npm run test:coverage` - With coverage

## Test Files
- `createPayment-comprehensive-fixed.test.ts` - Main test suite
- `getPayment-comprehensive.test.ts` - Get payment tests
- `listPayments.test.ts` - List payments tests

## Run Specific Test
```bash
npm test -- test/createPayment-comprehensive-fixed.test.ts

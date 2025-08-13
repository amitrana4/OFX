// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
    PAYMENT_ID_REQUIRED: 'Payment ID is required',
    PAYMENT_NOT_FOUND: 'Payment not found',
    VALIDATION_FAILED: 'Validation failed',
    INTERNAL_SERVER_ERROR: 'Internal server error',
};

// Validation Messages
export const VALIDATION_MESSAGES = {
    AMOUNT_REQUIRED: 'amount is required',
    AMOUNT_INVALID: 'amount must be a valid number',
    CURRENCY_REQUIRED: 'currency is required',
    CURRENCY_STRING: 'currency must be a string',
    CURRENCY_LENGTH: 'currency must be a 3-character code',
};

// AWS Configuration
export const AWS_CONFIG = {
    REGION: process.env.AWS_REGION || 'us-east-1',
    TEST_ACCESS_KEY: process.env.AWS_ACCESS_KEY || 'fakeaccesskey123',
    TEST_SECRET_KEY: process.env.AWS_SECRET_KEY || 'fakesecretkey456',
    LOCAL_ENDPOINT: 'http://localhost:8000',
    LOCAL_REGION: process.env.AWS_REGION || 'local',
};

// CORS Headers
export const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};

// Environment Variables
export const ENV = {
    TEST: 'test',
    AWS_REGION: 'us-east-1',
    AWS_ACCESS_KEY: 'fakeaccesskey123',
    AWS_SECRET_KEY: 'fakesecretkey456',
    NODE_ENV: 'test',
};
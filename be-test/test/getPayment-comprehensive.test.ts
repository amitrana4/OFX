import * as payments from '../src/lib/payments';
import { randomUUID } from 'crypto';
import { handler } from '../src/getPayment';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('getPayment handler - comprehensive tests', () => {
    let getPaymentMock: jest.SpyInstance;

    beforeEach(() => {
        getPaymentMock = jest.spyOn(payments, 'getPayment');
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe('successful cases', () => {
        it('should return payment when found', async () => {
            const paymentId = randomUUID();
            const mockPayment = {
                id: paymentId,
                currency: 'AUD',
                amount: 2000,
            };
            getPaymentMock.mockResolvedValueOnce(mockPayment);

            const result = await handler({
                pathParameters: { id: paymentId },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toEqual(mockPayment);
            expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
        });

        it('should handle different currencies', async () => {
            const paymentId = randomUUID();
            const mockPayment = {
                id: paymentId,
                currency: 'USD',
                amount: 1500,
            };
            getPaymentMock.mockResolvedValueOnce(mockPayment);

            const result = await handler({
                pathParameters: { id: paymentId },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toEqual(mockPayment);
        });

        it('should handle zero amount', async () => {
            const paymentId = randomUUID();
            const mockPayment = {
                id: paymentId,
                currency: 'EUR',
                amount: 0,
            };
            getPaymentMock.mockResolvedValueOnce(mockPayment);

            const result = await handler({
                pathParameters: { id: paymentId },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toEqual(mockPayment);
        });

        it('should handle decimal amounts', async () => {
            const paymentId = randomUUID();
            const mockPayment = {
                id: paymentId,
                currency: 'GBP',
                amount: 99.99,
            };
            getPaymentMock.mockResolvedValueOnce(mockPayment);

            const result = await handler({
                pathParameters: { id: paymentId },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toEqual(mockPayment);
        });

        it('should handle negative amounts', async () => {
            const paymentId = randomUUID();
            const mockPayment = {
                id: paymentId,
                currency: 'JPY',
                amount: -500,
            };
            getPaymentMock.mockResolvedValueOnce(mockPayment);

            const result = await handler({
                pathParameters: { id: paymentId },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toEqual(mockPayment);
        });
    });

    describe('error cases', () => {
        it('should return 404 when payment is not found', async () => {
            const paymentId = randomUUID();
            getPaymentMock.mockResolvedValueOnce(null);

            const result = await handler({
                pathParameters: { id: paymentId },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(404);
            expect(JSON.parse(result.body)).toEqual({ error: 'Payment not found' });
            expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
        });

        it('should return 400 when payment ID is missing', async () => {
            const result = await handler({
                pathParameters: {},
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(400);
            expect(JSON.parse(result.body)).toEqual({ error: 'Payment ID is required' });
        });

        it('should return 400 when pathParameters is undefined', async () => {
            const result = await handler({
                pathParameters: undefined,
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(400);
            expect(JSON.parse(result.body)).toEqual({ error: 'Payment ID is required' });
        });

        it('should return 400 when payment ID is empty string', async () => {
            const result = await handler({
                pathParameters: { id: '' },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(400);
            expect(JSON.parse(result.body)).toEqual({ error: 'Payment ID is required' });
        });

        it('should handle database errors gracefully', async () => {
            const paymentId = randomUUID();
            getPaymentMock.mockRejectedValueOnce(new Error('Database connection failed'));

            const result = await handler({
                pathParameters: { id: paymentId },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(500);
            expect(JSON.parse(result.body)).toEqual({ error: 'Internal server error' });
            expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
        });

        it('should handle network errors', async () => {
            const paymentId = randomUUID();
            getPaymentMock.mockRejectedValueOnce(new Error('Network timeout'));

            const result = await handler({
                pathParameters: { id: paymentId },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(500);
            expect(JSON.parse(result.body)).toEqual({ error: 'Internal server error' });
        });
    });

    describe('edge cases', () => {
        it('should handle very large payment IDs', async () => {
            const paymentId = 'a'.repeat(1000);
            const mockPayment = {
                id: paymentId,
                currency: 'USD',
                amount: 1000,
            };
            getPaymentMock.mockResolvedValueOnce(mockPayment);

            const result = await handler({
                pathParameters: { id: paymentId },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toEqual(mockPayment);
        });

        it('should handle special characters in payment ID', async () => {
            const paymentId = 'test-id-with-special-chars_123-ABC';
            const mockPayment = {
                id: paymentId,
                currency: 'EUR',
                amount: 750,
            };
            getPaymentMock.mockResolvedValueOnce(mockPayment);

            const result = await handler({
                pathParameters: { id: paymentId },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            expect(JSON.parse(result.body)).toEqual(mockPayment);
        });
    });
});

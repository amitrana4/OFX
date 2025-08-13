import * as payments from '../src/lib/payments';
import { handler } from '../src/listPayments';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { Payment } from '../src/types/payment';

describe('listPayments handler - comprehensive tests', () => {
    let listPaymentsMock: jest.SpyInstance;

    beforeEach(() => {
        listPaymentsMock = jest.spyOn(payments, 'listPayments');
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe('successful cases', () => {
        it('should return all payments when no currency filter is provided', async () => {
            const mockPayments: Payment[] = [
                { id: 'payment-1', currency: 'USD', amount: 1000 },
                { id: 'payment-2', currency: 'EUR', amount: 2000 },
                { id: 'payment-3', currency: 'GBP', amount: 1500 },
            ];
            listPaymentsMock.mockResolvedValueOnce(mockPayments);

            const result = await handler({
                queryStringParameters: {},
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            const response = JSON.parse(result.body);
            expect(response.data).toEqual(mockPayments);
            expect(response.data).toHaveLength(3);
            expect(listPaymentsMock).toHaveBeenCalledWith(undefined);
        });

        it('should return empty array when no payments exist', async () => {
            const mockPayments: Payment[] = [];
            listPaymentsMock.mockResolvedValueOnce(mockPayments);

            const result = await handler({
                queryStringParameters: {},
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            const response = JSON.parse(result.body);
            expect(response.data).toEqual([]);
            expect(response.data).toHaveLength(0);
        });

        it('should filter payments by currency (USD)', async () => {
            const mockPayments = [
                { id: 'payment-1', currency: 'USD', amount: 1000 },
                { id: 'payment-4', currency: 'USD', amount: 2500 },
            ];
            listPaymentsMock.mockResolvedValueOnce(mockPayments);

            const result = await handler({
                queryStringParameters: { currency: 'USD' },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            const response = JSON.parse(result.body);
            expect(response.data).toEqual(mockPayments);
            expect(response.data).toHaveLength(2);
            expect(listPaymentsMock).toHaveBeenCalledWith('USD');
        });

        it('should filter payments by currency (EUR)', async () => {
            const mockPayments = [
                { id: 'payment-2', currency: 'EUR', amount: 2000 },
                { id: 'payment-5', currency: 'EUR', amount: 3000 },
                { id: 'payment-6', currency: 'EUR', amount: 4500 },
            ];
            listPaymentsMock.mockResolvedValueOnce(mockPayments);

            const result = await handler({
                queryStringParameters: { currency: 'EUR' },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            const response = JSON.parse(result.body);
            expect(response.data).toEqual(mockPayments);
            expect(response.data).toHaveLength(3);
            expect(listPaymentsMock).toHaveBeenCalledWith('EUR');
        });

        it('should handle lowercase currency codes', async () => {
            const mockPayments = [
                { id: 'payment-1', currency: 'USD', amount: 1000 },
            ];
            listPaymentsMock.mockResolvedValueOnce(mockPayments);

            const result = await handler({
                queryStringParameters: { currency: 'usd' },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            const response = JSON.parse(result.body);
            expect(response.data).toEqual(mockPayments);
            expect(listPaymentsMock).toHaveBeenCalledWith('USD');
        });

        it('should handle mixed case currency codes', async () => {
            const mockPayments = [
                { id: 'payment-1', currency: 'GBP', amount: 1500 },
            ];
            listPaymentsMock.mockResolvedValueOnce(mockPayments);

            const result = await handler({
                queryStringParameters: { currency: 'gBp' },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            const response = JSON.parse(result.body);
            expect(response.data).toEqual(mockPayments);
            expect(listPaymentsMock).toHaveBeenCalledWith('GBP');
        });

        it('should return empty array when no payments match currency filter', async () => {
            const mockPayments: Payment[] = [];
            listPaymentsMock.mockResolvedValueOnce(mockPayments);

            const result = await handler({
                queryStringParameters: { currency: 'JPY' },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            const response = JSON.parse(result.body);
            expect(response.data).toEqual([]);
            expect(response.data).toHaveLength(0);
            expect(listPaymentsMock).toHaveBeenCalledWith('JPY');
        });

        it('should handle various currency codes', async () => {
            const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'];
            
            for (const currency of currencies) {
                const mockPayments = [
                    { id: `payment-${currency}`, currency, amount: 1000 },
                ];
                listPaymentsMock.mockResolvedValueOnce(mockPayments);

                const result = await handler({
                    queryStringParameters: { currency },
                } as unknown as APIGatewayProxyEvent);

                expect(result.statusCode).toBe(200);
                const response = JSON.parse(result.body);
                expect(response.data[0].currency).toBe(currency);
                expect(listPaymentsMock).toHaveBeenCalledWith(currency);
                
                jest.clearAllMocks();
            }
        });
    });

    describe('edge cases', () => {
        it('should handle empty string currency parameter', async () => {
            const mockPayments = [
                { id: 'payment-1', currency: 'USD', amount: 1000 },
                { id: 'payment-2', currency: 'EUR', amount: 2000 },
            ];
            listPaymentsMock.mockResolvedValueOnce(mockPayments);

            const result = await handler({
                queryStringParameters: { currency: '' },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            const response = JSON.parse(result.body);
            expect(response.data).toEqual(mockPayments);
            expect(listPaymentsMock).toHaveBeenCalledWith('');
        });

        it('should handle null queryStringParameters', async () => {
            const mockPayments = [
                { id: 'payment-1', currency: 'USD', amount: 1000 },
            ];
            listPaymentsMock.mockResolvedValueOnce(mockPayments);

            const result = await handler({
                queryStringParameters: null,
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            const response = JSON.parse(result.body);
            expect(response.data).toEqual(mockPayments);
            expect(listPaymentsMock).toHaveBeenCalledWith(undefined);
        });

        it('should handle undefined queryStringParameters', async () => {
            const mockPayments = [
                { id: 'payment-1', currency: 'USD', amount: 1000 },
            ];
            listPaymentsMock.mockResolvedValueOnce(mockPayments);

            const result = await handler({
                queryStringParameters: undefined,
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            const response = JSON.parse(result.body);
            expect(response.data).toEqual(mockPayments);
            expect(listPaymentsMock).toHaveBeenCalledWith(undefined);
        });

        it('should handle numeric currency values', async () => {
            const mockPayments: Payment[] = [];
            listPaymentsMock.mockResolvedValueOnce(mockPayments);

            const result = await handler({
                queryStringParameters: { currency: '123' as any },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            const response = JSON.parse(result.body);
            expect(response.data).toEqual([]);
            expect(listPaymentsMock).toHaveBeenCalledWith('123');
        });

        it('should handle special characters in currency', async () => {
            const mockPayments: Payment[] = [];
            listPaymentsMock.mockResolvedValueOnce(mockPayments);

            const result = await handler({
                queryStringParameters: { currency: 'US$' },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            const response = JSON.parse(result.body);
            expect(response.data).toEqual([]);
            expect(listPaymentsMock).toHaveBeenCalledWith('US$');
        });
    });

    describe('error handling', () => {
        it('should handle database errors gracefully', async () => {
            listPaymentsMock.mockRejectedValueOnce(new Error('Database connection failed'));

            const result = await handler({
                queryStringParameters: {},
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(500);
            expect(JSON.parse(result.body)).toEqual({ error: 'Internal server error' });
        });

        it('should handle network timeout errors', async () => {
            listPaymentsMock.mockRejectedValueOnce(new Error('Network timeout'));

            const result = await handler({
                queryStringParameters: { currency: 'USD' },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(500);
            expect(JSON.parse(result.body)).toEqual({ error: 'Internal server error' });
        });

        it('should handle DynamoDB throttling errors', async () => {
            listPaymentsMock.mockRejectedValueOnce(new Error('ProvisionedThroughputExceededException'));

            const result = await handler({
                queryStringParameters: { currency: 'EUR' },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(500);
            expect(JSON.parse(result.body)).toEqual({ error: 'Internal server error' });
        });
    });

    describe('response format', () => {
        it('should return correct response structure', async () => {
            const mockPayments = [
                { id: 'payment-1', currency: 'USD', amount: 1000 },
                { id: 'payment-2', currency: 'EUR', amount: 2000 },
            ];
            listPaymentsMock.mockResolvedValueOnce(mockPayments);

            const result = await handler({
                queryStringParameters: {},
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            expect(result.headers).toEqual({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            });
            const response = JSON.parse(result.body);
            expect(response).toHaveProperty('data');
            expect(Array.isArray(response.data)).toBe(true);
        });

        it('should handle single payment in response', async () => {
            const mockPayments = [
                { id: 'single-payment', currency: 'USD', amount: 5000 },
            ];
            listPaymentsMock.mockResolvedValueOnce(mockPayments);

            const result = await handler({
                queryStringParameters: { currency: 'USD' },
            } as unknown as APIGatewayProxyEvent);

            expect(result.statusCode).toBe(200);
            const response = JSON.parse(result.body);
            expect(response.data).toHaveLength(1);
            expect(response.data[0]).toEqual(mockPayments[0]);
        });
    });
});

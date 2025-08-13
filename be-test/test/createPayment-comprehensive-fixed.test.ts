import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../src/createPayment';
import { createPayment } from '../src/lib/payments';
import { v4 as uuidv4 } from 'uuid';

// Mock the payments module
jest.mock('../src/lib/payments', () => ({
  createPayment: jest.fn(),
}));

// Mock the uuid module
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('createPayment handler - comprehensive fixed tests', () => {
  const mockCreatePayment = createPayment as jest.Mock;
  const mockUuid = uuidv4 as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('successful cases', () => {
    it('should create a payment successfully with valid input', async () => {
      const paymentId = 'test-payment-id-123';
      mockUuid.mockReturnValue(paymentId);
      mockCreatePayment.mockResolvedValue(undefined);

      const event = {
        body: JSON.stringify({
          amount: 1000,
          currency: 'USD',
        }),
      } as APIGatewayProxyEvent;

      const result = await handler(event);

      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body)).toEqual({ result: paymentId });
      expect(mockCreatePayment).toHaveBeenCalledWith({
        id: paymentId,
        amount: 1000,
        currency: 'USD',
      });
    });

    it('should create a payment with different currencies', async () => {
      const paymentId = 'test-payment-id-456';
      mockUuid.mockReturnValue(paymentId);
      mockCreatePayment.mockResolvedValue(undefined);

      const event = {
        body: JSON.stringify({
          amount: 2500,
          currency: 'EUR',
        }),
      } as APIGatewayProxyEvent;

      const result = await handler(event);

      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body)).toEqual({ result: paymentId });
      expect(mockCreatePayment).toHaveBeenCalledWith({
        id: paymentId,
        amount: 2500,
        currency: 'EUR',
      });
    });

    it('should handle zero amount', async () => {
      const paymentId = 'test-payment-id-zero';
      mockUuid.mockReturnValue(paymentId);
      mockCreatePayment.mockResolvedValue(undefined);

      const event = {
        body: JSON.stringify({
          amount: 0,
          currency: 'GBP',
        }),
      } as APIGatewayProxyEvent;

      const result = await handler(event);

      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body)).toEqual({ result: paymentId });
      expect(mockCreatePayment).toHaveBeenCalledWith({
        id: paymentId,
        amount: 0,
        currency: 'GBP',
      });
    });

    it('should handle decimal amounts', async () => {
      const paymentId = 'test-payment-id-decimal';
      mockUuid.mockReturnValue(paymentId);
      mockCreatePayment.mockResolvedValue(undefined);

      const event = {
        body: JSON.stringify({
          amount: 99.99,
          currency: 'JPY',
        }),
      } as APIGatewayProxyEvent;

      const result = await handler(event);

      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body)).toEqual({ result: paymentId });
      expect(mockCreatePayment).toHaveBeenCalledWith({
        id: paymentId,
        amount: 99.99,
        currency: 'JPY',
      });
    });
  });

  describe('validation error cases', () => {
    it('should return 422 for negative amount', async () => {
      const event = {
        body: JSON.stringify({
          amount: -500,
          currency: 'AUD',
        }),
      } as APIGatewayProxyEvent;

      const result = await handler(event);

      expect(result.statusCode).toBe(422);
      expect(JSON.parse(result.body)).toEqual({
        error: 'Validation failed',
        details: ['Amount must be positive'],
      });
    });

    it('should return 422 for empty body', async () => {
      const event = {
        body: '{}',
      } as APIGatewayProxyEvent;

      const result = await handler(event);

        expect(result.statusCode).toBe(422);
        expect(JSON.parse(result.body)).toEqual({
          error: 'Validation failed',
          details: ['amount is required', 'currency is required'],
        });
    });

    it('should return 422 for missing body', async () => {
      const event = {} as APIGatewayProxyEvent;

      const result = await handler(event);

      expect(result.statusCode).toBe(422);
      expect(JSON.parse(result.body)).toEqual({
        error: 'Invalid request body',
      });
    });

    it('should return 422 for invalid JSON', async () => {
      const event = {
        body: 'invalid json',
      } as APIGatewayProxyEvent;

      const result = await handler(event);

      expect(result.statusCode).toBe(422);
      expect(JSON.parse(result.body)).toEqual({
        error: 'Invalid request body',
      });
    });

    it('should return 422 for missing amount', async () => {
      const event = {
        body: JSON.stringify({
          currency: 'USD',
        }),
      } as APIGatewayProxyEvent;

      const result = await handler(event);

        expect(result.statusCode).toBe(422);
        expect(JSON.parse(result.body)).toEqual({
          error: 'Validation failed',
          details: ['amount is required'],
        });
    });

    it('should return 422 for missing currency', async () => {
      const event = {
        body: JSON.stringify({
          amount: 1000,
        }),
      } as APIGatewayProxyEvent;

      const result = await handler(event);

        expect(result.statusCode).toBe(422);
        expect(JSON.parse(result.body)).toEqual({
          error: 'Validation failed',
          details: ['currency is required'],
        });
    });

    it('should return 422 for invalid currency format', async () => {
      const event = {
        body: JSON.stringify({
          amount: 1000,
          currency: 'US',
        }),
      } as APIGatewayProxyEvent;

      const result = await handler(event);

        expect(result.statusCode).toBe(422);
        expect(JSON.parse(result.body)).toEqual({
          error: 'Validation failed',
          details: ['currency must be a 3-character code'],
        });
    });
  });

  describe('database error cases', () => {
    it('should return 500 when createPayment throws an error', async () => {
      const event = {
        body: JSON.stringify({
          amount: 1000,
          currency: 'USD',
        }),
      } as APIGatewayProxyEvent;

      mockCreatePayment.mockRejectedValue(new Error('Database connection failed'));

      await expect(handler(event)).rejects.toThrow('Database connection failed');
    });
  });
});

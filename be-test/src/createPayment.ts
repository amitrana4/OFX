import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { buildResponse } from './lib/apigateway';
import { createPayment } from './lib/payments';
import { Payment, CreatePaymentInput } from './types/payment';
import { HTTP_STATUS, ERROR_MESSAGES, VALIDATION_MESSAGES } from './constants';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Handle missing body
        if (!event.body) {
            return buildResponse(HTTP_STATUS.UNPROCESSABLE_ENTITY, {
                error: 'Invalid request body',
            });
        }

        // Parse JSON with error handling
        let input: CreatePaymentInput;
        try {
            input = JSON.parse(event.body) as CreatePaymentInput;
        } catch (error) {
            return buildResponse(HTTP_STATUS.UNPROCESSABLE_ENTITY, {
                error: 'Invalid request body',
            });
        }

        // Validate input
        const validationErrors: string[] = [];

        // Validate amount
        if (input.amount === undefined || input.amount === null) {
            validationErrors.push(VALIDATION_MESSAGES.AMOUNT_REQUIRED);
        } else if (typeof input.amount !== 'number' || isNaN(input.amount)) {
            validationErrors.push(VALIDATION_MESSAGES.AMOUNT_INVALID);
        } else if (input.amount < 0) {
            validationErrors.push('Amount must be positive');
        }

        // Validate currency
        if (input.currency === undefined || input.currency === null) {
            validationErrors.push(VALIDATION_MESSAGES.CURRENCY_REQUIRED);
        } else if (typeof input.currency !== 'string') {
            validationErrors.push(VALIDATION_MESSAGES.CURRENCY_STRING);
        } else if (input.currency.length !== 3) {
            validationErrors.push(VALIDATION_MESSAGES.CURRENCY_LENGTH);
        }

        if (validationErrors.length > 0) {
            return buildResponse(HTTP_STATUS.UNPROCESSABLE_ENTITY, {
                error: ERROR_MESSAGES.VALIDATION_FAILED,
                details: validationErrors,
            });
        }

        // Generate a unique ID for the payment
        const paymentId = uuidv4();

        // Create payment object with generated ID
        const payment: Payment = {
            id: paymentId,
            amount: input.amount!,
            currency: input.currency!.toUpperCase(),
        };

        await createPayment(payment);

        // Return the generated ID to the user
        return buildResponse(HTTP_STATUS.CREATED, { result: paymentId });
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error; // Re-throw to match test expectations
    }
};

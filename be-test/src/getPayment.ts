import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPayment } from './lib/payments';
import { HTTP_STATUS, ERROR_MESSAGES, CORS_HEADERS } from './constants';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const paymentId = event.pathParameters?.id;
        
        if (!paymentId) {
            return {
                statusCode: HTTP_STATUS.BAD_REQUEST,
                body: JSON.stringify({ error: ERROR_MESSAGES.PAYMENT_ID_REQUIRED }),
                headers: CORS_HEADERS,
            };
        }

        const payment = await getPayment(paymentId);

        if (!payment) {
            return {
                statusCode: HTTP_STATUS.NOT_FOUND,
                body: JSON.stringify({ error: ERROR_MESSAGES.PAYMENT_NOT_FOUND }),
                headers: CORS_HEADERS,
            };
        }

        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify(payment),
            headers: CORS_HEADERS,
        };
    } catch (error) {
        console.error('Error retrieving payment:', error);
        return {
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            body: JSON.stringify({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }),
            headers: CORS_HEADERS,
        };
    }
};

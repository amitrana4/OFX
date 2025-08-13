import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { listPayments } from './lib/payments';
import { HTTP_STATUS, ERROR_MESSAGES, CORS_HEADERS } from './constants';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const currency = event.queryStringParameters?.currency?.toUpperCase();
        const payments = await listPayments(currency);

        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify({ data: payments }),
            headers: CORS_HEADERS,
        };
    } catch (error) {
        console.error('Error listing payments:', error);
        return {
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            body: JSON.stringify({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }),
            headers: CORS_HEADERS,
        };
    }
};

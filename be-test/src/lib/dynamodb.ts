import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const isTest = (process.env.NODE_ENV || '').toLowerCase() === 'test';

// Environment-aware configuration using only specified environment variables
const getConfig = () => {
    const region = process.env.AWS_REGION || 'us-east-1';
    const accessKeyId = process.env.AWS_ACCESS_KEY || 'fakeaccesskey123';
    const secretAccessKey = process.env.AWS_SECRET_KEY || 'fakesecretkey456';
    const endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';

    return {
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
        endpoint,
        sslEnabled: false,
    };
};

export const DynamoDB = new DynamoDBClient(getConfig());
export const DocumentClient = DynamoDBDocumentClient.from(DynamoDB);

/**
 * API Gateway and Lambda event types
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export interface LambdaHandler {
  (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

export interface ErrorResponse {
  error: string;
  details?: string[];
}

export interface SuccessResponse<T> {
  result?: T;
  data?: T;
}

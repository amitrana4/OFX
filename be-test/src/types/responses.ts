/**
 * API response interfaces for consistent response structures
 */

import { Payment } from './payment';

export interface CreatePaymentResponse {
  result: string;
}

export interface GetPaymentResponse extends Payment {}

export interface ListPaymentsResponse {
  data: Payment[];
}

export interface ErrorResponse {
  error: string;
  details?: string[];
}

export interface ValidationErrorResponse extends ErrorResponse {
  details: string[];
}

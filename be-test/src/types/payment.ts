/**
 * Payment entity types and interfaces
 */

export interface Payment {
  id: string;
  amount: number;
  currency: string;
}

export interface CreatePaymentInput {
  amount?: number;
  currency?: string;
}

export interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
}

export interface PaymentListResponse {
  data: Payment[];
}

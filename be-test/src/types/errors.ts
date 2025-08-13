/**
 * Error handling types and interfaces
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  details?: string[];
}

export interface DatabaseError extends ApiError {
  operation: string;
  table: string;
}

export interface ValidationErrors {
  errors: ValidationError[];
}

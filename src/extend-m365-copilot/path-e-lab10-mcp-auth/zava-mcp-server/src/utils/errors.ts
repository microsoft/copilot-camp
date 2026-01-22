/**
 * Centralized custom error classes for the Zava Claims Operations API
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ClaimNotFoundError extends Error {
  constructor(claimNumber: string) {
    super(`Claim ${claimNumber} not found`);
    this.name = 'ClaimNotFoundError';
  }
}

export class InspectionNotFoundError extends Error {
  constructor(taskId: string) {
    super(`Inspection task ${taskId} not found`);
    this.name = 'InspectionNotFoundError';
  }
}

export class ContractorNotFoundError extends Error {
  constructor(contractorId: string) {
    super(`Contractor ${contractorId} not found`);
    this.name = 'ContractorNotFoundError';
  }
}

export class PurchaseOrderNotFoundError extends Error {
  constructor(poId: string) {
    super(`Purchase order ${poId} not found`);
    this.name = 'PurchaseOrderNotFoundError';
  }
}



/**
 * Type guard to check if an error is one of our custom error types
 */
export function isCustomError(error: unknown): error is ValidationError | ClaimNotFoundError | InspectionNotFoundError | ContractorNotFoundError | PurchaseOrderNotFoundError {
  return error instanceof ValidationError || 
         error instanceof ClaimNotFoundError ||
         error instanceof InspectionNotFoundError ||
         error instanceof ContractorNotFoundError ||
         error instanceof PurchaseOrderNotFoundError;
}
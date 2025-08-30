
export enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

export enum Classification {
  Cat = 'Cat',
  Dog = 'Dog',
  Unknown = 'Unknown'
}

export interface ClassificationResult {
  classification: Classification;
  confidence: number;
  features: string[];
}

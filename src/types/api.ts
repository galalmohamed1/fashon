export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

export interface NewsletterSubscriptionRequest {
  email: string;
}

export interface PromoValidationResponse {
  valid: boolean;
  code: string;
  discountPercent: number;
  message: string;
}

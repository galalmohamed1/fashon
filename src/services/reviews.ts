import { Review, ApiResponse } from '../types';

export async function submitProductReview(
  productId: string,
  reviewData: Omit<Review, 'id' | 'date'>
): Promise<ApiResponse<Review>> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const newReview: Review = {
    ...reviewData,
    id: `rev_${Math.random().toString(36).substring(2, 9)}`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  return {
    success: true,
    data: newReview,
    message: 'REVIEW SUBMITTED TO ARCHIVE EDITORIAL',
    timestamp: new Date().toISOString()
  };
}

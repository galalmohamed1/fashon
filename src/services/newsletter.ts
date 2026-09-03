import { ApiResponse } from '../types';

export async function subscribeNewsletter(email: string): Promise<ApiResponse<{ subscribed: boolean }>> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!valid) {
    return {
      success: false,
      data: { subscribed: false },
      message: 'PLEASE PROVIDE A VALID EMAIL ADDRESS',
      timestamp: new Date().toISOString()
    };
  }

  return {
    success: true,
    data: { subscribed: true },
    message: 'WELCOME TO THE INNER CIRCLE. LOOKBOOK SENT.',
    timestamp: new Date().toISOString()
  };
}

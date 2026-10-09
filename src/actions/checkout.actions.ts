"use server";
import { ShippingAddress } from "@/types";
import { getAccessToken } from "@/types/utilities";

export async function addOrder(body: {
  shippingAddress: ShippingAddress;
  paymentMethod: "CashOnDelivery";
  couponCode?: string;
}): Promise<{ success: boolean; data?: unknown; message?: string }> {
  try {
    const token = await getAccessToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || data?.success === false) {
      console.error("addOrder failed:", res.status, data);
      return {
        success: false,
        message: data?.message || "Failed to place order",
      };
    }
    return { success: true, data: data?.data ?? data, message: data?.message };
  } catch (err) {
    console.error("addOrder error:", err);
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}
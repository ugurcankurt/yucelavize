"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/resend";
import OrderStatusUpdateEmail from "@/components/emails/order-status-update";
import * as React from "react";

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();
  
  // Optional: Check if user is admin here
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user || user.role !== 'admin') return { error: "Unauthorized" };

  const { data: order, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error || !order) {
    console.error("Order status update failed:", error);
    return { error: error?.message || "Order not found" };
  }

  // Send Email
  try {
    await resend.emails.send({
      from: "Yucel Avize <siparis@yucelavize.com>",
      to: order.customer_email,
      subject: `Sipariş Durumu Güncellendi (#${order.id.split("-")[0].toUpperCase()})`,
      react: React.createElement(OrderStatusUpdateEmail, {
        orderId: order.id,
        customerName: order.customer_name,
        status: order.status,
        trackingNumber: order.tracking_number,
        trackingUrl: order.tracking_url,
        shippingCompany: order.shipping_company,
      }),
    });
  } catch (err) {
    console.error("Status update email failed:", err);
  }

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function updateOrderCargo(
  orderId: string, 
  cargoData: { shipping_company?: string, tracking_number?: string, tracking_url?: string }
) {
  const supabase = await createClient();
  
  const { data: order, error } = await supabase
    .from("orders")
    .update({ 
      shipping_company: cargoData.shipping_company,
      tracking_number: cargoData.tracking_number,
      tracking_url: cargoData.tracking_url
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error || !order) {
    console.error("Order cargo update failed:", error);
    return { error: error?.message || "Order not found" };
  }

  // Send Email
  try {
    await resend.emails.send({
      from: "Yucel Avize <siparis@yucelavize.com>",
      to: order.customer_email,
      subject: `Kargo Bilgileriniz Güncellendi (#${order.id.split("-")[0].toUpperCase()})`,
      react: React.createElement(OrderStatusUpdateEmail, {
        orderId: order.id,
        customerName: order.customer_name,
        status: order.status,
        trackingNumber: order.tracking_number,
        trackingUrl: order.tracking_url,
        shippingCompany: order.shipping_company,
      }),
    });
  } catch (err) {
    console.error("Cargo update email failed:", err);
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { success: true };
}

import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";
import OrderConfirmationEmail from "@/components/emails/order-confirmation";
import AdminNewOrderEmail from "@/components/emails/admin-new-order";
import * as React from "react";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Fetch order to verify and get details
    // using maybeSingle because if the user just registered, RLS might take a second or the session might not be fully propagated to cookies yet
    // To be safe, if we had a service role key we'd use it, but standard client is fine for now
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq("id", orderId)
      .single();

    if (error || !order) {
      console.error("Order fetch error for email:", error);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Fetch bank info
    const { data: bankSettings } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "bank_info")
      .single();

    let banks: any[] = [];
    if (bankSettings?.value) {
      if (Array.isArray(bankSettings.value)) {
        banks = bankSettings.value;
      } else {
        banks = [bankSettings.value];
      }
    }

    const fromEmail = "siparis@yucelavize.com";
    const adminEmail = "siparis@yucelavize.com";

    // 1. Send to Customer
    const customerEmailResult = await resend.emails.send({
      from: `Yucel Avize <${fromEmail}>`,
      to: order.customer_email,
      subject: `Siparisiniz Alindi (#${order.id.split("-")[0].toUpperCase()})`,
      react: React.createElement(OrderConfirmationEmail, {
        orderId: order.id,
        customerName: order.customer_name,
        totalAmount: order.total_amount,
        couponCode: order.coupon_code,
        discountTotal: order.discount_total,
        paymentMethod: order.payment_method,
        banks: banks,
        items: order.order_items || [],
      }),
    });

    // 2. Send to Admin
    const adminEmailResult = await resend.emails.send({
      from: `Yucel Avize Sistem <${fromEmail}>`,
      to: adminEmail,
      subject: `Yeni Siparis: #${order.id.split("-")[0].toUpperCase()}`,
      react: React.createElement(AdminNewOrderEmail, {
        orderId: order.id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        totalAmount: order.total_amount,
        couponCode: order.coupon_code,
        discountTotal: order.discount_total,
        items: order.order_items || [],
      }),
    });

    return NextResponse.json({ 
      success: true, 
      customer: customerEmailResult, 
      admin: adminEmailResult 
    });
  } catch (error: any) {
    console.error("Email sending failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

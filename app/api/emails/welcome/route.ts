import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { WelcomeEmail } from "@/components/emails/welcome-email";
import * as React from "react";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Yücel Avize <siparis@yucelavize.com>",
      to: [email],
      subject: "Yücel Avize'ye Hoş Geldiniz!",
      react: WelcomeEmail({ customerName: name || email.split('@')[0] }) as React.ReactElement,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return NextResponse.json(
      { error: "Failed to send welcome email" },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server'
import { auth } from "@/auth"
import nodemailer from 'nodemailer'
import { LIMITS } from "@/lib/validation"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const session = await auth()
    const { reason, message } = await req.json()

    const reasonStr = typeof reason === "string" ? reason.trim().slice(0, LIMITS.SUPPORT_REASON_MAX_CHARS) : "";
    const messageStr = typeof message === "string" ? message.trim().slice(0, LIMITS.SUPPORT_MESSAGE_MAX_CHARS) : "";
    if (!messageStr) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "send.one.com",
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    })

    // Email content
    const replyTo = session?.user?.email && EMAIL_REGEX.test(String(session.user.email)) ? session.user.email : undefined;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "business@followerx.de",
      replyTo,
      subject: `HumanizeAi - Support: ${reasonStr || "General"}`,
      text: `Reason: ${reasonStr || "General"}\n\nUser: ${session?.user?.email ?? "Not logged in"}\n\nMessage:\n${messageStr}`,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Support request error:', error)
    return NextResponse.json(
      { error: 'Failed to send support request' },
      { status: 500 }
    )
  }
} 
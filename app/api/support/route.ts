import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { reason, message } = await req.json()

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "send.one.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
     tls: {
        rejectUnauthorized: false // Allows self-signed certificates
      }
    })

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "business@followerx.de",
      replyTo: session?.user?.email || undefined,
      subject: `HumanizeAi - Support: ${reason}`,
      text: `Reason: ${reason}
            
            User: ${session?.user?.email || 'Not logged in'}
            
            Message:
            ${message}
      `,
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
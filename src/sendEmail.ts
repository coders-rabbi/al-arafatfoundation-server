// import nodemailer from "nodemailer";
// import dns from "dns";

// // Node.js-কে বলে দাও IPv4 আগে ব্যবহার করতে
// dns.setDefaultResultOrder("ipv4first");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
//   connectionTimeout: 10000,
//   greetingTimeout: 10000,
//   socketTimeout: 10000,
// });

// export async function sendPasswordResetEmail(to: string, resetUILink: string) {
//   await transporter.sendMail({
//     from: "GenVoice <pcrabbi2020@gmail.com>",
//     to,
//     subject: "Password reset link. This link will vanish after 10 minutes.",
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
//         <h2 style="color: #111827;">Reset Your Password</h2>
//         <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
//           We received a request to reset your password. Click below to set a new one. This link expires in <strong>10 minutes</strong>.
//         </p>
//         <div style="text-align: center; margin: 32px 0;">
//           <a href="${resetUILink}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">
//             Reset Password
//           </a>
//         </div>
//         <p style="color: #9ca3af; font-size: 12px;">
//           If you didn't request this, you can safely ignore this email.
//         </p>
//       </div>
//     `,
//   });
// }

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to: string, resetUILink: string) {
  const { error } = await resend.emails.send({
    from: "GenVoice <onboarding@resend.dev>",
    to,
    subject: "Password reset link. This link will vanish after 10 minutes.",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #111827;">Reset Your Password</h2>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
          We received a request to reset your password. Click below to set a new one. This link expires in <strong>10 minutes</strong>.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUILink}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">
            Reset Password
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 12px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("RESEND ERROR:", error);
    throw new Error("Failed to send reset email");
  }
}

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'localhost',
  port: Number(process.env.SMTP_PORT ?? 1025),
  secure: false,
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

export const sendPasswordResetEmail = async (
  to: string,
  resetUrl: string
): Promise<void> => {
  const from = process.env.MAIL_FROM ?? 'no-reply@example.com';
  const subject = 'Reset your password';
  const html = `
    <p>You requested a password reset.</p>
    <p>Click the link below to set a new password. This link expires in 15 minutes.</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>If you did not request this, you can safely ignore this email.</p>
  `;
  await transporter.sendMail({ from, to, subject, html });
};

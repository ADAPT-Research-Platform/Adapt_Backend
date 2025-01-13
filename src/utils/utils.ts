import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next); // Pass errors to the error handler
  };

export function generateVerificationToken(userId: string): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationUrl = `${process.env.APP_URL}/api/users/verify-email?token=${token}`;
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL || 'adhikarb@students.uni-marburg.de',
    subject: 'Verify Your Email',
    html: `<p>Click the link to verify your email:</p>
           <a href="${verificationUrl}">Verify Email</a>`,
  };

  await sgMail.send(msg);
}

import { Resend } from 'resend';

// Use a fallback for build time / environment without key to prevent crashing
// Actual emails will only send if process.env.RESEND_API_KEY is valid.
const apiKey = process.env.RESEND_API_KEY || 're_dummy_key_for_build';
export const resend = new Resend(apiKey);

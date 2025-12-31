import { Router, Request, Response } from 'express';
import { sendEmail } from '../utils/email';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Send email to admin/support
    const emailSubject = `Contact Form: ${subject}`;
    const emailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Subject:</strong> ${subject}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    // Send to admin emails
    await sendEmail(
      ['tonyrenehan@gmail.com', 'farrellj18@gmail.com'],
      emailSubject,
      emailBody
    );

    // Send confirmation email to user
    const confirmationSubject = 'We received your message - IDeal.ie';
    const confirmationBody = `
      <h2>Thank you for contacting us!</h2>
      <p>Hi ${name},</p>
      <p>We've received your message and will get back to you as soon as possible, typically within 24 hours.</p>
      <p><strong>Your message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p>Best regards,<br>The IDeal.ie Team</p>
    `;

    await sendEmail(email, confirmationSubject, confirmationBody);

    res.json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;

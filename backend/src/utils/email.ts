import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendMessageNotificationParams {
  toEmail: string;
  toName: string;
  fromName: string;
  messageText: string;
  carTitle?: string;
  conversationUrl: string;
}

export async function sendMessageNotification({
  toEmail,
  toName,
  fromName,
  messageText,
  carTitle,
  conversationUrl,
}: SendMessageNotificationParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email notification');
    return null;
  }

  const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  
  try {
    const result = await resend.emails.send({
      from: `i-deal.ie <${fromEmail}>`,
      to: toEmail,
      replyTo: 'support@i-deal.ie',
      subject: carTitle 
        ? `New message about your ${carTitle}` 
        : 'You have a new message on IDeal.ie',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #1e1b4b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .message-box { background-color: white; padding: 20px; border-left: 4px solid #1e1b4b; margin: 20px 0; border-radius: 4px; }
              .button { display: inline-block; background-color: #1e1b4b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">IDeal.ie</h1>
                <p style="margin: 5px 0 0 0;">Ireland's Car Marketplace</p>
              </div>
              <div class="content">
                <h2>Hi ${toName},</h2>
                <p>You have a new message from <strong>${fromName}</strong>${carTitle ? ` about your listing: <strong>${carTitle}</strong>` : ''}.</p>
                
                <div class="message-box">
                  <p style="margin: 0; color: #4b5563;">"${messageText.length > 150 ? messageText.substring(0, 150) + '...' : messageText}"</p>
                </div>

                <p>
                  <a href="${conversationUrl}" class="button">View Message</a>
                </p>

                <p style="color: #6b7280; font-size: 14px;">Reply to ${fromName} directly on IDeal.ie to continue the conversation.</p>
              </div>
              <div class="footer">
                <p>This is an automated notification from IDeal.ie</p>
                <p>© ${new Date().getFullYear()} IDeal.ie - All rights reserved</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Hi ${toName},\n\nYou have a new message from ${fromName}${carTitle ? ` about your listing: ${carTitle}` : ''}.\n\n"${messageText}"\n\nView and reply: ${conversationUrl}\n\n---\nIDeal.ie - Ireland's Car Marketplace`,
    });

    console.log('✅ Email notification sent:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to send email notification:', error);
    return null;
  }
}

// Generic email sending function for contact forms, etc.
export async function sendEmail(to: string | string[], subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return null;
  }

  const fromEmail = process.env.EMAIL_FROM || 'noreply@i-deal.ie';
  
  try {
    const result = await resend.emails.send({
      from: `IDeal.ie <${fromEmail}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return null;
  }
}

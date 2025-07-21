import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

// Initialize Resend client
const resend = new Resend(RESEND_API_KEY);

export interface RegistrationEmailData {
  full_name: string;
  email: string;
  confirmation_url: string;
}

export interface PasswordResetEmailData {
  full_name: string;
  email: string;
  reset_url: string;
}

export interface ContactFormEmailData {
  subject: string;
  message: string;
  urgency: string;
  user_email: string;
  user_id: string;
  full_name: string;
}

/**
 * Email service for sending transactional emails via Resend
 */
export class EmailService {
  private static readonly FROM_EMAIL = 'DOBbie <noreply@dobbie-mail.ikbenlit.nl>';
  private static readonly ADMIN_EMAIL = 'talar@dobbie.nl';

  /**
   * Send registration confirmation email
   */
  static async sendRegistrationConfirmation(data: RegistrationEmailData): Promise<void> {
    const html = this.getRegistrationTemplate(data);
    
    await resend.emails.send({
      from: this.FROM_EMAIL,
      to: data.email,
      subject: 'Bevestig uw DOBbie account',
      html
    });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordReset(data: PasswordResetEmailData): Promise<void> {
    const html = this.getPasswordResetTemplate(data);
    
    await resend.emails.send({
      from: this.FROM_EMAIL,
      to: data.email,
      subject: 'Wachtwoord opnieuw instellen - DOBbie',
      html
    });
  }

  /**
   * Send contact form email to admin
   */
  static async sendContactForm(data: ContactFormEmailData): Promise<void> {
    const html = this.getContactFormTemplate(data);
    
    await resend.emails.send({
      from: this.FROM_EMAIL,
      to: this.ADMIN_EMAIL,
      subject: `[DOBbie Contact] ${data.subject}`,
      html,
      replyTo: data.user_email
    });
  }

  /**
   * Registration confirmation email template
   */
  private static getRegistrationTemplate(data: RegistrationEmailData): string {
    return `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bevestig uw DOBbie account</title>
      <style>
        body {
          font-family: 'Open Sans', Arial, sans-serif;
          line-height: 1.6;
          color: #3D3D3D;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #F5F2EB;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #771138;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #707070;
          font-size: 16px;
        }
        .content {
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background-color: #771138;
          color: #ffffff;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #5A0D29;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #E5E5E5;
          color: #707070;
          font-size: 14px;
        }
        .link {
          color: #771138;
          text-decoration: none;
        }
        .warning {
          background-color: #FFF3CD;
          border: 1px solid #F0C419;
          padding: 15px;
          border-radius: 5px;
          margin-top: 20px;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">DOBbie</div>
          <div class="subtitle">De Online Bedrijfsarts</div>
        </div>
        
        <div class="content">
          <h2>Welkom bij DOBbie, ${data.full_name}!</h2>
          
          <p>Bedankt voor uw registratie bij DOBbie - De Online Bedrijfsarts. Om uw account te activeren, klik op de onderstaande knop:</p>
          
          <div style="text-align: center;">
            <a href="${data.confirmation_url}" class="button">Account bevestigen</a>
          </div>
          
          <p>Na bevestiging kunt u direct beginnen met het stellen van vragen over:</p>
          <ul>
            <li>Verzuimbeleid en -procedures</li>
            <li>Werknemersrechten en -plichten</li>
            <li>Juridische aspecten van personeelszaken</li>
            <li>Communicatie met werknemers</li>
            <li>Actuele wet- en regelgeving</li>
          </ul>
          
          <div class="warning">
            <strong>Belangrijke opmerking:</strong> DOBbie geeft geen medische adviezen. Voor medische vragen verwijzen wij u altijd door naar een gekwalificeerde bedrijfsarts.
          </div>
        </div>
        
        <div class="footer">
          <p>Deze link is 24 uur geldig. Heeft u vragen? Neem contact op via <a href="mailto:support@dobbie.nl" class="link">support@dobbie.nl</a></p>
          <p>DOBbie - De Online Bedrijfsarts | Professioneel verzuimadvies 24/7</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Password reset email template
   */
  private static getPasswordResetTemplate(data: PasswordResetEmailData): string {
    return `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Wachtwoord opnieuw instellen - DOBbie</title>
      <style>
        body {
          font-family: 'Open Sans', Arial, sans-serif;
          line-height: 1.6;
          color: #3D3D3D;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #F5F2EB;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #771138;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #707070;
          font-size: 16px;
        }
        .content {
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background-color: #771138;
          color: #ffffff;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #5A0D29;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #E5E5E5;
          color: #707070;
          font-size: 14px;
        }
        .link {
          color: #771138;
          text-decoration: none;
        }
        .security-notice {
          background-color: #E8F4FD;
          border: 1px solid #B3D9F2;
          padding: 15px;
          border-radius: 5px;
          margin-top: 20px;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">DOBbie</div>
          <div class="subtitle">De Online Bedrijfsarts</div>
        </div>
        
        <div class="content">
          <h2>Wachtwoord opnieuw instellen</h2>
          
          <p>Hallo ${data.full_name},</p>
          
          <p>We hebben een verzoek ontvangen om uw wachtwoord opnieuw in te stellen voor uw DOBbie account. Klik op de onderstaande knop om een nieuw wachtwoord in te stellen:</p>
          
          <div style="text-align: center;">
            <a href="${data.reset_url}" class="button">Nieuw wachtwoord instellen</a>
          </div>
          
          <p>Als u dit verzoek niet heeft gedaan, kunt u deze e-mail veilig negeren. Uw wachtwoord blijft dan ongewijzigd.</p>
          
          <div class="security-notice">
            <strong>Beveiligingstip:</strong> Deel deze link nooit met anderen en gebruik altijd een sterk, uniek wachtwoord voor uw DOBbie account.
          </div>
        </div>
        
        <div class="footer">
          <p>Deze link is 1 uur geldig. Heeft u vragen? Neem contact op via <a href="mailto:support@dobbie.nl" class="link">support@dobbie.nl</a></p>
          <p>DOBbie - De Online Bedrijfsarts | Professioneel verzuimadvies 24/7</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Contact form email template for admin
   */
  private static getContactFormTemplate(data: ContactFormEmailData): string {
    const urgencyColor = data.urgency === 'high' ? '#dc3545' : data.urgency === 'medium' ? '#ffc107' : '#28a745';
    
    return `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nieuw contact formulier - DOBbie</title>
      <style>
        body {
          font-family: 'Open Sans', Arial, sans-serif;
          line-height: 1.6;
          color: #3D3D3D;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #F5F2EB;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #771138;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #707070;
          font-size: 16px;
        }
        .content {
          margin-bottom: 30px;
        }
        .info-box {
          background-color: #F8F9FA;
          border: 1px solid #E9ECEF;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .urgency-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          color: white;
          background-color: ${urgencyColor};
        }
        .message-box {
          background-color: #F5F2EB;
          border-left: 4px solid #771138;
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 5px 5px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #E5E5E5;
          color: #707070;
          font-size: 14px;
        }
        .info-row {
          margin-bottom: 10px;
        }
        .info-label {
          font-weight: bold;
          color: #771138;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">DOBbie</div>
          <div class="subtitle">Contact Formulier</div>
        </div>
        
        <div class="content">
          <h2>Nieuw contact formulier ontvangen</h2>
          
          <div class="info-box">
            <div class="info-row">
              <span class="info-label">Van:</span> ${data.full_name} (${data.user_email})
            </div>
            <div class="info-row">
              <span class="info-label">Gebruiker ID:</span> ${data.user_id}
            </div>
            <div class="info-row">
              <span class="info-label">Onderwerp:</span> ${data.subject}
            </div>
            <div class="info-row">
              <span class="info-label">Urgentie:</span> 
              <span class="urgency-badge">${data.urgency === 'high' ? 'Hoog' : data.urgency === 'medium' ? 'Gemiddeld' : 'Laag'}</span>
            </div>
          </div>
          
          <div class="message-box">
            <h3>Bericht:</h3>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <p><strong>Actie vereist:</strong> Beantwoord dit bericht direct door te reageren op deze e-mail.</p>
        </div>
        
        <div class="footer">
          <p>DOBbie - De Online Bedrijfsarts | Admin Notificatie</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
}
import { NextResponse } from 'next/server';

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileVerificationResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string; 
  hostname?: string;
  action?: string;
  cdata?: string;
}

export async function POST(request: Request) {
  if (!TURNSTILE_SECRET_KEY) {
    console.error('Turnstile secret key is not configured.');
    return NextResponse.json(
      { message: 'Error del servidor: Configuración incompleta.', success: false },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, phone, message, 'cf-turnstile-response': turnstileToken } = body;

    if (!turnstileToken) {
      return NextResponse.json(
        { message: 'Verificación de Turnstile faltante.', success: false },
        { status: 400 }
      );
    }

    // Validate the Turnstile token
    const verificationResponse = await fetch(TURNSTILE_VERIFY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(turnstileToken)}`,
    });

    const verificationData: TurnstileVerificationResponse = await verificationResponse.json();

    if (!verificationData.success) {
      console.error('Turnstile verification failed:', verificationData['error-codes']);
      return NextResponse.json(
        { message: 'Falló la verificación de seguridad. Inténtalo de nuevo.', success: false, errors: verificationData['error-codes'] },
        { status: 403 } // Forbidden
      );
    }

    // --- Placeholder for your actual form processing logic --- 
    // At this point, Turnstile verification has passed.
    // You would typically:
    // 1. Sanitize and validate the input (name, email, phone, message).
    // 2. Send an email, save to a database, or integrate with a CRM.
    console.log('Turnstile verified. Form data:', { name, email, phone, message });
    // For demo purposes, we'll just return a success message.
    // Replace this with your actual email sending logic or other processing.

    // Example: Sending email (pseudo-code, you'd use a library like nodemailer)
    /*
    try {
      await sendEmail({
        to: 'admin@zunyrealty.com',
        from: email, // Or a fixed 'noreply' address
        subject: `Nuevo Mensaje de Contacto de ${name}`,
        text: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || 'No proporcionado'}\n\nMensaje:\n${message}`,
        html: `<p><strong>Nombre:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p><p><strong>Mensaje:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`
      });
      return NextResponse.json(
        { message: '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', success: true },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      return NextResponse.json(
        { message: 'El mensaje fue verificado, pero hubo un error al procesarlo. Por favor, contacta al soporte.', success: false },
        { status: 500 }
      );
    }
    */
    // --- End of Placeholder ---

    return NextResponse.json(
      { message: '¡Mensaje verificado y recibido! (Procesamiento de backend pendiente)', success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form request:', error);
    if (error instanceof SyntaxError) { // Potentially from await request.json()
        return NextResponse.json({ message: 'Solicitud malformada.', success: false }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Error interno del servidor.', success: false },
      { status: 500 }
    );
  }
} 
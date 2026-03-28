import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function POST(req: Request) {
    try {
        const { email, courseId, courseName } = await req.json();
        console.log('[INVITE] Request received for:', email, 'Course:', courseName);

        if (!email || !courseId || !courseName) {
            console.error('[INVITE] Missing parameters');
            return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
        }

        // Generar el enlace de invitación
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = req.headers.get('host') || 'localhost:3000';
        const inviteUrl = `${protocol}://${host}/login?courseId=${courseId}&email=${encodeURIComponent(email)}&invite=true`;

        const mailOptions = {
            from: `"Aula Virtual IA" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: `Invitación al curso: ${courseName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h1 style="color: #3b82f6; font-size: 24px; font-weight: 800; margin-bottom: 16px;">¡Hola!</h1>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Has sido invitado a unirte al curso <strong>${courseName}</strong> en nuestra plataforma de Aula Virtual potenciada por IA.
                    </p>
                    <div style="margin: 32px 0; text-align: center;">
                        <a href="${inviteUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                            Aceptar Invitación y Registrarse
                        </a>
                    </div>
                    <p style="color: #94a3b8; font-size: 14px; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
                        Si no esperabas esta invitación, puedes ignorar este mensaje.
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('[INVITE] email sent successfully to:', email);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[INVITE] Error:', err);
        return NextResponse.json({ 
            error: 'Error al enviar el correo', 
            details: err.message 
        }, { status: 500 });
    }
}

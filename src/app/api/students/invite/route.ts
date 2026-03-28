import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Inicializar cliente de Supabase con Service Role para gestión de usuarios
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, idNumber, courseId, courseName } = await req.json();

        if (!email || !courseId || !idNumber) {
            return NextResponse.json({ error: 'Faltan parámetros obligatorios' }, { status: 400 });
        }

        // Limpiar cédula (solo números) para la clave temporal
        const tempPassword = idNumber.replace(/\D/g, '');

        if (tempPassword.length < 6) {
            return NextResponse.json({ error: 'La cédula debe contener al menos 6 números para ser una clave válida' }, { status: 400 });
        }

        // 1. Verificar si el usuario ya existe en Auth
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users.find(u => u.email === email);

        let userId = existingUser?.id;
        let isNewUser = false;

        if (!existingUser) {
            // 2. Crear usuario si no existe
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password: tempPassword,
                email_confirm: true,
                user_metadata: { role: 'student' }
            });

            if (createError) throw createError;
            userId = newUser.user.id;
            isNewUser = true;
        }

        // 3. Actualizar perfil de usuario (upsert)
        const { error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .upsert({
                id: userId,
                email: email,
                first_name: firstName,
                last_name: lastName,
                full_name: `${firstName} ${lastName}`.trim(),
                id_number: tempPassword,
                role: 'student',
                must_change_password: isNewUser // Solo forzar cambio si es nuevo
            });

        if (profileError) throw profileError;

        // 4. Registrar inscripción (enrollment)
        const { error: enrollError } = await supabaseAdmin
            .from('enrollments')
            .upsert({
                course_id: courseId,
                student_email: email,
                status: 'invited'
            }, { onConflict: 'course_id,student_email' });

        if (enrollError) throw enrollError;

        // 5. Enviar correo de invitación
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = req.headers.get('host') || 'localhost:3000';
        const loginUrl = `${protocol}://${host}/login?email=${encodeURIComponent(email)}&invite=true`;

        const mailOptions = {
            from: `"Aula Virtual IA" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: `¡Bienvenido al curso: ${courseName}!`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
                    <h1 style="color: #3b82f6; font-size: 26px; font-weight: 800; margin-bottom: 20px;">¡Hola, ${firstName || 'Estudiante'}!</h1>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Has sido inscrito en la materia <strong>${courseName}</strong>.
                    </p>
                    
                    ${isNewUser ? `
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px dashed #cbd5e1;">
                        <h2 style="font-size: 18px; color: #1e293b; margin-top: 0;">Tus credenciales de acceso:</h2>
                        <p style="margin: 8px 0;"><strong>Usuario:</strong> ${email}</p>
                        <p style="margin: 8px 0;"><strong>Clave Temporal:</strong> ${tempPassword}</p>
                        <p style="font-size: 14px; color: #ef4444; margin-top: 10px;">* Por seguridad, el sistema te pedirá cambiar tu clave al ingresar por primera vez.</p>
                    </div>
                    ` : `
                    <p style="color: #475569; font-size: 16px;">Ya tienes una cuenta activa. Puedes ingresar con tus credenciales habituales.</p>
                    `}

                    <div style="margin: 35px 0; text-align: center;">
                        <a href="${loginUrl}" style="background: #3b82f6; color: white; padding: 14px 30px; border-radius: 10px; text-decoration: none; font-weight: 700; display: inline-block; font-size: 16px;">
                            Ingresar al Aula Virtual
                        </a>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, isNewUser });
    } catch (err: any) {
        console.error('[STUDENT_INVITE] Error:', err);
        return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 });
    }
}

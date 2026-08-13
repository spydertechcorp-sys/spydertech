// lib/email.ts — Email System Adapter for SpyderTech 2.0
// Provider: Resend (https://resend.com)
// Configure RESEND_API_KEY in .env to activate

import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = process.env.EMAIL_FROM || 'SpyderTech <noreply@spydertech.online>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface EmailResult {
  success: boolean
  id?: string
  error?: string
}

async function sendEmail(to: string, subject: string, html: string): Promise<EmailResult> {
  if (!resend) {
    console.warn('[Email] RESEND_API_KEY not configured. Email not sent:', { to, subject })
    return { success: false, error: 'Email provider not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) return { success: false, error: error.message }
    return { success: true, id: data?.id }
  } catch (err: any) {
    console.error('[Email] Failed to send:', err)
    return { success: false, error: err.message }
  }
}

// ─── Email Templates ───────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>SpyderTech</title>
  <style>
    body { margin: 0; padding: 0; background: #050507; font-family: 'Inter', -apple-system, sans-serif; color: #F5F5F0; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .logo { text-align: center; margin-bottom: 40px; }
    .logo span { font-size: 24px; font-weight: 900; color: #7DFF6B; letter-spacing: -1px; }
    .logo small { display: block; font-size: 11px; color: #888; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
    .card { background: #0C0C10; border: 1px solid #252530; border-radius: 16px; padding: 40px; }
    h1 { font-size: 28px; font-weight: 800; margin: 0 0 16px; color: #F5F5F0; }
    p { font-size: 15px; line-height: 1.7; color: #8888A0; margin: 0 0 24px; }
    .btn { display: inline-block; background: #7DFF6B; color: #050507 !important; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 8px; text-decoration: none; letter-spacing: 0.5px; }
    .divider { border: none; border-top: 1px solid #252530; margin: 32px 0; }
    .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #444; }
    .footer a { color: #7DFF6B; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="logo">
      <span>SPYDERTECH</span>
      <small>BUILD. GROW. PROTECT.</small>
    </div>
    <div class="card">${content}</div>
    <div class="footer">
      <p>© 2026 SpyderTech. All rights reserved.<br>
      <a href="${APP_URL}">spydertech.online</a> · 
      <a href="${APP_URL}/legal/privacy">Privacy Policy</a> · 
      <a href="${APP_URL}/legal/terms">Terms</a></p>
      <p style="margin-top:8px;color:#333;">A SPYDERTECH SYSTEM</p>
    </div>
  </div>
</body>
</html>`
}

// ─── Specific Email Functions ──────────────────────────────────────

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<EmailResult> {
  const url = `${APP_URL}/verify-email?token=${token}`
  return sendEmail(
    email,
    'Verifica tu cuenta · SpyderTech',
    baseTemplate(`
      <h1>Verifica tu cuenta</h1>
      <p>Hola${name ? ` ${name}` : ''},</p>
      <p>Para activar tu cuenta en SpyderTech, haz clic en el siguiente botón. Este enlace expira en 24 horas.</p>
      <p><a href="${url}" class="btn">Verificar cuenta →</a></p>
      <hr class="divider">
      <p style="font-size:13px;">Si no creaste una cuenta, ignora este correo.</p>
    `)
  )
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
): Promise<EmailResult> {
  const url = `${APP_URL}/reset-password?token=${token}`
  return sendEmail(
    email,
    'Restablece tu contraseña · SpyderTech',
    baseTemplate(`
      <h1>Restablece tu contraseña</h1>
      <p>Hola${name ? ` ${name}` : ''},</p>
      <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el siguiente botón. Este enlace expira en 1 hora.</p>
      <p><a href="${url}" class="btn">Restablecer contraseña →</a></p>
      <hr class="divider">
      <p style="font-size:13px;">Si no solicitaste este cambio, ignora este correo y tu contraseña permanecerá igual.</p>
    `)
  )
}

export async function sendWelcomeEmail(email: string, name: string): Promise<EmailResult> {
  return sendEmail(
    email,
    'Bienvenido a SpyderTech · BUILD. GROW. PROTECT.',
    baseTemplate(`
      <h1>Bienvenido al sistema.</h1>
      <p>Hola${name ? ` ${name}` : ''},</p>
      <p>Tu cuenta en SpyderTech ha sido creada y verificada. Ahora tienes acceso a tu portal de cliente donde podrás gestionar tus servicios, proyectos y solicitudes.</p>
      <p><a href="${APP_URL}/dashboard" class="btn">Ir al portal →</a></p>
      <hr class="divider">
      <p style="font-size:13px;">Si tienes preguntas, contáctanos en <a href="mailto:hola@spydertech.online" style="color:#7DFF6B;">hola@spydertech.online</a>.</p>
    `)
  )
}

export async function sendNewLeadNotification(
  adminEmail: string,
  lead: { name: string; email: string; company?: string; needs?: string; budget?: string }
): Promise<EmailResult> {
  return sendEmail(
    adminEmail,
    `[SpyderTech] Nuevo lead: ${lead.name}`,
    baseTemplate(`
      <h1>Nuevo lead recibido</h1>
      <p><strong>Nombre:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      ${lead.company ? `<p><strong>Empresa:</strong> ${lead.company}</p>` : ''}
      ${lead.needs ? `<p><strong>Necesidades:</strong> ${lead.needs}</p>` : ''}
      ${lead.budget ? `<p><strong>Presupuesto:</strong> ${lead.budget}</p>` : ''}
      <p><a href="${APP_URL}/admin/crm" class="btn">Ver en CRM →</a></p>
    `)
  )
}

export async function sendOrderConfirmation(
  email: string,
  name: string,
  order: { orderNumber: string; total: number; currency: string }
): Promise<EmailResult> {
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: order.currency, minimumFractionDigits: 0
  }).format(order.total)

  return sendEmail(
    email,
    `Confirmación de pedido #${order.orderNumber} · SpyderTech`,
    baseTemplate(`
      <h1>Pedido confirmado</h1>
      <p>Hola${name ? ` ${name}` : ''},</p>
      <p>Tu pedido <strong>#${order.orderNumber}</strong> ha sido recibido por un total de <strong>${formatted}</strong>.</p>
      <p>Nuestro equipo se pondrá en contacto contigo pronto para confirmar los detalles y coordinar el inicio del proyecto.</p>
      <p><a href="${APP_URL}/dashboard/orders" class="btn">Ver mis pedidos →</a></p>
    `)
  )
}

export async function sendSupportTicketNotification(
  email: string,
  name: string,
  ticket: { subject: string; message: string }
): Promise<EmailResult> {
  return sendEmail(
    email,
    `Ticket recibido: ${ticket.subject} · SpyderTech`,
    baseTemplate(`
      <h1>Ticket de soporte recibido</h1>
      <p>Hola${name ? ` ${name}` : ''},</p>
      <p>Hemos recibido tu solicitud de soporte. Nuestro equipo la revisará y te responderá pronto.</p>
      <p><strong>Asunto:</strong> ${ticket.subject}</p>
      <p><a href="${APP_URL}/dashboard/tickets" class="btn">Ver mis tickets →</a></p>
    `)
  )
}

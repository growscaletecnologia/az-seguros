export const resetTemplate = (name: string, resetUrl: string) => `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
    <h2>Redefinir senha</h2>
    <p>Olá, ${name}!</p>
    <p>Clique para criar uma nova senha. O link expira em 30 minutos:</p>
    <p><a href="${resetUrl}" style="display:inline-block;padding:10px 16px;border-radius:6px;border:1px solid #333;text-decoration:none">Redefinir senha</a></p>
    <p>Se você não solicitou, ignore este e-mail.</p>
  </div>
`

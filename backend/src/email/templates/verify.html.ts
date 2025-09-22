export const verifyTemplate = (name: string, verifyUrl: string) => `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
    <h2>Confirmar e-mail</h2>
    <p>Olá, ${name}!</p>
    <p>Confirme seu e-mail para ativar sua conta:</p>
    <p><a href="${verifyUrl}" style="display:inline-block;padding:10px 16px;border-radius:6px;border:1px solid #333;text-decoration:none">Confirmar e-mail</a></p>
    <p>Se você não solicitou, ignore este e-mail.</p>
  </div>
`

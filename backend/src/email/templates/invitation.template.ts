/**
 * Template para email de convite de usuário
 * Recebe nome do usuário, token de convite e URL base da aplicação
 */
export const generateInvitationEmailTemplate = (
  userName: string,
  token: string,
  baseUrl: string,
): string => {
  const acceptInvitationUrl = `${baseUrl}/auth/accept-invitation?token=${token}`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Convite para AZ Seguros</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #0056b3;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
      background-color: #f9f9f9;
    }
    .button {
      display: inline-block;
      background-color: #0056b3;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Convite para AZ Seguros</h1>
    </div>
    <div class="content">
      <p>Olá ${userName},</p>
      <p>Você foi convidado para acessar a plataforma AZ Seguros.</p>
      <p>Para aceitar o convite e criar sua senha, clique no botão abaixo:</p>
      <div style="text-align: center;">
        <a href="${acceptInvitationUrl}" class="button">Aceitar Convite</a>
      </div>
      <p>Este convite expira em 7 dias. Se você não solicitou este convite, por favor ignore este email.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} AZ Seguros. Todos os direitos reservados.</p>
      <p>Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
  `
}

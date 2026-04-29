const createTemplate = (emailUser: string, message: string) => {
  return `<html>
  <body style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
      
      <tr>
        <td style="background: #111; padding: 20px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0;">Tienda de software ${emailUser}</h2>
        </td>
      </tr>

      <tr>
        <td style="padding: 30px;">
          <h3 style="margin-top: 0; color: #333;">Nuevo mensaje</h3>
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            ${message}
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

          <p style="font-size: 14px; color: #999; text-align: center;">
            Este correo fue enviado automáticamente desde tu sitio web.
          </p>
        </td>
      </tr>

    </table>
  </body>
</html>
`
}

export default createTemplate
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

const enviarCorreoConfirmacion = async (emailAlumno, nombreAlumno, fecha, hora) => {
  const mailOptions = {
    from: `"AutoEscuela UBB" <${process.env.EMAIL_USER}>`,
    to: emailAlumno,
    subject: 'Confirmación de Clase Práctica 🚗',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #00b4d8;">¡Reserva Confirmada!</h2>
        <p>Hola <strong>${nombreAlumno}</strong>,</p>
        <p>Tu clase práctica de conducción ha sido agendada con éxito en nuestro sistema.</p>
        <hr>
        <ul style="list-style: none; padding: 0;">
          <li>📅 <strong>Fecha:</strong> ${fecha}</li>
          <li>⏰ <strong>Hora:</strong> ${hora} hrs</li>
        </ul>
        <hr>
        <p>Por favor, recuerda llegar 10 minutos antes de tu clase.</p>
        <p>Atentamente,<br><strong>El equipo de AutoEscuela UBB</strong></p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado con éxito a: ${emailAlumno}`);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

module.exports = { enviarCorreoConfirmacion };
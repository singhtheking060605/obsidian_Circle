import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  try {
  
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // Use SSL
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      debug: true, // Enable debug output
      logger: true // Log to console
    });

  

    // Verify connection
    await transporter.verify();


    // Mail options
    const mailOptions = {
      from: `"The Obsidian Circle" <${process.env.SMTP_MAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    console.log('📤 Sending email...');

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully!');

    console.log('=== EMAIL DEBUG END ===\n');

    return info;

  } catch (error) {
    console.error('❌ === EMAIL ERROR ===');
   
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    console.error('=== EMAIL ERROR END ===\n');
    throw error;
  }
};
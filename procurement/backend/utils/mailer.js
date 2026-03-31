const nodemailer = require("nodemailer");

function createTransporter() {
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    return {
      transporter: nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: String(process.env.SMTP_SECURE || "false") === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      }),
      sender: process.env.SMTP_FROM || process.env.SMTP_USER,
      simulated: false
    };
  }

  return {
    transporter: nodemailer.createTransport({
      jsonTransport: true
    }),
    sender: process.env.SMTP_FROM || "no-reply@flowprocure.local",
    simulated: true
  };
}

async function sendOtpEmail({ email, otp }) {
  const { transporter, sender, simulated } = createTransporter();

  const info = await transporter.sendMail({
    from: sender,
    to: email,
    subject: "FlowProcure verification code",
    text: `Your FlowProcure verification code is ${otp}. It expires in 60 seconds.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="margin-bottom: 8px;">Verify your FlowProcure account</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Use the one-time password below to verify your account. The code expires in 60 seconds.
        </p>
        <div style="margin: 24px 0; padding: 18px; border-radius: 12px; background: #f3f4f6; text-align: center;">
          <span style="font-size: 28px; font-weight: 700; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #6b7280; line-height: 1.6;">
          If you did not request this account, you can ignore this email.
        </p>
      </div>
    `
  });

  if (simulated) {
    console.log(`OTP email simulated for ${email}. Verification code: ${otp}`);
  }

  return { simulated, info };
}

module.exports = { sendOtpEmail };

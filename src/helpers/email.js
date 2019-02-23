import nodemailer from 'nodemailer';

require('dotenv').config();

const verificationEmail = (key) => {
  return (
    `
      <p>To verify your email please click the link below</p>
      <a href="${process.env.API_URL}/user/verifyEmail?verificationKey=${key}">Verify email</a>
    `
  );
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL, 
    clientId: process.env.EMAIL_CLIENT_ID,
    clientSecret: process.env.EMAIL_SECRET_KEY,
    refreshToken: process.env.EMAIL_REFRESH_TOKEN,
  },
});

export const sendVerificationEmail = async (toAddress, key) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: toAddress,
    subject: 'Trade Calculator - Verify email',
    html: verificationEmail(key)
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

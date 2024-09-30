import nodemailer from 'nodemailer';
import config from '.';

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: false,
  auth: {
    user: config.smtpEmail,
    pass: config.smtpAppPassword,
  },
});

export default transporter;

import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ApiError from "./ApiError.js";

dotenv.config();

export const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Leetlab",
            link: "https://leetlab.dev", // Update to your actual domain when ready
        },
    });

    const emailText = mailGenerator.generatePlaintext(options.mailGenContent);
    const emailHTML = mailGenerator.generate(options.mailGenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false,
        auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
        },
    });

    const mail = {
        from: process.env.MAILTRAP_SENDERMAIL,
        to: options.email,
        subject: options.subject,
        text: emailText,
        html: emailHTML,
      };
    
      try {
        await transporter.sendMail(mail);
      } catch (error) {
        console.error('Error sending email:', error);
        throw new ApiError('Email could not be sent', 500);
      }
};


export const forgotPasswordGenContent = (username, passwordResetUrl) => {
    return {
      body: {
        name: username,
        intro: 'We received a request to reset your password for your Leetlab account.',
        action: {
          instructions: 'Click the button below to reset your password:',
          button: {
            color: '#22BC66',
            text: 'Reset Password',
            link: passwordResetUrl,
          },
        },
        outro: 'If you did not request a password reset, you can safely ignore this email.',
      },
    };
  };
  
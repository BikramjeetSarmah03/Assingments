import { createTransport } from "nodemailer";
import fs from "fs";
import ejs from "ejs";
import path from "path";
import "dotenv/config";

type MailData = {
  user: string;
  time: string;
  topic: string;
  duration: string;
  joinUrl: string;
  meetingLink: string;
  meetingPassword: string;
  to: string;
  subject: string;
};

export const sendEmail = async (data: MailData) => {
  try {
    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_USER_PASS,
      },
    });

    const templateString = fs.readFileSync(
      path.join(__dirname, "../../templates/meetingEmail.ejs"),
      "utf-8"
    );

    const html = ejs.render(templateString, data);

    var mailOptions = {
      from: process.env.SMTP_USER_NAME,
      to: data.to,
      subject: data.subject,
      html: html,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) reject(err);
        resolve(info);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

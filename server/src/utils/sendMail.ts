import { createTransport } from "nodemailer";
import fs from "fs";
import ejs from "ejs";

export const sendEmail = async () => {
  const transporter = createTransport({
    port: 587,
    host: "live.smtp.mailtrap.io",
    auth: {
      user: "api",
      pass: "bfea0eafc1d46e2bd192ae636623c8fe",
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  const templateString = fs.readFileSync(
    "../../templates/meetingEmail.ejs",
    "utf-8"
  );

  const data = {
    username: "Bikram",
    meetingUrl: "meeting url",
  };

  const html = ejs.render(templateString, data);

  var mailOptions = {
    from: "mailtrap@pms.netlify.app",
    to: "9854bikram@gmail.com",
    subject: "Nice Nodemailer test",
    text: "Hey there, it’s our first message sent with Nodemailer 😉 ",
    html: html,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};

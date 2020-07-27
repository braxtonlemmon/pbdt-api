const express = require('express');
const nodemailer = require('nodemailer');
require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


module.exports = (req, res) => {
  const mailer = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  mailer.sendMail(
    {
      from: req.body.from || "No one",
      to: process.env.GMAIL_ADDRESS,
      subject: `PB DOG TREATS: ${req.body.subject || "No subject"}`,
      html: `
          <p>New message from ${req.body.from.toUpperCase() || "Anonymous"} (${req.body.email}):</p>
          <br><br>
          <p>${req.body.message || "No message"}</p>
        `,
    },
    function (err, info) {
      if (err) return res.status(500).send(err);
      res.json({ success: true });
    }
  );

}
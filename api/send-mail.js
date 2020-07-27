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
        from: req.body.from || 'No one',
        to: process.env.GMAIL_ADDRESS,
        subject: `PB DOG TREATS: ${req.body.subject || "No subject"}`,
        text: `Message from ${req.body.from || 'Anonymous'} (${req.body.email}): ${req.body.message || "No message"}`,
      },
      function (err, info) {
        if (err) return res.status(500).send(err);
        res.json({ success: true });
      }
    );

}
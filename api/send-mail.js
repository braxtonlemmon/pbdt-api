const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

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
        <p>New message from ${req.body.from || "Anonymous"} (${req.body.email}):</p>
        <br>
        <p>${req.body.message || "No message"}</p>
      `,
      text: `New message from ${req.body.from || "Anonymous"} (${
        req.body.email
      }): ${req.body.message || "No message"}`,
    },
    function (err, info) {
      if (err) return res.status(500).send(err);
      res.json({ success: true });
    }
  );

}
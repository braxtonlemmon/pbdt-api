const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const allowCors = fn => async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
}

const handler = (req, res) => {
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
        <p>New message from ${req.body.email}.</p>
        <p>Phone: ${req.body.phone || 'No phone number'}</p>
        <br>
        <h2>Message</h2>
        <p>${req.body.message || "No message"}</p>
      `,
      text: `New message from ${req.body.email}. Phone: ${req.body.phone || 'No phone number'}: ${req.body.message || "No message"}`,
    },
    function (err, info) {
      if (err) return res.status(500).send(err);
      res.json({ success: true });
    }
  );
}

module.exports = allowCors(handler);

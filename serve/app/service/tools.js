const { Service } = require('egg')
const path = require('path')
const fse = require('fs-extra')
const nodemailer = require('nodemailer')

const userEmail = "18854109500@163.com"

const transporter = nodemailer.createTransport({
    service: '163',
    secureConnection: true,
    auth: {
      user: userEmail,
      pass: 'lijinhai12345',
    },
  })

  class ToolService extends Service {
    async sendMail(email, subject, text, html) {
        console.log(email, subject, html,"121212-12121")
        // return true
        const mailOptions = {
          from: userEmail,
          cc: userEmail,
          to: email,
          subject,
          text,
          html,
        }
        try {
          await transporter.sendMail(mailOptions)
          return true
        } catch (err) {
          console.log('email error', err)
          return false
        }
      }
     
  }

  module.exports = ToolService
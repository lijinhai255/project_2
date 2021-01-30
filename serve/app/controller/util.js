'use strict';
const svgCaptcha = require('svg-captcha')
const fse = require('fs-extra');
const path = require('path')
const BaseController = require('./base')
class UtilController extends BaseController {
  async captcha() {
    const captcha = svgCaptcha.create({
        size: 4,
        fontSize: 50,
        width: 100,
        height: 40,
        noise: 3,
      })
    const { ctx } = this;
    ctx.body = captcha;
    this.ctx.session.captcha = captcha.text
    this.ctx.response.type = 'image/svg+xml'
    this.ctx.body = captcha.data
  }
  async sendcode(){
      const {ctx} = this;
      const {email} = ctx.query
      const code = Math.random().toString().slice(2,6)
      ctx.session.emailCode = code;
      console.log(code,"code-")
      const subject = "验证码";
      const text = '';
      const html =  `<h2>验证码</h2><a href="https://baidu.com"><span>${code}</span></a>`
      const hasSend = await this.service.tools.sendMail(email, subject, text, html)
      if (hasSend) {
        this.message('发送成功')
      } else {
        this.error('发送失败')
      }
  }
  async uploadfile(){
    const {ctx} = this;
    const file = ctx.request.files[0]
    const {name} = ctx.request.body;
    const chunkPath = path.resolve(this.config.UPLOAD_DIR)
    // console.log(file,"121",name,chunkPath)
    await fse.move(file.filepath, `${chunkPath}/${file.filename}`)
    this.success({
      url:`public/${file.filename}`
    })
  }
}

module.exports = UtilController;

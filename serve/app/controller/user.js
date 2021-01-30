const md5 = require('md5')
const jwt = require('jsonwebtoken')

const HashSalt = ':ljh!@123'
const BaseController = require("./base")
const createRule = {
  nickname: { type: 'string' },
  password: { type: 'string' },
  captcha: { type: 'string' },
}
class UserController extends BaseController {
  async login() {
    // this.success('token')
    const { ctx, app } = this
    const { email, captcha, password, emailcode } = ctx.request.body
    console.log(captcha.toUpperCase(),ctx.session.captcha.toUpperCase())
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }
    console.log(emailcode,ctx.session.emailcode,ctx.emailCode)
    if (emailcode !== ctx.session.emailCode) {
      return this.error('邮箱验证码错误')
    }
    const str = md5(password + HashSalt);
    const user = await ctx.model.User.findOne({
      email,
      password: str,
    })
    console.log(user, "user-user",user && user.email)
    if (user && user.email) {
      // 用户的信息加密成token 返回
      const token = jwt.sign({
        _id: user._id,
        email,
      }, app.config.jwt.secret, {
        expiresIn: '100h',
      })
      return this.success({ token, email, nickname: user.nickname })
    } else {
      return this.error('用户名密码错误')

    }

  }
  async register() {
    const { ctx } = this
    try {
      // 校验传递的参数
      console.log(ctx, "ctx")
      ctx.validate(createRule)

    } catch (e) {
      console.log(e)
      return this.error('参数校验失败', -1, e.errors)
    }

    const { email, password, captcha, nickname } = ctx.request.body
    console.log(captcha.toUpperCase(), "ctx.request.body", ctx.session.captcha.toUpperCase())

    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }
    if (await this.checkEmail(email)) {
      this.error('邮箱重复啦')
    } else {
      const ret = await ctx.model.User.create({
        email,
        nickname,
        password: md5(password + HashSalt),
      })
      if (ret._id) {
        this.message('注册成功')
      }
    }


    // this.success({name:'kkb'})
  }
  async verify() {
    // 校验用户名是否存在

  }
  async info() {
    const {ctx} = this;
    console.log(ctx.state,"11212122121")
    const {email} = ctx.state
    const user = await this.checkEmail(email)
    console.log(user,"user")
    this.success(user)

  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email })
    return user
  }
}

module.exports = UserController
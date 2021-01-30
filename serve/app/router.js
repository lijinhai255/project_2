'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
const svhCaptcha = require('svg-captcha')
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt({app})
  router.get('/data', controller.home.index);
  router.get('/dataCss', controller.home.getDataCss);
  router.get('/dataCssMum', controller.home.getDataCssMum);
  router.post("/dataCssContent",controller.home.getContentFn)
  // 获取验证码
  router.get('/captcha', controller.util.captcha)
  // 
  router.post('/uploadfile', controller.util.uploadfile)

  // 获取邮箱验证码
  router.get("/sendcode",controller.util.sendcode)
  router.group({ name: 'user', prefix: '/user' }, router => {

    const {
      info, register, login, verify, updateInfo,
      isfollow,
      follow, cancelFollow,
      following, followers,
      articleStatus,
      likeArticle, cancelLikeArticle,

    } = controller.user

    router.post('/register', register)
    router.post('/login',login)
    router.get('/info',jwt,info)
    
  })

};

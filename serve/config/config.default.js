/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path')

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1611462632016_3656';
  config.multipart = {
    mode: 'file',
    whitelist: () => true,
    tmpdir: path.resolve(__dirname, '..', 'app/public')
  }
  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public')
  
  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
    security: {
      csrf: {
        enable: false,
      },
    },
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/project',
        options: {
            useUnifiedTopology:true,
            // useCreateIndexes:true
        },
        
      },
    },
    jwt: {
      secret: '@ljh!123Abc!:',
    },
  };
};

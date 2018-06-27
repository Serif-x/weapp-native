/*
 * Passport
 */
;(function (root, factory) {
  module.exports = factory;
})(this, function (wx, undefined) {
  'use strict';
  
  const model = {};
  
  /**
   * 微信登录
   * @returns {Promise}
   */
  model.login = () => {
    return new Promise((resolve, reject) => {
      return wx.login({
        success(res) {
          if (res.code) {
            resolve(res);
          } else {
            reject();
          }
        },
        fail: reject,
      });
    })
      .then((info) => {
        console.info('Wx login success. %o', info);
        return info;
      });
  };
  
  /**
   * 获取微信用户信息
   * @returns {Promise}
   */
  model.getUserInfo = () => {
    return new Promise((resolve, reject) => {
      return wx.getUserInfo({
        withCredentials: false,
        success: resolve,
        fail: reject
      });
    });
  };
  
  /**
   * 检查会话有效状态
   * @returns {Promise}
   */
  model.checkSession = () => {
    return new Promise((resolve, reject) => {
      return wx.checkSession({
        success: resolve,
        fail: reject
      });
    });
  };
  
  // Export
  return model;
}.call(this, wx));


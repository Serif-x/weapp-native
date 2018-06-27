/*
 * Toast
 */
;(function (root, factory) {
  module.exports = factory;
})(this, function (wx, undefined) {
  'use strict';
  
  const model = {};
  
  // TODO: 以下图片路径根据实际项目路径修改
  
  model.success = (title) => {
    return new Promise((resolve, reject) => {
      console.info(title);
      if (!title) return reject({errMsg: ''});
      
      return wx.showToast({
        title: '' + title,
        image: '/images/i/success.png',
        success: resolve,
        fail: reject
      })
    })
      .catch((err) => {
        console.warn(err);
      });
  };
  model.error = (title) => {
    return new Promise((resolve, reject) => {
      console.warn(title);
      if (!title) return reject({errMsg: ''});
  
      return wx.showToast({
        title: '' + title,
        image: '/images/i/error.png',
        success: resolve,
        fail: reject
      })
    })
      .catch((err) => {
        console.warn(err);
      });
  };
  model.warn = (title) => {
    return new Promise((resolve, reject) => {
      console.warn(title);
      if (!title) return reject({errMsg: ''});
  
      return wx.showToast({
        title: '' + title,
        image: '/images/i/warn.png',
        success: resolve,
        fail: reject
      })
    })
      .catch((err) => {
        console.warn(err);
      });
  };
  
  model.loading = (title) => {
    return new Promise((resolve, reject) => {
      return wx.showLoading({
        title: title || '请稍候...',
        mask: true,
        success: resolve,
        fail: reject
      })
    })
      .catch((err) => {
        console.warn(err);
      });
  };
  
  model.hideToast = () => wx.hideToast();
  model.hideLoading = () => wx.hideLoading();
  
  // Export
  return model;
}.call(this, wx));

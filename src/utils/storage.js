/*
 * Storage
 */
;(function (root, factory) {
  module.exports = factory;
})(this, function (wx, undefined) {
  'use strict';
  
  const model = {};
  
  model.set = (...args) => {
    if (args.length === 2) {
      return new Promise((resolve, reject) => {
        return wx.setStorage({
          key: args[0],
          data: args[1],
          success: resolve,
          fail: reject
        });
      });
    }
    
    const { keys } = args || {};
    const promises = [];
    
    for (let k in keys) {
      if (keys.hasOwnProperty(k)) {
        ((key) => {
          promises.push(new Promise((resolve, reject) => {
            return wx.setStorage({
              key: key,
              data: keys[key],
              success: resolve,
              fail: reject
            });
          }));
        })(k);
      }
    }
    
    return Promise.all(promises)
      .then(() => {
        console.log('Storage save success.');
        return null;
      });
  };
  model.get = (key) => {
    return new Promise((resolve, reject) => {
      return wx.getStorage({
        key: key,
        success(res) {
          resolve(res.data);
        },
        fail: reject
      });
    });
  };
  model.remove = (key) => {
    return new Promise((resolve, reject) => {
      return wx.removeStorage({
        key: key,
        success(res) {
          resolve(res.data);
        },
        fail: reject
      });
    });
  };
  model.clear = () => {
    return new Promise((resolve, reject) => {
      return wx.clearStorage({
        success(res) {
          resolve(res.data);
        },
        fail: reject
      });
    });
  };
  
  model.getSync = (key) => {
    return wx.getStorageSync(key);
  };
  model.setSync = (key, data) => {
    return wx.setStorageSync(key, data);
  };
  model.removeSync = (key) => {
    return wx.removeStorageSync(key);
  };
  model.clearSync = () => {
    return wx.clearStorageSync();
  };
  
  // Export
  return model;
}.call(this, wx));

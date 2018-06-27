/*
 * Modal
 */
;(function (root, factory) {
  module.exports = factory;
})(this, function (wx, undefined) {
  'use strict';
  
  const modal = {};
  
  const _trimContent = (content, maxLength = 250) => {
    content = (typeof content === 'string') ? content : ('' + content);
    return content.length <= maxLength ? content : (content.substring(0, maxLength - 1) + '...');
  };
  
  /**
   * Modal alert
   * @param {String} content
   * @param {String} [confirmText]
   * @returns {Promise}
   */
  modal.alert = (content, confirmText) => {
    return new Promise((resolve, reject) => {
      console.warn(content);
      return wx.showModal({
        title: '提示',
        content: _trimContent(content),
        
        confirmText: confirmText || '确定',
        confirmColor: '#8F73F7',
        
        showCancel: false,
        cancelColor: '#A3A1A5',
        
        success: resolve,
        fail: resolve
      });
    });
  };
  
  /**
   * Modal confirm
   * @param {String} content
   * @param {String} [confirmText]
   * @param {String} [cancelText]
   * @returns {Promise}
   */
  modal.confirm = (content, confirmText, cancelText) => {
    return new Promise((resolve, reject) => {
      return wx.showModal({
        title: '提示',
        content: _trimContent(content),
        
        confirmText: confirmText || '确定',
        confirmColor: '#8F73F7',
        
        showCancel: true,
        cancelText: cancelText || '取消',
        cancelColor: '#A3A1A5',
        
        success(res) {
          if (res.confirm) {
            return resolve();
          } else if (res.cancel) {
            return reject(res);
          }
        },
        fail: reject
      });
    });
  };
  
  /**
   * Modal action list
   * @param {Object} options
   * @returns {Promise}
   */
  modal.showActionSheet = (options = {}) => {
    options = options || {};
    let actionList = options.actionList || [];
    
    // let itemList = actionList.map((item) => item.text);
    
    return new Promise((resolve, reject) => {
      wx.showActionSheet({
        itemList: actionList.map((item) => item.text),
        itemColor: options.itemColor || '#8F73F7',
        success(res) {
          let action = actionList[res.tapIndex || 0];
          
          if (typeof action.handler === 'function') {
            action.handler(res, action);
          }
          
          if (typeof options.success === 'function') {
            options.success(res, action);
          }
          
          res.action = action;
          return resolve(res);
        },
        fail(res) {
          if (typeof options.fail === 'function') {
            options.fail(res);
          }
          return reject(res);
        },
        complete: options.complete,
      });
    });
  };
  
  /**
   * Modal withdraw
   * @param {String} content
   * @returns {Promise}
   */
  modal.withdraw = (content) => {
    return modal.alert(content)
      .then(() => {wx.navigateBack();})
      .catch(() => {wx.navigateBack();});
  };
  
  // Export
  return modal;
}.call(this, wx));

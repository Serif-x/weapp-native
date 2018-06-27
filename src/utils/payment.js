/*
 * Payment
 */
;(function (root, factory) {
  module.exports = factory;
})(this, function (wx, undefined) {
  'use strict';
  
  const model = {};
  
  /**
   * Request Payment
   * @param options
   * @returns {Promise<any>}
   */
  model.requestPayment = (options = {}) => {
    return new Promise((resolve, reject) => {
      let paySuccess = false;
      
      return wx.requestPayment({
        timeStamp: options.timeStamp,
        nonceStr: options.nonceStr,
        package: options.package,
        signType: options.signType || 'MD5',
        paySign: options.paySign,
        success(res) {
          paySuccess = true;
          
          options.success && options.success(res);
          return resolve(res);
        },
        fail(res) {
          // options.failed && options.failed(res);
          // return reject(res);
        },
        complete(res) {
          if (!paySuccess) {
            options.failed && options.failed(res);
            options.complete && options.complete(res);
            return reject(res);
            
          } else {
            options.complete && options.complete(res);
          }
        }
      });
    });
  };
  
  // Export
  return model;
}.call(this, wx));

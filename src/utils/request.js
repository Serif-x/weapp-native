/*
 * Request
 */
;(function (root, factory) {
  module.exports = factory;
})(this, function (wx, undefined) {
  'use strict';
  
  const utils = require('utils');
  
  const model = {};
  
  const attachedDataManager = (() => {
    let attachedData = null;
    
    return {
      get() {
        return new Promise((resolve, reject) => {
          if (attachedData) {
            // console.log('Get meta from memory %o', attachedData);
            return resolve(attachedData);
          }
          
          return storage.get('requestData')
            .then((requestData) => {
              // attachedData = requestData;
              
              // console.log('Get meta from disk %o', requestData);
              return resolve(requestData);
            })
            .catch(() => {
              console.warn('Local meta not found');
              return resolve(null);
            });
        });
      },
      set(data) {
        attachedData = data || null;
        return storage.set('requestData', data);
      },
    };
  })();
  
  const generateFetchHeader = (baseHeader, extraData) => {
    let _hd = utils.clone(baseHeader);
    utils.extend(_hd, extraData);
    utils.extend(_hd, options.header);
    
    return _hd;
  };
  
  model.fetch = (options) => {
    let _beforeSend = options.beforeSend || function() {};
    let _complete = options.complete || function() {};
    let _requestTask;
    
    const _request = new Promise((resolve, reject) => {
      const baseHeader = {
        'content-type': 'application/json'
      };
      
      attachedDataManager.get()
        .then((extData) => {
          const _resp = {
            code: 'NET_ERROR',
            data: null,
            msg: '网络异常'
          };
          
          let reqId = 'req_' + Date.now();
          
          _beforeSend();
          console.log('==> Request data [%s]: %o', reqId, options.data);
          _requestTask = wx.request({
            url: options.url,
            data: options.data,
            method: options.method || 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: generateFetchHeader(baseHeader, extData),
            dataType: 'json',
            success(res) {
              console.log('==> Response success [%s]: %o', reqId, res);
              
              if (!res.data) {
                return reject(_resp);
              }
              
              // Filter and transform data
              let _resData = res.data || {};
  
              // TODO: 返回参数属性根据实际服务器返回值修改
              
              if (res.statusCode === 200) {
                // Map properties from server
                // _resp.code = _resData.code;
                // _resp.data = _resData.data;
                // _resp.msg = _resData.msg;
                
                if (_resp.code === 1000) {
                  return resolve(_resp);
                } else {
                  return reject(_resp);
                }
              }
              
              _resp.code = res.statusCode;
              _resp.data = null;
              _resp.msg = _resData.Message; // TODO: 参数映射
              
              return reject(_resp);
            },
            fail(res) {
              console.warn('==> Response error [%s]: %o', reqId, res);
              reject(_resp);
            },
            complete() {
              _complete();
            },
          });
        })
        .catch((err) => {
          throw err;
        });
    });
    
    _request.requestTask = _requestTask;
    
    return _request;
  };
  
  model.setAttachedData = (data) => {
    return attachedDataManager.set(data);
  };
  
  // Export
  return model;
}.call(this, wx));

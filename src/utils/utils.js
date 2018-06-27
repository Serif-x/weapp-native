/*
 * Utils
 */
;(function (root, factory) {
  module.exports = factory;
})(this, function (wx, undefined) {
  'use strict';
  
  const utils = {};
  
  utils.extend = function _extend(target, source, deep) {
    if (!target || !source) {
      return target;
    }
    
    for (let p in source) {
      if (source.hasOwnProperty(p)) {
        if (deep) {
          target[p] = ('object' === typeof target[p]) ? _extend(target[p], source[p], deep) : source[p];
        } else {
          target[p] = source[p];
        }
      }
    }
    return target;
  };
  utils.clone = (source, deep) => {
    return utils.extendObj({}, source, deep);
  };
  utils.parseUrlObj = (obj) => {
    let _str = '';
    
    for (let k in obj) {
      if (obj.hasOwnProperty(k)) {
        _str += ('&' + k + '=' + obj[k]);
      }
    }
    
    _str = _str.length >= 1 ? _str.substr(1) : _str;
    
    return _str;
  };
  utils.throttle = (fn, delay, atLeast, processBefore) => {
    let _timer = null;
    let _previous = null;
    
    return function (...args) {
      let _that = this;
      let _now = +new Date();
      
      if (!_previous) _previous = _now;
      
      processBefore && processBefore();
      clearTimeout(_timer);
      
      if (atLeast && _now - _previous >= atLeast) {
        fn.apply(_that, args);
        _previous = _now;
      }
      
      _timer = setTimeout(() => {
        fn.apply(_that, args);
        
      }, delay || 1000);
    };
  };
  
  // Export
  return utils;
}.call(this, wx));

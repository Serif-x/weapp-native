/*
 * Timer
 */
;(function (root, factory) {
  module.exports = factory;
})(this, function (wx, undefined) {
  'use strict';
  
  const TIMER_STATUS = {
    STARTED: 'started',
    STOPPED: 'stopped',
    PAUSED: 'paused',
    TIMEOUT: 'timeout',
  };
  
  const Timer = function(options) {
    this.settings = {
      tickTimes: 100, // int
      delay: 1000, // ms
      tick: 100, // int
      name: 'NONE',
      onProcess(timeLeft) {},
      onTimeout() {}
    };
    
    for (let p in options) {
      if (options.hasOwnProperty(p)) {
        this.settings[p] = options[p];
      }
    }
    
    // Init
    this.name = this.settings.name;
    this.tickTimes = ~~this.settings.tickTimes;
    this.tick = this.tickTimes;
    this.timer = null;
    this.status = TIMER_STATUS.STOPPED;
    
    const that = this;
    
    this.processor = function () {
      let self = that;
      
      if (self.timer) {
        clearTimeout(self.timer);
      }
      
      return function _process(...args) {
        self.settings.onProcess(self.tick);
        
        if (self.tick <= 0) {
          clearTimeout(self.timer);
          
          self.timer = null;
          self.status = TIMER_STATUS.TIMEOUT;
          console.warn('→ Timer [' + self.settings.name + '] timeout.');
          
          if (typeof self.settings.onTimeout === 'function') {
            self.settings.onTimeout.apply(self, args);
          }
          
          return;
        }
        
        self.tick--;
        
        // clear last timer
        clearTimeout(self.timer);
        
        // set timer
        self.timer = setTimeout(_process, self.settings.delay || 1000);
        self.status = TIMER_STATUS.STARTED;
      };
    };
  };
  Timer.STATUS = TIMER_STATUS;
  
  Timer.prototype = {
    start() {
      this.tick = this.tickTimes;
      this.processor()();
      console.warn(`→ Timer [${this.name}] started.`);
    },
    stop() {
      clearTimeout(this.timer);
      
      this.timer = null;
      this.tick = this.tickTimes;
      this.status = TIMER_STATUS.STOPPED;
      console.warn(`→ Timer [${this.name}] stopped.`);
    },
    restart() {
      this.stop();
      this.start();
      console.warn(`→ Timer [${this.name}] restarted.`);
    },
    pause() {
      clearTimeout(this.timer);
      
      this.timer = null;
      this.status = TIMER_STATUS.PAUSED;
      console.warn(`→ Timer [${this.name}] paused.`);
    },
    resume() {
      this.processor()();
      console.warn(`→ Timer [${this.name}] resumed.`);
    },
    setFrequency(frequency) {
      this.tickTimes = ~~frequency || ~~this.tickTimes;
      this.tick = this.tickTimes;
      console.warn(`→ Timer frequency is set to [${this.tickTimes}].`);
    }
  };
  Timer.prototype.constructor = Timer;
  
  // Export
  return Timer;
}.call(this, wx));

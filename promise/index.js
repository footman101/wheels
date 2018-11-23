function isFunction(value) {
  return typeof value === 'function';
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

const STATE_PENDING = 'pending';
const STATE_FULFILLED = 'fulfilled';
const STATE_REJECTED = 'rejected';

function Promise(resolver) {
  if (!isFunction(resolver)) {
    throw new Error('Promise resolver ' + resolver + ' is not a function');
  }
  this.state = STATE_PENDING;
  this.value = undefined;
  this.nextQueue = [];

  const reject = (function(value) {
    if (this.state !== STATE_PENDING) {
      return;
    }

    if (this === value) {
      reject(new TypeError('promise equals value when resolve promise by value.'));
      return;
    }

    this.value = value;
    this.state = STATE_REJECTED;
    this.cleanNextQueue();
  }).bind(this);

  const resolve = (function(value) {
    if (this.state !== STATE_PENDING) {
      return;
    }

    if (this === value) {
      reject(new TypeError('promise equals value when resolve promise by value.'));
      return;
    }
    
    if (value instanceof Promise) {
      value.then(resolve, reject);
      return;
    }
    
    if (isFunction(value) || isObject(value)) {
      let then;
      try {
        then = value.then;
      } catch (error) {
        reject(error);
        return;
      }

      if (isFunction(then)) {
        let isInvoked = false;
        try {
          const resolvePromise = y => {
            if (isInvoked) {
              return;
            }
            isInvoked = true;
            resolve(y);
          }
          const rejectPromise = y => {
            if (isInvoked) {
              return;
            }
            isInvoked = true;
            reject(y);
          }
          then.call(value, resolvePromise, rejectPromise)
        } catch (error) {
          if (!isInvoked) {
            reject(error);
          }
        }
        return;
      }
    }

    this.value = value;
    this.state = STATE_FULFILLED;
    this.cleanNextQueue();
  }).bind(this);

  resolver(resolve, reject);
}

Promise.prototype.cleanNextQueue = function cleanNextQueue() {
  if (this.state === STATE_PENDING) {
    return;
  }
  const me = this;
  this.nextQueue.forEach(({deferred, onFulfilled, onRejected}) => {
    const cb = me.state === STATE_FULFILLED ? onFulfilled : onRejected;
    if (!isFunction(cb)) {
      const resolver = me.state === STATE_FULFILLED ? deferred.resolve : deferred.reject;
      resolver(me.value);
      return;
    }
    
    setTimeout(() => {
      let value;
      try {
        value = cb(me.value);
      } catch(e) {
        deferred.reject(e);
        return;
      }

      deferred.resolve(value);
    }, 0);
  });

  this.nextQueue = [];
};

Promise.prototype.then = function then(onFulfilled, onRejected) {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  this.nextQueue.push({
    onFulfilled,
    onRejected,
    deferred
  });
  this.cleanNextQueue();

  return deferred.promise;
};

Promise.resolve = function resolve(value) {
  return new Promise(resolve => {
    resolve(value);
  });
};

Promise.reject = function reject(value) {
  return new Promise((resolve, reject) => {
    reject(value);
  });
};

module.exports = Promise;

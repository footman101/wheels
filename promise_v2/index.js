const isFunction = (value) => {
  return {}.toString.call(value) === '[object Function]';
};

const isObject = (value) => {
  return typeof value === 'object' && value !== null;
};

const once = (func) => {
  let called = false;
  return () => {
    if (!called) func();
    called = true;
  };
};

const State = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
};

const internals = new WeakMap();

const getInternal = (promise) => {
  return internals.get(promise);
};

const setInternal = (promise, value) => {
  return internals.set(promise, {
    ...getInternal(promise),
    ...value,
  });
};

const triggerDownStreams = (promise) => {
  setTimeout(() => {
    const { downStreams, state, result } = getInternal(promise);
    downStreams
      .slice()
      .forEach(({ onFulfilled, onRejected, resolve, reject }) => {
        let downStreamResult = result;
        downStreams.shift();
        if (state === State.FULFILLED) {
          if (isFunction(onFulfilled)) {
            try {
              downStreamResult = onFulfilled(result);
            } catch (e) {
              reject(e);
              return;
            }
          }
          resolve(downStreamResult);
        } else if (state === State.REJECTED) {
          if (isFunction(onRejected)) {
            try {
              downStreamResult = onRejected(result);
            } catch (e) {
              reject(e);
              return;
            }
            resolve(downStreamResult);
          } else {
            reject(result);
          }
        }
      });
  }, 0);
};

const reject = (promise) => (reason) => {
  const { state } = getInternal(promise);
  if (state !== State.PENDING) return;
  setInternal(promise, {
    result: reason,
    state: State.REJECTED,
  });
  triggerDownStreams(promise);
};

const resolve = (promise) => (x) => {
  const { resolve, reject, state } = getInternal(promise);
  if (state !== State.PENDING) return;
  if (promise === x) {
    reject(new TypeError('Chaining cycle detected for promise'));
    return;
  }
  if (x instanceof Promise) {
    const xInternal = getInternal(x);
    if (xInternal.state === State.PENDING) {
      x.then(resolve, reject);
      return;
    }
    if (xInternal.state === State.FULFILLED) {
      resolve(xInternal.result);
      return;
    }
    if (xInternal.state === State.REJECTED) {
      reject(xInternal.result);
      return;
    }
  }
  if (isFunction(x) || isObject(x)) {
    let then;
    let called = false;
    try {
      then = x.then;
      if (isFunction(then)) {
        const resolvePromise = (y) => {
          if (called) return;
          called = true;
          resolve(y);
        };
        const rejectPromise = (r) => {
          if (called) return;
          called = true;
          reject(r);
        };
        then.call(x, resolvePromise, rejectPromise);
        return;
      }
    } catch (e) {
      if (!called) {
        reject(e);
      }
      return;
    }
  }

  setInternal(promise, {
    result: x,
    state: State.FULFILLED,
  });
  triggerDownStreams(promise);
};

class Promise {
  constructor(resolver) {
    if (!isFunction(resolver)) {
      throw new TypeError('Promise resolver undefined is not a function');
    }

    const internal = {
      state: State.PENDING,
      downStreams: [],
      resolve: resolve(this),
      reject: reject(this),
    };
    internals.set(this, internal);
    resolver(internal.resolve, internal.reject);
  }

  then(onFulfilled, onRejected) {
    const downStream = {
      onFulfilled,
      onRejected,
    };
    const result = new Promise((resolve, reject) => {
      downStream.resolve = resolve;
      downStream.reject = reject;
    });
    const { downStreams, state } = getInternal(this);
    downStreams.push(downStream);
    if (state !== State.PENDING) {
      triggerDownStreams(this);
    }
    return result;
  }
}

Promise.resolve = (result) => new Promise((resolve) => resolve(result));
Promise.reject = (reason) => new Promise((_, reject) => reject(reason));

module.exports = Promise;

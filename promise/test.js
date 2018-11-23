const Promise = require('./index');

module.exports = {
  deferred: () => {
    const pending = {}
    pending.promise = new Promise((resolve, reject) => {
      pending.resolve = resolve
      pending.reject = reject
    });

    return pending;
  },
  resolved: value => Promise.resolve(value),
  rejected: reason => Promise.reject(reason),
}
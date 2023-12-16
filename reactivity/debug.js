import { effect, track, trigger } from './index.js';

const makeReactive = (obj) => {
  const reactiveObj = new Proxy(obj, {
    get(target, key) {
      track(target, key);
      return target[key];
    },
    set(target, key, newVal) {
      target[key] = newVal;
      trigger(target, key);
      return true;
    },
  });
  return reactiveObj;
};

const obj2 = makeReactive({ count: 0 });
const jobQueue = new Set();
let isFlushing = false;
const flushJob = () => {
  if (isFlushing) {
    return;
  }
  isFlushing = true;

  Promise.resolve()
    .then(() => {
      jobQueue.forEach((fn) => {
        fn();
      });
      jobQueue.clear();
    })
    .finally(() => {
      isFlushing = false;
    });
};
effect(
  () => {
    console.log(obj2.count);
  },
  {
    scheduler: (fn) => {
      jobQueue.add(fn);
      flushJob();
    },
  }
);

obj2.count = 10;
obj2.count = 11;
obj2.count = 12;

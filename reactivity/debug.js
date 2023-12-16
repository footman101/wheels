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

const obj = makeReactive({ ok: true, text: 'hello world' });
effect(() => {
  console.log('parentEffectRun');

  effect(() => {
    console.log('childEffectRun');
    obj.ok;
  });

  obj.text;
});

obj.text = '1234';
obj.ok = false;

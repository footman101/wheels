const test = require('node:test');
const { effect, track, trigger } = require('./index');
const assert = require('assert');

const makeReactive = (obj) => {
  const reactiveObj = new Proxy(obj, {
    get(target, key) {
      track(target, key);
      return target[key];
    },
    set(target, key, newVal) {
      target[key] = newVal;
      trigger(target, key);
    },
  });
  return reactiveObj;
};

test('effect should not run when none dep property change', (t) => {
  const obj = makeReactive({ ok: true, text: 'hello world' });
  let effectRunTime = 0;
  effect(() => {
    effectRunTime++;
    console.log(obj.ok);
  });

  obj.text = '123';
  obj.text1 = '1234';
  assert.strictEqual(effectRunTime, 1);
});

test('effect should run when dep property change', (t) => {
  const obj = makeReactive({ ok: true, text: 'hello world' });
  let effectRunTime = 0;
  effect(() => {
    effectRunTime++;
    console.log(obj.ok);
    console.log(obj.text);
  });

  obj.text = '123';
  obj.ok = false;
  assert.strictEqual(effectRunTime, 3);
});

test('effect should not run when dep property is in condition statement', (t) => {
  const obj = makeReactive({ ok: true, text: 'hello world' });
  let effectRunTime = 0;
  effect(() => {
    effectRunTime++;
    console.log(obj.ok ? obj.text : 'not');
  });
  obj.ok = false;
  obj.text = '1234';
  assert.strictEqual(effectRunTime, 2);
});

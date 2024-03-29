import test from 'node:test';
import { effect, track, trigger } from './index.js';
import assert from 'assert';
import { scheduler } from 'timers/promises';

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

test('effect should not run when none dep property change', (t) => {
  const obj = makeReactive({ ok: true, text: 'hello world' });
  let effectRunTime = 0;
  effect(() => {
    effectRunTime++;
    obj.ok;
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
    obj.ok;
    obj.text;
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
    obj.ok ? obj.text : 'not';
  });
  obj.ok = false;
  obj.text = '1234';
  assert.strictEqual(effectRunTime, 2);
});

test('embed effect should work', (t) => {
  const obj = makeReactive({ ok: true, text: 'hello world' });
  let parentEffectRunTime = 0;
  let childEffectRunTime = 0;
  effect(() => {
    parentEffectRunTime++;

    effect(() => {
      childEffectRunTime++;
      obj.ok;
    });

    obj.text;
  });

  obj.text = '1234';
  assert.strictEqual(parentEffectRunTime, 2);
  assert.strictEqual(childEffectRunTime, 2);
});

test('can set value in effect', (t) => {
  const obj = makeReactive({ count: 0 });
  effect(() => {
    obj.count += 1;
  });

  obj.count = 10;

  assert.strictEqual(obj.count, 11);
});

test('support scheduler', (t) => {
  const obj = makeReactive({ count: 0 });
  effect(
    () => {
      obj.count += 1;
    },
    {
      scheduler: (fn) => {
        setTimeout(fn);
      },
    }
  );

  obj.count = 10;
  assert.strictEqual(obj.count, 10);
  return new Promise((r) => {
    setTimeout(() => {
      assert.strictEqual(obj.count, 11);
      r();
    });
  });
});

test('support scheduler for batch flush', async (t) => {
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
  let effectRunTime = 0;
  effect(
    () => {
      effectRunTime++;
      obj2.count;
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

  return new Promise((r) => {
    setTimeout(() => {
      assert.strictEqual(effectRunTime, 2);
      r();
    });
  });
});


const targetMap = new WeakMap();
let activeEffect = null;

const effect = (fn) => {
  activeEffect = fn;
  fn();
  activeEffect = null;
};

function track(target, key) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  dep.add(activeEffect);
}

function trigger(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) return;
  let dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effect) => effect());
  }
}

const obj = new Proxy(
  { ok: true, text: 'hello world' },
  {
    get(target, key) {
      track(target, key);
      return target[key];
    },
    set(target, key, newVal) {
      target[key] = newVal;
      trigger(target, key);
    },
  }
);

effect(() => {
  console.log(obj.ok ? obj.text : 'not');
});

obj.ok = false;
obj.text = '12333';


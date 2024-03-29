const targetMap = new WeakMap();
let activeEffect = null;
const effectStack = [];

function effect(fn, options) {
  const effectFn = () => {
    // fn中可能有条件分支，每次运行的时候都要重新收集一次依赖
    cleanUp(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    // 实际运行有副作用的函数，收集该副作用的依赖
    fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1] ?? null;
  };

  effectFn.deps = [];
  effectFn.options = options ?? {};

  effectFn();
}

function cleanUp(effectFn) {
  effectFn.deps.forEach((dep) => dep.delete(effectFn));
  effectFn.deps.length = 0;
}

function track(target, key) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}

function trigger(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) return;
  let deps = depsMap.get(key);
  // 运行effect函数会重新将所有的依赖解绑并重新绑定，可能会从set中清除并重新添加，可能会导致死循环
  const effectsToRun = new Set(deps);
  effectsToRun.forEach((effect) => {
    if (effect === activeEffect) {
      return;
    }

    if (effect.options.scheduler) {
      effect.options.scheduler(effect);
    } else {
      effect();
    }
  });
}

export { effect, track, trigger };

function _buildDom(vDom) {
  return typeof vDom === 'string' ? document.createTextNode(vDom) : document.createElement(vDom.tag);
}

function _setSingleAttribute(dom, name, value) {
  if (name === 'className') {
    name = 'class';
  } else if (/on\w+/.test(name)) {
    name = name.toLowerCase();
    dom[name] = value || '';
  } else if (name === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    } else if (value && typeof value === 'object') {
      for (let name in value) {
        dom.style[name] = typeof value[name] === 'number'
          ? value[name] + 'px' : value[name];
      }
    }
  } else {
    if (name in dom) {
      dom[name] = value || '';
    }

    if (value) {
      dom.setAttribute(name, value);
    } else {
      dom.removeAttribute(name);
    }
  }
};

function _setAttributes(dom, attrs) {
  if (!attrs) {
    return;
  }

  Object.keys(attrs).forEach(key => {
    const value = attrs[key];
    _setSingleAttribute(dom, key, value);
  });
}

function _reconcile(vDom, bundle) {
  const { dom: preDom, container, vDom: prevVDom } = bundle;

  // 处理dom
  let dom = preDom;
  if (!dom) {
    // 初始添加
    dom = _buildDom(vDom);
    container.appendChild(dom);
  } else if (prevVDom.tag && prevVDom.tag !== vDom.tag) {
    // 替换
    dom = _buildDom(vDom);
    bundle = createBundle(vDom, dom, container);
    container.replaceChild(dom, preDom);
  } else {
    // 更新
    if (typeof vDom === 'string' && dom.textContent !== vDom) {
      dom.textContent = vDom;
    }

    const childrenDomToRemove = dom && [].slice.call(dom.childNodes, (vDom.children || []).length) || [];
    childrenDomToRemove.forEach(child => dom.removeChild(child));
  }

  // 处理attr
  _setAttributes(dom, vDom.attrs);

  // 处理chirldren
  if (vDom.children) {
    bundle.childrenBundle = vDom.children.map((child, index) => (
      _reconcile(child, bundle.childrenBundle[index] || createBundle(child, null, dom)
    )));
  }

  bundle.vDom = vDom;
  bundle.dom = dom;
  return bundle;
}

function createBundle(vDom, dom, container) {
  return {
    vDom,
    dom,
    container,
    childrenBundle: []
  }
}

function reconcile(vDom, container) {
  if (!container.bundle) {
    container.bundle = createBundle(vDom, null, container)
  }
  return _reconcile(vDom, container.bundle);
}

export default {
  render: (vDom, container) => {
    return reconcile(vDom, container);
  }
};

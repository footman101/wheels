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
  const { dom: preDom, container, vDom: prevVDom, component: prevComponent, childrenBundle: prevChildBundle } = bundle;

  let component = prevComponent;
  if (typeof vDom.tag === 'function') {
    if (component && component.constructor === vDom.tag) {
      component.componentWillUpdate();
      component.props = vDom.attrs;
      const newVDom = component.render();
      const result = _reconcile(newVDom, createBundle(bundle.vDom, bundle.dom, bundle.container, null, bundle.childrenBundle));
      component.componentDidUpdate();
      return result;
    } else {
      if (prevComponent) {
        prevComponent.componentWillUnmount();
      }
      component = new vDom.tag(vDom.attrs);
      component.constructor = vDom.tag;
      component.componentWillMount();
      const newVDom = component.render();
      const result = _reconcile(newVDom, createBundleWithContainer(bundle.container));
      result.component = component;
      component.componentDidMount();
      return result;
    }
  }

  if (prevComponent) {
    prevComponent.componentWillUnmount();
  }

  // 处理dom
  let dom = preDom;
  let childrenBundle = prevChildBundle;
  if (!dom) {
    // 初始添加
    dom = _buildDom(vDom);
    container.appendChild(dom);
  } else if (prevVDom.tag && prevVDom.tag !== vDom.tag) {
    // 替换
    dom = _buildDom(vDom);
    container.replaceChild(dom, preDom);
    childrenBundle = [];
  } else {    // 更新
    if (typeof vDom === 'string' && dom.textContent !== vDom) {
      dom.textContent = vDom;
    }

    const childrenDomToRemove = dom && [].slice.call(dom.childNodes, (vDom.children || []).length) || [];
    childrenDomToRemove.forEach(child => dom.removeChild(child));
  }

  // 处理attr
  _setAttributes(dom, vDom.attrs);

  // 处理children
  if (vDom.children) {
    childrenBundle = vDom.children.map((child, index) => (
      _reconcile(child, childrenBundle[index] || createBundleWithContainer(dom)
    )));
  } else {
    childrenBundle = [];
  }

  return {
    vDom,
    dom,
    childrenBundle,
    container,
    component
  };
}

function createBundle(vDom, dom, container, component, childrenBundle = []) {
  return {
    vDom,
    dom,
    container,
    childrenBundle,
    component
  }
}

function createBundleWithContainer(container) {
  return createBundle(null, null, container, null)
}

function reconcile(vDom, container) {
  container.bundle = _reconcile(vDom, container.bundle || createBundleWithContainer(container));
}

export default {
  render: (vDom, container) => {
    return reconcile(vDom, container);
  }
};

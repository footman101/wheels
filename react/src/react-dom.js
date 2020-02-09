function _buildNewDom(vnode) {
  return typeof vnode === 'string' ? document.createTextNode(vnode) : document.createElement(vnode.tag);
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

function _reconciliation(vnode, dom, container) {
  if (typeof vnode === 'string') {
    if (!dom) {
      container.appendChild(_buildNewDom(vnode));
    } else if (dom.nodeType !== Node.TEXT_NODE) {
      container.replaceChild(dom, _buildNewDom(vnode));
    } else if (dom.textContent !== vnode) {
      dom.textContent = vnode;
    }

    return;
  }

  let newDom = dom;
  if (!dom) {
    newDom = _buildNewDom(vnode);
    container.appendChild(newDom);
  } else if (dom.nodeType !== Node.ELEMENT_NODE) {
    newDom = _buildNewDom(vnode);
    container.replaceChild(dom, newDom);
  }
  
  _setAttributes(newDom, vnode.attrs);

  vnode.children.forEach((child, index) => _reconciliation(child, dom && dom.childNodes[index], newDom));

  const childrenDomToRemove = dom && [].slice.call(dom.childNodes, vnode.children.length) || [];
  childrenDomToRemove.forEach(child => newDom.removeChild(child));
}

function reconciliation(vnode, container) {
  return _reconciliation(vnode, container.childNodes[0], container);
}

export default {
  render: (vnode, container) => {
    return reconciliation(vnode, container);
  }
};

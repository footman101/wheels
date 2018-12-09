function createElement(tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children
  }
}

const React = {
  createElement
};

const ReactDOM = {
  render: (vnode, container) => {
    container.innerHTML = '';
    return render(vnode, container);
  }
}

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);

function tick() {
  const element = (
      <div>
          <h1>Hello, world!</h1>
          <h2>It is {new Date().toLocaleTimeString()}.</h2>
      </div>
    );
  ReactDOM.render(
      element,
      document.getElementById( 'root' )
  );
}

setInterval( tick, 1000 );

const element = (
  <div>
    hello <span>world!</span>
  </div>
);

console.log(element);

function render(vnode, container) {
  if (typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode);
    return container.appendChild(textNode);
  }

  const dom = document.createElement(vnode.tag);

  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(key => {
      const value = vnode.attrs[key];
      setAttribute(dom, key, value);
    });
  }

  vnode.children.forEach(child => render(child, dom));

  return container.appendChild(dom);
}

function setAttribute(dom, name, value) {
  if (name === 'className'){
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
}
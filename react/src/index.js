import React from './react';
import ReactDOM from './react-dom';

const vnode = () => (
  <div style="color: pink">
    <div>
      sdfasdf
    </div>
    <h1>Hello, world!</h1>
    <h1>Hello, world!</h1>
    <h1>Hello, world!</h1>
    <h1>Hello, world!</h1>
    <h2>It is {new Date().toLocaleTimeString()}.</h2>
  </div>
);

ReactDOM.render(
  vnode(),
  document.getElementById('root')
);

setTimeout(() => {
  ReactDOM.render(
    (
      <div style="color: blue">
        <div>
          1111
        </div>
        <h1>dsfasdf</h1>
      </div>
    ),
    document.getElementById('root')
  );
}, 1000);
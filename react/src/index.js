import React from './react';
import ReactDOM from './react-dom';

class App extends React.Component {
  render() {
    return <div>App {this.props.text}</div>;
  }
}

const vnode = () => (
  <div style="color: pink">
    <div>
      sdfasdf
    </div>
    <App text="hello" />
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
        sgergre
        <div>dfasd</div>
        <App text="hello1111" />
        <App text="hello1111" />
        <App text="hello1111" />
      </div>
    ),
    document.getElementById('root')
  );
}, 1000);
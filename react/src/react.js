function createElement(tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children
  }
}

class Component {
  constructor(props) {
    this.props = props
  }

  componentWillMount() {
    console.log('will mount');
  }

  componentDidMount() {
    console.log('Did mount');
  }

  componentWillUpdate() {
    console.log('will update');
  }

  componentDidUpdate() {
    console.log('did update');
  }

  componentWillUnmount() {
    console.log('will unmount');
  }

  render() {
    return '';
  }
}

export default {
  createElement,
  Component
};
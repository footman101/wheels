function stringifyJSX(key, value) {
  if (value === Symbol.for('react.element')) {
    return '$RE';
  } else if (typeof value === 'string' && value.startsWith('$')) {
    return '$' + value;
  } else {
    return value;
  }
}

export default stringifyJSX;

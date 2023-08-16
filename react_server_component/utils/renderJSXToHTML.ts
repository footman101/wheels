import escapeHtml from 'npm:escape-html';

async function renderJSXToHTML(jsx: JSX.Element): Promise<string> {
  if (typeof jsx === 'string' || typeof jsx === 'number') {
    return escapeHtml(jsx);
  }

  if (jsx == null || typeof jsx === 'boolean') {
    return '';
  }

  if (Array.isArray(jsx)) {
    const children = await Promise.all(
      jsx.map((child) => renderJSXToHTML(child))
    );
    return children.join('');
  }

  if (typeof jsx === 'object') {
    if ((jsx as any).$$typeof !== Symbol.for('react.element')) {
      throw new Error('Cannot render an object.');
    }

    if (typeof jsx.type === 'string') {
      let html = '<' + jsx.type;

      Object.keys(jsx.props).forEach((propName) => {
        if (propName !== 'children') {
          html += ' ';
          html += propName;
          html += '=';
          html += escapeHtml(jsx.props[propName]);
        }
      });

      html += '>';
      html += await renderJSXToHTML(jsx.props.children);
      html += '</' + jsx.type + '>';
      return html;
    }

    if (typeof jsx.type === 'function') {
      const Component = jsx.type;
      const props = jsx.props;
      const returnedJsx = await Component(props);
      return renderJSXToHTML(returnedJsx);
    }
  }

  throw new Error('Not implemented.');
}

export default renderJSXToHTML;

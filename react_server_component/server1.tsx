// Start listening on port 9000 of localhost.
const server = Deno.listen({ port: 9000 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:9000/`);

// Connections to the server will be yielded up as an async iterable.
for await (const conn of server) {
  // In order to not be blocking, we need to handle each connection individually
  // without awaiting the function
  serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {
  // This "upgrades" a network connection into an HTTP connection.
  const httpConn = Deno.serveHttp(conn);
  // Each request sent over the HTTP connection will be yielded as an async
  // iterator from the HTTP connection.
  for await (const requestEvent of httpConn) {
    // The native HTTP server uses the web standard `Request` and `Response`
    // objects.

    const decoder = new TextDecoder('utf-8');
    const data = await Deno.readFile('./posts/hello-world.txt');
    const postContent = decoder.decode(data);
    const body = postContent;
    // The requestEvent's `.respondWith()` method is how we send the response
    // back to the client.
    requestEvent.respondWith(
      new Response(body, {
        status: 200,
      })
    );
  }
}

// for await (const req of server) {
//   const author = 'Jae Doe';
//   const decoder = new TextDecoder('utf-8');
//   const data = await Deno.readFile('./posts/hello-world.txt');
//   const postContent = decoder.decode(data);

//   sendHTML(
//     req,
//     <html>
//       <head>
//         <title>My blog</title>
//       </head>
//       <body>
//         <nav>
//           <a href="/">Home</a>
//           <hr />
//         </nav>
//         <article>{postContent}</article>
//         <footer>
//           <hr />
//           <p>
//             <i>
//               (c) {author} {new Date().getFullYear()}
//             </i>
//           </p>
//         </footer>
//       </body>
//     </html>
//   );
// }

// async function sendHTML(res: any, jsx: any) {
//   const html = renderJSXToHTML(jsx);
//   res.headers.set('Content-Type', 'text/html');
//   res.respond({ body: html });
// }

// function renderJSXToHTML(jsx: any): string {
//   if (typeof jsx === 'string' || typeof jsx === 'number') {
//     return escapeHtml(String(jsx));
//   } else if (jsx == null || typeof jsx === 'boolean') {
//     return '';
//   } else if (Array.isArray(jsx)) {
//     return jsx.map((child) => renderJSXToHTML(child)).join('');
//   } else if (typeof jsx === 'object') {
//     if (jsx.$$typeof === Symbol.for('react.element')) {
//       let html = '<' + jsx.type;
//       for (const propName in jsx.props) {
//         if (
//           Object.prototype.hasOwnProperty.call(jsx.props, propName) &&
//           propName !== 'children'
//         ) {
//           html += ` ${propName}="${escapeHtml(String(jsx.props[propName]))}"`;
//         }
//       }
//       html += '>';
//       html += renderJSXToHTML(jsx.props.children);
//       html += '</' + jsx.type + '>';
//       return html;
//     } else throw new Error('Cannot render an object.');
//   } else throw new Error('Not implemented.');
// }

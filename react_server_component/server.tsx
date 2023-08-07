import { NHttp } from 'https://deno.land/x/nhttp@0.7.2/mod.ts';
import renderJSXToHTML from './renderJSXToHTML.ts';
// @deno-types="https://deno.land/x/types/react/v18.2.0/react.d.ts"
import * as React from 'https://jspm.dev/react@18.2.0';
import escapeHtml from 'npm:escape-html';

const app = new NHttp();

app.get('/hello', async (rev) => {
  const decoder = new TextDecoder('utf-8');
  const data = await Deno.readFile('./posts/hello-world.txt');
  const postContent = decoder.decode(data);
  const author = 'Jae Doe';

  const body = (
    <html>
      <head>
        <title>My blog</title>
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <hr />
        </nav>
        <article>{postContent}</article>
        <footer>
          <hr />
          <p>
            <i>
              (c) {author}, {new Date().getFullYear()}
            </i>
          </p>
        </footer>
      </body>
    </html>
  );
  rev.response.header({
    'content-type': 'text/html; charset=utf-8',
  });
  rev.response.send(renderJSXToHTML(body));
});

app.listen(9000, () => {
  console.log('> Running on port 9000');
});

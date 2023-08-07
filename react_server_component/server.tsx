import { NHttp } from 'https://deno.land/x/nhttp@0.7.2/mod.ts';
import renderJSXToHTML from './renderJSXToHTML.ts';
// @deno-types="https://deno.land/x/types/react/v18.2.0/react.d.ts"
import * as React from 'https://jspm.dev/react@18.2.0';
import escapeHtml from 'npm:escape-html';
import BlogPostPage from './components/BlogPostPage.tsx';

const app = new NHttp();

app.get('/hello', async (rev) => {
  const decoder = new TextDecoder('utf-8');
  const data = await Deno.readFile('./posts/hello-world.txt');
  const postContent = decoder.decode(data);
  const author = 'Jae Doe';

  const body = <BlogPostPage postContent={postContent} author={author} />;

  rev.response.header({
    'content-type': 'text/html',
  });
  rev.response.send(renderJSXToHTML(body));
});

app.listen(9000, () => {
  console.log('> Running on port 9000');
});

import { HttpResponse, NHttp } from 'https://deno.land/x/nhttp@0.7.2/mod.ts';
import renderJSXToHTML from './renderJSXToHTML.ts';
import * as React from 'https://jspm.dev/react@18.2.0';
import BlogPostPage from './components/BlogPostPage.tsx';
import BlogIndexPage from './components/BlogIndexPage.tsx';
import BlogLayout from './components/BlogPostLayout.tsx';

import sanitizeFilename from 'npm:sanitize-filename';
import throwNotFound from './throwNotFound.tsx';

const app = new NHttp();

const makeResponse = (response: HttpResponse, page: any) => {
  response.header({
    'content-type': 'text/html',
  });
  response.send(renderJSXToHTML(<BlogLayout>{page}</BlogLayout>));
};

app.get('/', async (rev) => {
  console.log('req', rev.url);

  const postSlugs = [];
  const postContents = [];

  for await (const dirEntry of Deno.readDir('./posts')) {
    const fileName = dirEntry.name;
    postSlugs.push(fileName.slice(0, fileName.lastIndexOf('.')));

    const decoder = new TextDecoder('utf-8');
    const data = await Deno.readFile(`./posts/${fileName}`);
    postContents.push(decoder.decode(data));
  }

  const page = (
    <BlogIndexPage postContents={postContents} postSlugs={postSlugs} />
  );

  makeResponse(rev.response, page);
});

app.get('/*', async (rev) => {
  console.log('req', rev.url);
  const postSlug = sanitizeFilename(rev.path.slice(1));

  try {
    const postPath = './posts/' + postSlug + '.txt';
    const decoder = new TextDecoder('utf-8');
    const data = await Deno.readFile(postPath);
    const postContent = decoder.decode(data);
    const page = <BlogPostPage postSlug={postSlug} postContent={postContent} />;

    makeResponse(rev.response, page);
  } catch (err) {
    throwNotFound(rev.response, err);
  }
});

app.listen(9000, () => {
  console.log('> Running on port 9000');
});

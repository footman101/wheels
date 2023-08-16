import nhttp, { HttpResponse } from 'https://deno.land/x/nhttp@1.3.7/mod.ts';
import serveStatic from 'https://deno.land/x/nhttp@1.3.7/lib/serve-static.ts';
import React from 'npm:react';
import type {} from 'npm:@types/react';
import type {} from 'npm:@types/react-dom';
import sanitizeFilename from 'npm:sanitize-filename';

import renderJSXToHTML from './renderJSXToHTML.ts';
import BlogPostPage from './components/BlogPostPage.tsx';
import BlogIndexPage from './components/BlogIndexPage.tsx';
import BlogLayout from './components/BlogPostLayout.tsx';
import { isNotFoundError } from './throwNotFound.ts';

const app = nhttp();

app.use((rev, next) => {
  console.log('req', rev.url);
  return next();
});

app.use('/assets', serveStatic('assets'));

const makeHtmlResponse = async (response: HttpResponse, page: JSX.Element) => {
  let body = '';
  try {
    body = await renderJSXToHTML(<BlogLayout>{page}</BlogLayout>);
  } catch (error) {
    if (isNotFoundError(error)) {
      response.status(404);
    } else {
      response.status(500);
    }

    response.send(`${error.message} ${error.cause}`);
  }

  response.header({
    'content-type': 'text/html',
  });
  response.send(body);
};

app.get('/', (rev) => {
  makeHtmlResponse(rev.response, <BlogIndexPage />);
});

app.get('/:slug', (rev) => {
  const postSlug = sanitizeFilename(rev.params.slug);
  makeHtmlResponse(rev.response, <BlogPostPage postSlug={postSlug} />);
});

app.listen(9000, () => {
  console.log('> Running on port 9000');
});

import nhttp from 'https://deno.land/x/nhttp@1.3.7/mod.ts';
import serveStatic from 'https://deno.land/x/nhttp@1.3.7/lib/serve-static.ts';
import React from 'npm:react';
import type {} from 'npm:@types/react';
import type {} from 'npm:@types/react-dom';

import Router from './components/Router.tsx';
import sendHtml from './utils/sendHtml.tsx';
import sendJSX from './utils/sendJSX.tsx';

const app = nhttp();

app.use((rev, next) => {
  console.log(new Date(), 'req incoming', rev.url);
  return next();
});

app.use('/assets', serveStatic('assets'));

app.get('*', ({ response, path, query }) => {
  if (Object.hasOwn(query, 'jsx')) {
    sendJSX(response, <Router path={path} />);
  } else {
    sendHtml(response, <Router path={path} />);
  }
});

app.listen(9000, () => {
  console.log('> Running on port 9000');
});

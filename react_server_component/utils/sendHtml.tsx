import { HttpResponse } from 'https://deno.land/x/nhttp@1.3.7/mod.ts';
import renderJSXToHTML from './renderJSXToHTML.ts';
import renderJSXToClientJSX from './renderJSXToClientJSX.ts';
import stringifyJSX from './stringifyJSX.ts';
import { renderToString } from 'npm:react-dom/server';

const sendHtml = async (response: HttpResponse, jsx: JSX.Element) => {
  const clientJSX = await renderJSXToClientJSX(jsx);
  // let html = await renderJSXToHTML(clientJSX);
  let html = renderToString(clientJSX);

  console.log(html);

  const clientJSXString = JSON.stringify(clientJSX, stringifyJSX);
  html += `<script>window.__INITIAL_CLIENT_JSX_STRING__ = `;
  html += JSON.stringify(clientJSXString).replace(/</g, '\\u003c');
  html += `</script>`;

  html += `
    <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@canary",
          "react-dom/client": "https://esm.sh/react-dom@canary/client"
        }
      }
    </script>
    <script type="module" src="/assets/client.js"></script>
  `;

  response.header({
    'content-type': 'text/html',
  });
  response.send(html);
};

export default sendHtml;

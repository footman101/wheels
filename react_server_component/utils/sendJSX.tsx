import { HttpResponse } from 'https://deno.land/x/nhttp@1.3.7/mod.ts';
import renderJSXToClientJSX from './renderJSXToClientJSX.ts';
import stringifyJSX from './stringifyJSX.ts';

const sendJSX = async (response: HttpResponse, jsx: JSX.Element) => {
  const clientJSX = await renderJSXToClientJSX(jsx);
  const jsxString = JSON.stringify(clientJSX, stringifyJSX, 2);
  response.header({ 'content-type': 'application/json' });
  response.send(jsxString);
};

export default sendJSX;

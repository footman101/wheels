import { HttpResponse } from 'https://deno.land/x/nhttp@0.7.2/mod.ts';

const throwNotFound = (response: HttpResponse, e) => {
  response.status(404);
  response.send(e.message);
};

export default throwNotFound;

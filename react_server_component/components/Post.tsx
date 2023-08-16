import React from 'npm:react';
import readFile from '../utils/readFile.ts';
import { HttpError } from 'https://deno.land/x/nhttp@1.3.7/mod.ts';
import sanitizeFilename from 'npm:sanitize-filename';

const Post = async ({ slug }: { slug: string }) => {
  let content;
  try {
    content = await readFile(`./posts/${sanitizeFilename(slug)}.txt`);
  } catch (err) {
    throw new HttpError(404, `post ${slug} not found`);
  }

  return (
    <section>
      <h2>
        <a href={'/' + slug}>{slug}</a>
      </h2>
      <article>{content}</article>
    </section>
  );
};

export default Post;

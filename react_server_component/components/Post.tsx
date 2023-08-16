import React from 'npm:react';
import throwNotFound from '../throwNotFound.ts';
import readFile from '../utils/readFile.ts';

const Post = async ({ slug }: { slug: string }) => {
  let content;
  try {
    content = await readFile(`./posts/${slug}.txt`);
  } catch (err) {
    throwNotFound(err.cause);
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

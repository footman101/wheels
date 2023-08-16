import React from 'npm:react';
import Post from './Post.tsx';

async function BlogIndexPage() {
  const postSlugs = [];

  for await (const dirEntry of Deno.readDir('./posts')) {
    const fileName = dirEntry.name;
    postSlugs.push(fileName.slice(0, fileName.lastIndexOf('.')));
  }

  return (
    <section>
      <h1>Welcome to my blog</h1>
      <div>
        {postSlugs.map((postSlug) => (
          <Post slug={postSlug} key={postSlug} />
        ))}
      </div>
    </section>
  );
}

export default BlogIndexPage;

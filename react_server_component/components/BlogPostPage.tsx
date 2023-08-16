import React from 'npm:react';

import Post from './Post.tsx';

function BlogPostPage({ postSlug }: { postSlug: string }) {
  return <Post slug={postSlug} />;
}

export default BlogPostPage;

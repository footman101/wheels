import React from 'npm:react';
import BlogIndexPage from './BlogIndexPage.tsx';
import BlogPostPage from './BlogPostPage.tsx';
import BlogLayout from './BlogPostLayout.tsx';

const Router = ({ path }: { path: string }) => {
  let page;
  if (path === '/') {
    page = <BlogIndexPage />;
  } else {
    page = <BlogPostPage postSlug={path.slice(1)} />;
  }
  return <BlogLayout>{page}</BlogLayout>;
};

export default Router;

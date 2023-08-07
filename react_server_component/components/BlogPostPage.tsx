import Footer from './Footer.tsx';
import * as React from 'https://jspm.dev/react@18.2.0';

function BlogPostPage({
  postContent,
  author,
}: {
  postContent: string;
  author: string;
}) {
  return (
    <html>
      <head>
        <title>My blog</title>
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <hr />
        </nav>
        <article>{postContent}</article>
        <Footer author={author} />
      </body>
    </html>
  );
}

export default BlogPostPage;

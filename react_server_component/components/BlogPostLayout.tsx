import Footer from './Footer.tsx';
import React from 'npm:react';

const BlogLayout = ({ children }: React.PropsWithChildren) => {
  const author = 'Jae Doe';
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
        <main>{children}</main>
        <Footer author={author} />
        <script type="module" src="/assets/client.js"></script>
      </body>
    </html>
  );
};

export default BlogLayout;

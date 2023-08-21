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
        <input />
        <nav>
          <a href="/">Home</a>
          <hr />
        </nav>
        <main>{children}</main>
        <Footer author={author} />
      </body>
    </html>
  );
};

export default BlogLayout;

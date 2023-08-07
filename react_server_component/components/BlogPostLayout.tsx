import Footer from './Footer.tsx';
import * as React from 'https://jspm.dev/react@18.2.0';

function BlogLayout({ children }) {
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
      </body>
    </html>
  );
}

export default BlogLayout;
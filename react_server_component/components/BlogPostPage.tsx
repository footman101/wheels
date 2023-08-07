import Footer from './Footer.tsx';
import * as React from 'https://jspm.dev/react@18.2.0';

function BlogPostPage({ postSlug, postContent }) {
  return (
    <section>
      <h2>
        <a href={'/' + postSlug}>{postSlug}</a>
      </h2>
      <article>{postContent}</article>
    </section>
  );
}

export default BlogPostPage;

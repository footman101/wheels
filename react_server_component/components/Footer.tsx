import * as React from 'https://jspm.dev/react@18.2.0';

function Footer({ author }: { author: string }) {
  return (
    <footer>
      <hr />
      <p>
        <i>
          (c) {author} {new Date().getFullYear()}
        </i>
      </p>
    </footer>
  );
}

export default Footer;

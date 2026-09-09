import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Loreloom — choose who your character appears to be, then play a short story where your choices decide who they become."
        />
        <meta name="theme-color" content="#0a0912" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

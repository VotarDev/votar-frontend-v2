import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />

        <Script
          src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js"
          strategy="afterInteractive"
        />
        <script src="https://js.paystack.co/v1/inline.js"></script>
      </body>
    </Html>
  );
}

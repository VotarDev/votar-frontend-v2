import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google tag (Tag Manager GTM-TCBWL7F4): first in <head>, once for
            every page. Production builds only, so local development doesn't
            show up in analytics. */}
        {IS_PRODUCTION && (
          <>
            <script
              async
              src="https://www.googletagmanager.com/gtm.js?id=GTM-TCBWL7F4"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`,
              }}
            />
          </>
        )}
      </Head>
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

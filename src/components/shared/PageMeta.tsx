import React from "react";
import Head from "next/head";
import { DEFAULT_META, SITE_URL } from "@/utils/pageMeta";

const SHARE_IMAGE =
  "https://res.cloudinary.com/kingkunmi/image/upload/v1726422889/Screenshot_2024-09-15_at_18.04.46_igftax_c_fill_w_1200_h_630_p1sqdh.png";

interface PageMetaProps {
  /** Page name; shown as "<title> | Votar". Leave out for the home page. */
  title?: string;
  description?: string;
  /** Path for the canonical/og:url, e.g. "/about". */
  path?: string;
  image?: string;
  /** Keep the page out of search results (signed-in, admin, ballot pages). */
  noIndex?: boolean;
}

/**
 * Title, description and social-sharing tags. Every tag has a `key`, so a
 * page's own <PageMeta> replaces the defaults set in _app instead of
 * duplicating them.
 */
const PageMeta = ({
  title,
  description = DEFAULT_META.description,
  path,
  image = SHARE_IMAGE,
  noIndex,
}: PageMetaProps) => {
  const fullTitle = title ? `${title} | Votar` : "Votar – Secure online voting";
  const url = path ? `${SITE_URL}${path === "/" ? "/" : path}` : undefined;
  return (
    <Head>
      <title key="title">{fullTitle}</title>
      <meta key="description" name="description" content={description} />
      <meta key="robots" name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta key="og:title" property="og:title" content={fullTitle} />
      <meta key="og:description" property="og:description" content={description} />
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:site_name" property="og:site_name" content="Votar" />
      <meta key="og:image" property="og:image" content={image} />
      <meta key="og:locale" property="og:locale" content="en_US" />
      {url && <meta key="og:url" property="og:url" content={url} />}
      {url && !noIndex && <link key="canonical" rel="canonical" href={url} />}
      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:title" name="twitter:title" content={fullTitle} />
      <meta key="twitter:description" name="twitter:description" content={description} />
      <meta key="twitter:image" name="twitter:image" content={image} />
    </Head>
  );
};

export default PageMeta;

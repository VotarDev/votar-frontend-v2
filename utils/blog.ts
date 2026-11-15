import type { PostItem } from "./types";

/** The post's cover: the feed's thumbnail, else the first image in it. */
export const postImage = (post: PostItem): string => {
  if (post.thumbnail) return post.thumbnail;
  const match = /<img[^>]+src="([^"]+)"/i.exec(post.description || post.content || "");
  return match ? match[1] : "";
};

/** Plain-text summary from the first paragraph. */
export const postExcerpt = (post: PostItem, length = 180): string => {
  const html = post.description || post.content || "";
  const firstParagraph = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(html)?.[1] ?? html;
  const text = firstParagraph
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
};

/** e.g. "12 Mar 2025". */
export const postDate = (post: PostItem): string => {
  const date = new Date((post.pubDate || "").replace(" ", "T"));
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

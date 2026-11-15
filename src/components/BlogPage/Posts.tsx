import React, { useMemo, useState } from "react";
import { PiCaretRightBold } from "react-icons/pi";
import { BiSearch } from "react-icons/bi";
import { motion } from "framer-motion";
import { fadeInAnimation } from "@/utils/util";
import { PostItem } from "@/utils/types";
import { postDate, postExcerpt, postImage } from "@/utils/blog";
import SuccessStory from "./SuccessStory";

const PAGE = 3; // posts added per "See more posts", as before

interface PostsProps {
  posts: PostItem[];
  isLoading: boolean;
  error: boolean;
  onRetry: () => void;
}

const PostCard = ({ post, index }: { post: PostItem; index: number }) => (
  <motion.a
    href={post.link}
    target="_blank"
    rel="noreferrer"
    className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl transition-shadow hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#015ce9]/30"
    variants={fadeInAnimation}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
    custom={index % PAGE}
  >
    <div className="relative h-[160px] overflow-hidden bg-[#012E75]">
      {postImage(post) && (
        <img
          src={postImage(post)}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
      <h3 className="absolute inset-x-0 bottom-0 line-clamp-2 p-4 text-[18px] font-bold leading-snug text-[#f6fafd]">
        {post.title}
      </h3>
    </div>
    <div className="flex flex-1 flex-col p-4">
      {postDate(post) && <p className="text-xs font-medium text-[#7c8e9b]/80">{postDate(post)}</p>}
      <p className="mt-2 line-clamp-4 flex-1 text-[#7c8e9b]">{postExcerpt(post)}</p>
      <span className="mt-4 flex items-center gap-1 text-sm transition-colors group-hover:text-[#015ce9]">
        Read more <PiCaretRightBold className="text-[#015ce9]" aria-hidden="true" />
      </span>
    </div>
  </motion.a>
);

const Posts = ({ posts, isLoading, error, onRetry }: PostsProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [visiblePosts, setVisiblePosts] = useState(PAGE);
  const query = searchInput.trim().toLowerCase();

  // Searching covers every post; otherwise list the ones after the featured three.
  const results = useMemo(
    () =>
      query
        ? posts.filter((post) =>
            [post.title, postExcerpt(post, 400), ...(post.categories || [])]
              .join(" ")
              .toLowerCase()
              .includes(query),
          )
        : posts.slice(3),
    [posts, query],
  );
  const shown = query ? results : results.slice(0, visiblePosts);

  return (
    <div className="bg-[#f7fafd] pb-20">
      <div className="max-w-[1300px] mx-auto px-4 lg:px-0 xl:px-10">
        <div className="max-w-[40rem] mx-auto text-center lg:text-2xl text-xl lg:pt-20 pt-10 text-[#7c8e9b]">
          <h2>
            Let&apos;s share contemporary information with you about Votar,
            e-voting, and the Global Progressive Society
          </h2>
        </div>

        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto flex max-w-[30rem] items-center pt-5 pb-10"
        >
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-12 w-full rounded-l border-[0.5px] border-[#BFBFBF] bg-white px-4 outline-none transition-shadow focus:border-[#015ce9] focus:ring-4 focus:ring-[#015ce9]/10"
            placeholder="Search for a post on the votar blog"
            aria-label="Search blog posts"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex h-12 items-center justify-center rounded-r bg-[#015ce9] px-4 text-lg text-white"
          >
            <BiSearch aria-hidden="true" />
          </button>
        </form>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[360px] animate-pulse rounded-2xl bg-white shadow-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-[#7c8e9b]">We couldn&apos;t load the latest posts.</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-full bg-[#015ce9] px-6 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : query && results.length === 0 ? (
          <p className="py-10 text-center text-[#7c8e9b]">
            No posts match “{searchInput.trim()}”.
          </p>
        ) : (
          <>
            {query && (
              <p className="mb-6 text-center text-sm text-[#7c8e9b]">
                {results.length} post{results.length === 1 ? "" : "s"} found
              </p>
            )}
            <div className="grid grid-cols-1 items-stretch gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((post, index) => (
                <PostCard key={post.guid || post.title} post={post} index={index} />
              ))}
            </div>
            {!query && visiblePosts < results.length && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisiblePosts((n) => n + PAGE)}
                  className="rounded-full bg-white px-6 py-3 text-[#7c8e9b] shadow-lg transition-colors hover:bg-[#015ce9] hover:text-white"
                >
                  See more posts
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <SuccessStory />
    </div>
  );
};

export default Posts;

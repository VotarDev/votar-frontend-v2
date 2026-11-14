import React from "react";
import { PiCaretRightBold } from "react-icons/pi";
import { PostItem } from "@/utils/types";
import { postDate, postImage } from "@/utils/blog";

/** The three newest posts, overlapping the blue hero. */
const Card = ({ posts, isLoading }: { posts: PostItem[]; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="lg:mb-20 mb-10 flex lg:gap-10 gap-5 lg:mt-[-6rem] mt-5 justify-center lg:flex-row flex-col">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[300px] w-full animate-pulse rounded-xl bg-slate-200 lg:w-[400px]" />
        ))}
      </div>
    );
  }
  if (posts.length === 0) return <div className="lg:mb-20 mb-10" />;

  return (
    <div className="lg:mb-20 mb-10">
      <div className="flex lg:gap-10 gap-5 lg:mt-[-6rem] text-[#f8f8f8] justify-center mt-5 lg:flex-row flex-col">
        {posts.map((post) => (
          <a
            key={post.guid || post.title}
            href={post.link}
            target="_blank"
            rel="noreferrer"
            className="group relative block h-[300px] w-full overflow-hidden rounded-xl shadow-lg lg:w-[400px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#015ce9]/40"
          >
            {postImage(post) ? (
              <img
                src={postImage(post)}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-[#012E75]" />
            )}
            {/* Darker towards the bottom so the title and link stay readable. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <div className="relative flex h-full flex-col p-5">
              <span className="w-fit rounded-2xl bg-[#015ce9] py-2 px-4 text-xs">NEW</span>
              <h3 className="mt-auto line-clamp-3 text-xl font-semibold leading-snug">{post.title}</h3>
              <div className="mt-3 flex items-center justify-between text-sm text-white/80">
                <span>{postDate(post)}</span>
                <span className="flex items-center gap-1 font-medium text-white transition-colors group-hover:text-[#8fb4ff]">
                  Read more <PiCaretRightBold className="text-[#8fb4ff]" aria-hidden="true" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Card;

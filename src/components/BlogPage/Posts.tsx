import React, { useEffect, useState } from "react";
import { PiCaretRightBold } from "react-icons/pi";
import { motion } from "framer-motion";
import { fadeInAnimation } from "@/utils/util";
import SuccessStory from "./SuccessStory";
import { getPost } from "@/utils/api";
import { ThreeDots } from "react-loader-spinner";
import { ToText } from "@/utils/util";
import { PostItem } from "@/utils/types";
import { BiSearch } from "react-icons/bi";

const Posts = () => {
  const [mediumPosts, setMediumPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [searchedPosts, setSearchedPosts] = useState<PostItem[]>([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const mediumUrl = await getPost();
      if (mediumUrl) {
        setMediumPosts(mediumUrl.data.items);
        setIsLoading(false);
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const loadMorePosts = () => {
    setVisiblePosts(visiblePosts + 3);
  };
  let previousPosts = mediumPosts.slice(3);
  let visiblePostData = previousPosts.slice(0, visiblePosts);

  const handleSearchHandler = (e: any) => {
    e.preventDefault();
    if (!searchInput) {
      return setSearchedPosts([]);
    }
    const postsData = mediumPosts.filter((post) =>
      post.title.toLowerCase().includes(searchInput.toLowerCase())
    );
    setSearchedPosts(postsData);
  };

  if (isLoading) {
    return (
      <div className="max-w-[1300px] mx-auto px-4 lg:px-0 xl:px-10">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#015ce9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#f7fafd] pb-20">
      <div className="max-w-[1300px] mx-auto px-4 lg:px-0 xl:px-10">
        <div className="max-w-[40rem] mx-auto text-center lg:text-2xl text-xl lg:pt-20 pt-10 text-[#7c8e9b]">
          <h2>
            Let&apos;s share contemporary information with you about Votar,
            e-voting, and the Global Progressive Society
          </h2>
        </div>
        <div className="max-w-[40rem] mx-auto pt-5 pb-10">
          <form onSubmit={handleSearchHandler}>
            <div className="flex items-center justify-center">
              <input
                type="text"
                className=" py-5 px-3 outline-none rounded-tl rounded-bl border-[0.5px] border-[#BFBFBF] lg:w-1/2 w-full h-[48px]"
                placeholder="Search for a post on the votar blog"
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="bg-[#015ce9] py-5 px-3 rounded-tr rounded-br outline-none flex items-center justify-center h-[48px] text-white text-lg">
                <span>
                  <BiSearch />
                </span>
              </button>
            </div>
          </form>
        </div>

        {searchedPosts.length > 0 && (
          <>
            <h1 className="my-3 text-[38px]">Searched Posts</h1>
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-col-1 justify-center gap-10 items-stretch my-10">
              {searchedPosts.map((post, index) => {
                var tagIndex = post.description.indexOf("<img");
                var srcIndex =
                  post.description.substring(tagIndex).indexOf("src=") +
                  tagIndex;
                var srcStart = srcIndex + 5;
                var srcEnd =
                  post.description.substring(srcStart).indexOf('"') + srcStart;
                var src = post.description.substring(srcStart, srcEnd);

                return (
                  <motion.div
                    key={post.title}
                    className="rounded-2xl overflow-hidden shadow-xl pb-14 relative bg-white w-full"
                    variants={fadeInAnimation}
                    initial="initial"
                    whileInView="animate"
                    custom={index}
                  >
                    <div className="relative ">
                      <img
                        src={src}
                        alt="posts"
                        className="lg:w-full h-[150px] object-cover  w-full"
                      />
                      <div className="absolute bg-[rgba(0,0,0,0.4)] w-full h-full top-0 bottom-0"></div>
                      <div className="absolute top-8 left-0 text-[#f6fafd] text-[18px] font-bold px-4">
                        <h3>{post.title}</h3>
                      </div>
                    </div>
                    <div className="text-[#7c8e9b] text-justify p-4">
                      <p>{`${ToText(
                        post.description.substring(0, 360)
                      )}...`}</p>
                    </div>

                    <div className="absolute bottom-0 px-4 py-4 text-sm transition duration-150 ease-in hover:text-[#015ce9] cursor-pointer ">
                      <a
                        href={post.link}
                        target="_blank"
                        className="flex items-center gap-1"
                      >
                        <p>Read more</p>
                        <span>
                          <PiCaretRightBold className="text-[#015ce9]" />
                        </span>
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-col-1 justify-center gap-10 items-stretch">
          {visiblePostData.map((post, index) => {
            var tagIndex = post.description.indexOf("<img");
            var srcIndex =
              post.description.substring(tagIndex).indexOf("src=") + tagIndex;
            var srcStart = srcIndex + 5;
            var srcEnd =
              post.description.substring(srcStart).indexOf('"') + srcStart;
            var src = post.description.substring(srcStart, srcEnd);

            return (
              <motion.div
                key={post.title}
                className="rounded-2xl overflow-hidden shadow-xl pb-14 relative bg-white w-full"
                variants={fadeInAnimation}
                initial="initial"
                whileInView="animate"
                custom={index}
              >
                <div className="relative ">
                  <img
                    src={src}
                    alt="posts"
                    className="lg:w-full h-[150px] object-cover  w-full"
                  />
                  <div className="absolute bg-[rgba(0,0,0,0.4)] w-full h-full top-0 bottom-0"></div>
                  <div className="absolute top-8 left-0 text-[#f6fafd] text-[18px] font-bold px-4">
                    <h3>{post.title}</h3>
                  </div>
                </div>
                <div className="text-[#7c8e9b] text-justify p-4">
                  <p>{`${ToText(post.description.substring(0, 360))}...`}</p>
                </div>

                <div className="absolute bottom-0 px-4 py-4 text-sm transition duration-150 ease-in hover:text-[#015ce9] cursor-pointer ">
                  <a
                    href={post.link}
                    target="_blank"
                    className="flex items-center gap-1"
                  >
                    Read more
                    <span>
                      <PiCaretRightBold className="text-[#015ce9]" />
                    </span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="flex justify-end my-5 text-[#7c8e9b]">
          {visiblePosts < previousPosts.length && (
            <button onClick={loadMorePosts}>See more posts...</button>
          )}
        </div>
      </div>
      <SuccessStory />
    </div>
  );
};

export default Posts;

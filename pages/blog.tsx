import React, { useEffect, useState } from "react";
import Nav from "@/src/components/Nav";
import Hero from "@/src/components/BlogPage/Hero";
import Card from "@/src/components/BlogPage/Card";
import Posts from "@/src/components/BlogPage/Posts";
import Footer from "@/src/components/Footer";
import Chat from "@/src/components/Chat";
import { getPost } from "@/utils/api";
import type { PostItem } from "@/utils/types";

const Blog = () => {
  // Votar's Medium posts, fetched once for the whole page.
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPosts = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const { data } = await getPost();
      setPosts(Array.isArray(data?.items) ? data.items : []);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <>
      <div className=" bg-[#015CE9]">
        <Nav />
        <div className="max-w-[1300px] mx-auto px-4 lg:px-0 xl:px-10">
          <Hero latestPostUrl={posts[0]?.link} />
        </div>
      </div>
      <div className="max-w-[1300px] mx-auto px-4 lg:px-0 xl:px-10">
        <Card posts={posts.slice(0, 3)} isLoading={isLoading} />
      </div>
      <div>
        <Posts posts={posts} isLoading={isLoading} error={error} onRetry={loadPosts} />
        <Chat />
        <Footer />
      </div>
    </>
  );
};

export default Blog;

import React, { useEffect, useState } from "react";
import { PostItem } from "@/utils/types";
import { ToText } from "@/utils/util";
import { blogImages } from "@/utils/util";
import { PiCaretRightBold } from "react-icons/pi";
import { getPost } from "@/utils/api";
import Link from "next/link";

const Card = () => {
  const [mediumPosts, setMediumPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
  console.log(mediumPosts);
  return (
    <div className="lg:mb-20 mb-10">
      <div className="flex lg:gap-10 gap-5 lg:mt-[-6rem] text-[#f8f8f8] justify-center mt-5 lg:flex-row flex-col">
        {mediumPosts.slice(0, 3).map((images) => {
          var tagIndex = images.description.indexOf("<img"); // Find where the img tag starts
          var srcIndex =
            images.description.substring(tagIndex).indexOf("src=") + tagIndex; // Find where the src attribute starts
          var srcStart = srcIndex + 5; // Find where the actual image URL starts; 5 for the length of 'src="'
          var srcEnd =
            images.description.substring(srcStart).indexOf('"') + srcStart; // Find where the URL ends
          var src = images.description.substring(srcStart, srcEnd);
          console.log(src);
          return (
            <div key={images.title} className="relative">
              <div className="relative overflow-hidden">
                <img
                  src={src}
                  alt="images"
                  className="lg:w-[400px] h-[300px] object-cover rounded-xl w-full"
                />
                <div className="absolute bg-[rgba(0,0,0,0.4)] w-full h-full top-0 bottom-0 rounded-xl"></div>
              </div>

              <div className="absolute top-7 left-4 bg-[#015ce9] rounded-2xl py-2 px-4 text-xs">
                NEW
              </div>
              <div className="absolute top-20 px-4 text-xl font-semibold">
                {images.title}
              </div>
              <Link href={images.link}>
                <div className="absolute bottom-5 px-4 text-xl transition duration-150 ease-in hover:text-[#015ce9] cursor-pointer flex items-center gap-1">
                  Read more
                  <span>
                    <PiCaretRightBold className="text-[#015ce9]" />
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Card;

import React from "react";
import Link from "next/link";

const SuccessStory = () => {
  return (
    <div>
      <div className="max-w-[40rem] mx-auto text-center lg:text-3xl text-2xl lg:pt-20 pt-12 text-[#7c8e9b]">
        <h2>Want to become the next success story?</h2>
      </div>
      <div className="flex justify-center items-center my-10 gap-10 flex-wrap">
        <a
          href="https://wa.me/2348144092733?text=Hello%20Votar%2C%20I%27d%20like%20to%20share%20our%20election%20story."
          target="_blank"
          rel="noreferrer"
          className="w-[200px] h-[42px] p-4 rounded-full outline-none bg-white flex justify-center items-center shadow-lg text-[#7c8e9b] transition ease-linear duration-150 hover:bg-[#015ce9] hover:text-[#f6f6f6]"
        >
          Share Your Story
        </a>
        <Link href="/signin?create-account=signup" className="w-[200px] h-[42px] p-4 rounded-full outline-none bg-white flex justify-center items-center shadow-lg text-[#7c8e9b] transition ease-linear duration-150 hover:bg-[#015ce9] hover:text-[#f6f6f6]">
          Create Your Election
        </Link>
      </div>
    </div>
  );
};

export default SuccessStory;

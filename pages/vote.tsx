import React from "react";
import Nav from "@/src/components/Nav";
import illustration from "../public/assets/illustrations/illustration-5.svg";
import voteicon from "../public/assets/icons/vote.svg";
import illustrationBg from "../public/assets/images/vote-bg.png";
import Chat from "@/src/components/Chat";
import { useRouter } from "next/router";
import Head from "next/head";

const Vote = () => {
  const router = useRouter();
  const [electionId, setElectionId] = React.useState("");
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/access/${electionId}`);
  };
  return (
    <div>
      <Head>
        <title>Vote - Votar</title>
        <meta
          name="description"
          content="Cast your vote on Votar and make your voice heard. Participate in democratic elections today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Vote - Votar" />
        <meta
          property="og:description"
          content="Join Votar to vote and take part in elections that shape the future."
        />
        <meta property="og:url" content="https://www.votar.ng/vote" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.votar.ng/vote" />
      </Head>
      <Nav />
      <div className="flex justify-center lg:items-center w-full lg:h-[80vh] lg:gap-20 gap-10 flex-col-reverse lg:flex-row h-auto my-[7rem] lg:my-0 px-4 lg:px-0">
        <div>
          <div className="mb-5 ">
            <img src={voteicon.src} alt="vote" />
          </div>
          <div className="lg:text-5xl font-semibold lg:leading-[1.25] text-2xl leading-[1.4]">
            Welcome to the Voting Page
            <br />
            Your Choice is Visible, Your
            <br /> Voice is Heard!
          </div>
          <div>
            <form
              className="w-full flex lg:items-center lg:mt-[60px] mt-5 gap-4 flex-col lg:flex-row"
              onSubmit={onFormSubmit}
            >
              <div>
                <input
                  type="text"
                  placeholder="Enter Your Election ID"
                  value={electionId}
                  onChange={(e) => setElectionId(e.target.value)}
                  className="border-[2px] border-[#B4B4B4] lg:w-[454px] h-[52px] outline-none p-4 rounded w-full"
                />
              </div>
              <div>
                <button className="h-[52px] bg-[#015CE9] text-white font-proximaNova rounded outline-none px-10 flex items-center ">
                  Lets go vote
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="relative flex justify-center lg:block">
          <img
            src={illustration.src}
            alt="illustration"
            className="w-[300px] h-[250px] object-contain lg:w-full lg:h-auto"
          />
          <div className="absolute right-[-10rem] top-[-4rem] -z-10 hidden lg:block">
            <img src={illustrationBg.src} alt="background" />
          </div>
        </div>
      </div>
      <div>
        <Chat />
      </div>
    </div>
  );
};

export default Vote;

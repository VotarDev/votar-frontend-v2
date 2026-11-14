import React from "react";
import Reveal from "./Reveal";

// Same points and text as before.
const BENEFITS = [
  {
    title: "Increase Voter Engagement",
    text: "The Votar platform eliminates challenges and difficulties associated with elections which is a major cause of voter apathy in elections. Thus, you are sure to have an all-time high voter turnout in your election.",
  },
  {
    title: "Enjoy a more secure, credible and reliable voting process",
    text: "Votar is built with Blockchain Technology which ensures that every vote submitted by the voter is saved in an immutable record that cannot be deleted or modified.",
  },
  {
    title: "Automated and Simple Process",
    text: "A.I is embedded in the Votar platform which makes the user flow very intuitive. Setting up elections and participating in elections is easy and seamless.",
  },
  {
    title: "Real Time Results and Dynamics",
    text: "Votes are counted and displayed immediately after the voters submit them. Election committees can take advantage of result analytics tools that show different charts on the total number of votes, individual candidate's votes, and votes per sub-group.",
  },
];

const NextLevel = () => {
  return (
    <div className="max-w-[1340px] mx-auto lg:mt-28 mt-16 lg:mb-28 mb-16 px-4">
      <Reveal className="text-center lg:text-5xl font-semibold text-[30px] [text-wrap:balance]">
        <h2>Take Your Voting Process to the Next Level</h2>
      </Reveal>

      <Reveal
        delay={0.1}
        className="mx-auto grid max-w-5xl grid-cols-1 gap-x-16 gap-y-10 text-center sm:grid-cols-2 lg:gap-y-14 lg:mt-14 mt-8"
      >
        {BENEFITS.map((benefit) => (
          <div key={benefit.title} className="mx-auto max-w-[460px]">
            <h3 className="text-[#012E75] text-2xl font-semibold [text-wrap:balance]">
              {benefit.title}
            </h3>
            <p className="mt-4 lg:text-xl leading-8 text-base">{benefit.text}</p>
          </div>
        ))}
      </Reveal>
    </div>
  );
};

export default NextLevel;

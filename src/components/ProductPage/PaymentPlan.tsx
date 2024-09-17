import React from "react";
import Link from "next/link";
import check from "../../../public/assets/icons/Check_fill.svg";
import check2 from "../../../public/assets/icons/Check_fill-2.svg";
import Image from "next/image";

const PaymentPlan = () => {
  return (
    <div className="mt-[100px] mx-7">
      <div className="flex justify-center lg:max-w-[80rem] mx-auto items-stretch gap-[56px] flex-wrap w-full">
        <div className="md:max-w-[364px] w-full bg-white p-8 plan-bg relative  border border-black ">
          <div className="max-w-[110px]">
            <div className="bg-[#F1F1F1] flex justify-center lg:text-xl text-[18px] rounded font-semibold">
              Free Votar
            </div>
          </div>
          <div className="mt-4 lg:text-xl text-base underline text-[#015CE9]">
            <Link href="/signin">Create an election</Link>
          </div>
          <div className="lg:text-5xl text-3xl font-bold text-[#00122F] mt-[50px]">
            NGN 0
          </div>
          <div className="lg:text-2xl text-[18px] text-[#060606] mt-3 font-semibold">
            Per member, per Month
          </div>

          <div className="mt-6 text-sm lg:text-base">
            <div className="flex items-center gap-1">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Participate in Elections with Email
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Voting Encryption
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Election Link
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Single Votes per Position
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Mutiple Votes per Position
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Raise Funds for your events via Polls
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Live Updates/Transmission of Results
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Analytic Tools for Election
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Branded Ballots and Election Page
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Candidates Bio/Details on Ballot
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Full Customer Support
            </div>
          </div>
        </div>

        <div className="md:max-w-[364px] w-full bg-[#015CE9] p-8 plan-bg relative  border border-black text-[#F7F7F7]">
          <div className="max-w-[110px]">
            <div className="bg-[#F7F7F7] text-[#015CE9] flex justify-center lg:text-xl text-[18px] font-semibold rounded">
              Votar Pro
            </div>
          </div>
          <div className="mt-4 lg:text-xl text-base underline text-[#F7F7F7]">
            <Link href="/signin">Create an election</Link>
          </div>
          <div className="lg:text-5xl text-3xl font-bold mt-[50px]">NGN 30</div>
          <div className="lg:text-2xl text-[18px] mt-3 font-semibold">
            Per member, per Month
          </div>

          <div className="mt-6 text-sm lg:text-base">
            <div className="flex items-center gap-1">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              Participate in Elections with Email
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              Voting Encryption
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              Election Link
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              Single Votes per Position
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              Mutiple Votes per Position
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              Raise Funds for your events via Polls
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              Live Updates/Transmission of Results
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              Analytic Tools for Election
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              Branded Ballots and Election Page
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              Candidates Bio/Details on Ballot
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              Participate in an Election with your BVN
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              Election notification via SMS and Emails
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              Single vote per person
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              Two-factor Authentetication
            </div>
          </div>
        </div>

        <div className="md:max-w-[364px] w-full  bg-white p-8 plan-bg relative  border border-black">
          <div className="max-w-[150px]">
            <div className="bg-[#F1F1F1] flex justify-center lg:text-xl text-[18px] font-semibold rounded">
              Meeting Votar
            </div>
          </div>
          <div className="mt-4 lg:text-xl text-base text-[#015CE9] underline">
            <Link href="/signin">Contact Sales</Link>
          </div>
          <div className="lg:text-5xl text-3xl font-bold text-[#00122F] mt-[50px]">
            NGN 0
          </div>
          <div className="lg:text-2xl text-[18px] text-[#060606] mt-3 font-semibold">
            Per member, per Month
          </div>

          <div className="mt-6 text-sm lg:text-base">
            <div className="flex flex-wrap items-center gap-1">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              All Votar Features
            </div>
            <div className="flex flex-wrap items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Board Member Voting
              <span className="bg-[#37B34A] text-[#F3F3F3] px-1 rounded text-xs">
                Learn More
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 mt-3 whitespace-nowrap">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Members Experience Survey
              <span className="bg-[#37B34A] text-[#F3F3F3] px-1 rounded text-xs">
                Learn More
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Yes or No Voting
              <span className="bg-[#37B34A] text-[#F3F3F3] px-1 rounded text-xs">
                Learn More
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Plurality Voting
              <span className="bg-[#37B34A] text-[#F3F3F3] px-1 rounded text-xs">
                Learn More
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Cummulative Voting
              <span className="bg-[#37B34A] text-[#F3F3F3] px-1 rounded text-xs">
                Learn More
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Prefencial Voting
              <span className="bg-[#37B34A] text-[#F3F3F3] px-1 rounded text-xs">
                Learn More
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Scored Voting
              <span className="bg-[#37B34A] text-[#F3F3F3] px-1 rounded text-xs">
                Learn More
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Approval Voting
              <span className="bg-[#37B34A] text-[#F3F3F3] px-1 rounded text-xs">
                Learn More
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 mt-3">
              <span>
                <Image
                  src={check.src}
                  alt="check icon"
                  height={0}
                  width={0}
                  style={{ width: "24px", height: "auto" }}
                />
              </span>
              Nomminations
              <span className="bg-[#37B34A] text-[#F3F3F3] px-1 rounded text-xs">
                Learn More
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPlan;

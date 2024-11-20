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
              <p>Free Votar</p>
            </div>
          </div>
          <div className="mt-4 lg:text-xl text-base underline text-[#015CE9]">
            <Link href="/signin">Create an election</Link>
          </div>
          <div className="lg:text-5xl text-3xl font-bold text-[#00122F] mt-[50px]">
            <h1>NGN 0</h1>
          </div>
          <div className="lg:text-2xl text-[18px] text-[#060606] mt-3 font-semibold">
            <h2>Per member, per Month</h2>
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
              <p>Participate in Elections with Email</p>
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
              <p>Voting Encryption</p>
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
              <p>Election Link</p>
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
              <p>Single Votes per Position</p>
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
              <p>Mutiple Votes per Position</p>
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
              <p>Raise Funds for your events via Polls</p>
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
              <p>Live Updates/Transmission of Results</p>
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
              <p>Analytic Tools for Election</p>
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
              <p>Branded Ballots and Election Page</p>
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
              <p>Candidates Bio/Details on Ballot</p>
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
              <p>Full Customer Support</p>
            </div>
          </div>
        </div>

        <div className="md:max-w-[364px] w-full bg-[#015CE9] p-8 plan-bg relative  border border-black text-[#F7F7F7]">
          <div className="max-w-[110px]">
            <div className="bg-[#F7F7F7] text-[#015CE9] flex justify-center lg:text-xl text-[18px] font-semibold rounded">
              <p>Votar Pro</p>
            </div>
          </div>
          <div className="mt-4 lg:text-xl text-base underline text-[#F7F7F7]">
            <Link href="/signin">Create an election</Link>
          </div>
          <div className="lg:text-5xl text-3xl font-bold mt-[50px]">
            <h1>NGN 30</h1>
          </div>
          <div className="lg:text-2xl text-[18px] mt-3 font-semibold">
            <h2>Per member, per Month</h2>
          </div>

          <div className="mt-6 text-sm lg:text-base">
            <div className="flex items-center gap-1">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              <p>Participate in Elections with Email</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              <p>Voting Encryption</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              <p>Election Link</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              <p>Single Votes per Position</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              <p>Mutiple Votes per Position</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              <p>Raise Funds for your events via Polls</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              <p>Live Updates/Transmission of Results</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              <p>Analytic Tools for Election</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              <p>Branded Ballots and Election Page</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              <p>Candidates Bio/Details on Ballot</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              <p>Participate in an Election with your BVN</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              <p>Election notification via SMS and Emails</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              <p>Single vote per person</p>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span>
                <img src={check2.src} alt="check icon" />
              </span>
              <p>Two-factor Authentetication</p>
            </div>
          </div>
        </div>

        <div className="md:max-w-[364px] w-full  bg-white p-8 plan-bg relative  border border-black">
          <div className="max-w-[150px]">
            <div className="bg-[#F1F1F1] flex justify-center lg:text-xl text-[18px] font-semibold rounded">
              <p>Meeting Votar</p>
            </div>
          </div>
          <div className="mt-4 lg:text-xl text-base text-[#015CE9] underline">
            <Link href="/signin">Contact Sales</Link>
          </div>
          <div className="lg:text-5xl text-3xl font-bold text-[#00122F] mt-[50px]">
            <h1>NGN 0</h1>
          </div>
          <div className="lg:text-2xl text-[18px] text-[#060606] mt-3 font-semibold">
            <h2>Per member, per Month</h2>
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
              <p>All Votar Features</p>
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
              <p>Board Member Voting</p>
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
              <p>Members Experience Survey</p>
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
              <p>Yes or No Voting</p>
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
              <p>Plurality Voting</p>
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
              <p>Cummulative Voting</p>
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
              <p>Prefencial Voting</p>
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
              <p>Scored Voting</p>
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
              <p>Approval Voting</p>
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
              <p>Nominations</p>
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

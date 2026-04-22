import React from "react";
import Link from "next/link";
import check from "../../../public/assets/icons/Check_fill.svg";
import check2 from "../../../public/assets/icons/Check_fill-2.svg";
import Image from "next/image";

const iconStyle = (
  <Image
    src={check.src}
    alt="check icon"
    width={24}
    height={24}
    style={{ width: "24px", height: "24px" }}
  />
);

const iconStyle2 = (
  <img src={check2.src} alt="check icon" width={24} height={24} />
);

const PaymentPlan = () => {
  return (
    <div className="mt-[100px] mx-7">
      <div className="flex justify-center lg:max-w-[80rem] mx-auto items-stretch gap-[56px] flex-wrap w-full">
        {/* FREE VOTAR */}
        <div className="md:max-w-[364px] w-full bg-white p-8 plan-bg relative border border-black">
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

          <div className="mt-6 text-sm lg:text-base space-y-4">
            {[
              "Participate in Elections with Email",
              "Voting Encryption",
              "Election Link",
              "Single Votes per Position",
              "Mutiple Votes per Position",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="min-w-[24px] flex-shrink-0">{iconStyle}</span>
                <p>{text}</p>
              </div>
            ))}

            {/* Updated fundraising block */}
            <div className="flex items-start gap-2">
              <span className="min-w-[24px] flex-shrink-0">{iconStyle}</span>
              <p>
                Raise Funds for your events via Polls (We take 10% of the funds
                raised for a service charge)
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="min-w-[24px] flex-shrink-0">{iconStyle}</span>
              <p>
                Create Goal polls at your event to get insights, boost
                engagement & at your discretion, raise funds from people (We
                take 10% of the funds raised for a service charge)
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="min-w-[24px] flex-shrink-0">{iconStyle}</span>
              <p>
                Create Goal Polls in your organization to recognize and boost
                the productivity of staff in your organization. Recognizing them
                only is fantastic! But you can also raise funds for them for the
                recognition (We take 10% of the funds raised for a service
                charge)
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="min-w-[24px] flex-shrink-0">{iconStyle}</span>
              <p>
                Create a Goal Poll to raise funds and achieve your financial
                goals for charity, birthdays, weddings, etc.
              </p>
            </div>

            {[
              "Live Updates/Transmission of Results",
              "Analytic Tools for Election",
              "Branded Ballots and Election Page",
              "Candidates Bio/Details on Ballot",
              "Full Customer Support",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="min-w-[24px] flex-shrink-0">{iconStyle}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* VOTAR PRO */}
        <div className="md:max-w-[364px] w-full bg-[#015CE9] p-8 plan-bg relative border border-black text-[#F7F7F7]">
          <div className="inline-flex flex-col items-start">
            <div className="bg-[#F7F7F7] text-[#015CE9] text-[18px] font-semibold rounded px-3 py-1">
              <p>Votar Pro</p>
            </div>
            <p className="text-[#F7F7F7] text-sm font-medium mt-1">For Students &amp; Universities</p>
          </div>

          <div className="mt-4 lg:text-xl text-base underline text-[#F7F7F7]">
            <Link href="/signin">Create an election</Link>
          </div>

          <div className="lg:text-5xl text-3xl font-bold mt-[50px]">
            <h1>&#8358;50</h1>
          </div>

          <div className="lg:text-xl text-[16px] mt-3 font-semibold">
            <h2>Per registered voter for individual elections</h2>
          </div>

          <div className="mt-6 border-t border-[#F7F7F7]/40 pt-4">
            <h3 className="lg:text-xl text-[16px] font-bold underline mb-3">Yearly Subscription Package</h3>
            <div className="space-y-3">
              <div>
                <p className="lg:text-3xl text-2xl font-bold">&#8358;20,000</p>
                <p className="text-sm mt-1">Covers all elections in a department or smaller group for 1 year</p>
              </div>
              <div>
                <p className="lg:text-3xl text-2xl font-bold">&#8358;35,000</p>
                <p className="text-sm mt-1">Covers all elections in a faculty or larger group for 1 year</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm lg:text-base space-y-4">
            {[
              "Participate in Elections with Email",
              "Voting Encryption",
              "Election Link",
              "Single Votes per Position",
              "Mutiple Votes per Position",
              "Raise Funds for your events via Polls",
              "Live Updates/Transmission of Results",
              "Analytic Tools for Election",
              "Branded Ballots and Election Page",
              "Candidates Bio/Details on Ballot",
              "Participate in an Election with your BVN",
              "Election notification via SMS and Emails",
              "Single vote per person",
              "Two-factor Authentetication",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="min-w-[24px] flex-shrink-0">{iconStyle2}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MEETING VOTAR */}
        <div className="md:max-w-[364px] w-full bg-white p-8 plan-bg relative border border-black">
          <div className="inline-flex flex-col items-start">
            <div className="bg-[#F1F1F1] text-[#00122F] text-[18px] font-semibold rounded px-3 py-1">
              <p>Votar Pro</p>
            </div>
            <p className="text-[#060606] text-sm font-medium mt-1">For Professional Associations &amp; Organizations</p>
          </div>

          <div className="mt-4 lg:text-xl text-base text-[#015CE9] underline">
            <Link href="/signin">Contact Sales</Link>
          </div>

          <div className="lg:text-5xl text-3xl font-bold text-[#00122F] mt-[50px]">
            <h1>&#8358;1,000</h1>
          </div>

          <div className="lg:text-xl text-[16px] text-[#060606] mt-3 font-semibold">
            <h2>Per registered voter for individual elections</h2>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="lg:text-xl text-[16px] font-bold underline mb-3">Yearly Subscription Package</h3>
            <div>
              <p className="lg:text-3xl text-2xl font-bold text-[#00122F]">&#8358;200,000</p>
              <p className="text-sm mt-1 text-[#060606]">Covers all elections for affiliates or branches under the association or organization for 1 year</p>
            </div>
          </div>

          <div className="mt-6 text-sm lg:text-base space-y-4">
            {[
              "Participate in Elections with Email",
              "Voting Encryption",
              "Election Link",
              "Single Votes per Position",
              "Mutiple Votes per Position",
              "Raise Funds for your events via Polls",
              "Live Updates/Transmission of Results",
              "Analytic Tools for Election",
              "Branded Ballots and Election Page",
              "Candidates Bio/Details on Ballot",
              "Participate in an Election with your BVN",
              "Election notification via SMS and Emails",
              "Single vote per person",
              "Two-factor Authentetication",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="min-w-[24px] flex-shrink-0">{iconStyle}</span>
                <p>{text}</p>
              </div>
            ))}
            {[
              "All Votar Features",
              "Board Member Voting",
              "Members Experience Survey",
              "Yes or No Voting",
              "Plurality Voting",
              "Cummulative Voting",
              "Prefencial Voting",
              "Scored Voting",
              "Approval Voting",
              "Nominations",
            ].map((text, i) => (
              <div key={i} className="flex flex-wrap items-start gap-2">
                <span className="min-w-[24px] flex-shrink-0">{iconStyle}</span>
                <p>{text}</p>
                <span className="bg-[#37B34A] text-[#F3F3F3] px-1 rounded text-xs">
                  Learn More
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPlan;

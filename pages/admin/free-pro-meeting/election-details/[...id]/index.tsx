import AdminLayout from "@/src/components/Admin/AdminLayout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiSettings } from "react-icons/fi";
import { BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import Link from "next/link";
import cardBg from "../../../../../public/assets/images/card-bg.png";
import { getElectionById } from "@/utils/api";
import Cookies from "universal-cookie";
import setAuthToken from "@/utils/setAuthToken";
import { CircularProgress } from "@mui/material";

const ElectionDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [electionId, setElectionId] = useState<string | null>(null);
  const [electionName, setElectionName] = useState<string | null>(null);
  const [isFetchElectionDetails, setIsFetchElectionDetails] = useState(false);
  const [electionDetails, setElectionDetails] = useState<any>(null);

  useEffect(() => {
    if (id && Array.isArray(id)) {
      setElectionId(id[0]);
      setElectionName(decodeURIComponent(id[1]));
    }
  }, [id]);

  useEffect(() => {
    const fetchElectionDetails = async () => {
      setIsFetchElectionDetails(true);
      const cookies = new Cookies();
      const token = cookies.get("admin-token");
      if (token) setAuthToken(token);
      try {
        if (electionId) {
          const { data } = await getElectionById({ election_id: electionId });
          if (data) {
            console.log(data.data);
            setElectionDetails(data.data);
            setIsFetchElectionDetails(false);
          }
        }
      } catch (error) {
        console.error(error);
        setIsFetchElectionDetails(false);
      }
    };

    fetchElectionDetails();
  }, [electionId]);

  if (!electionId || !electionName || isFetchElectionDetails) {
    return (
      <div className="text-center mt-10">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );
  }

  return (
    <div>
      <AdminLayout>
        <div className="max-w-[1300px] mx-auto py-[81px]">
          <div className="flex justify-end items-center gap-8">
            <div className="text-xl">
              Election ID: <span>{electionId}</span>
            </div>
            <div>
              <button className="w-20 h-9 px-3.5 py-1.5 bg-blue-700 rounded-md justify-center items-center gap-2.5 flex text-center text-zinc-100 text-xl">
                Copy
              </button>
            </div>
          </div>
          <div className="text-center text-2xl font-bold pt-[55px]">
            {electionName}
          </div>
          <div className="text-center text-slate-900 text-2xl max-w-[50rem] mx-auto pt-4">
            {electionDetails?.description}
          </div>

          <div className="pt-[62px] flex justify-between items-center">
            <div>
              <div className="text-xl flex items-center gap-2 font-bold">
                Election Settings
                <span>
                  <FiSettings />
                </span>
              </div>
              <div className="flex items-center gap-5 py-5 mt-6">
                <div className="text-xl font-semibold">
                  Number Of Free Votes
                </div>
                <div className="text-neutral-400 text-xl font-semibold">
                  {electionDetails?.free_votes}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    <BiPlusCircle />
                  </span>
                  <span className="text-xl">
                    <BiMinusCircle />
                  </span>
                </div>
                <div>
                  <button className="w-10 h-6 flex items-center justify-center bg-blue-700 rounded-lg text-center text-zinc-100 text-sm font-semibold">
                    Add
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-5 py-5 mt-4">
                <div className="text-xl font-semibold">Price per Votes</div>
                <div className="text-neutral-400 text-xl font-semibold">
                  {electionDetails?.price_per_vote}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    <BiPlusCircle />
                  </span>
                  <span className="text-xl">
                    <BiMinusCircle />
                  </span>
                </div>
                <div>
                  <button className="w-10 h-6 flex items-center justify-center bg-blue-700 rounded-lg text-center text-zinc-100 text-sm font-semibold">
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-5 py-5 mt-4">
                <div className="text-xl font-semibold">
                  Max Number of Candidate to be Started Per Position
                </div>
                <div className="text-neutral-400 text-xl font-semibold">
                  {electionDetails?.max_number_candidate}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    <BiPlusCircle />
                  </span>
                  <span className="text-xl">
                    <BiMinusCircle />
                  </span>
                </div>
                <div>
                  <button className="w-10 h-6 flex items-center justify-center bg-blue-700 rounded-lg text-center text-zinc-100 text-sm font-semibold">
                    Add
                  </button>
                </div>
              </div>
              <div className="mt-9 w-[409px]">
                <div className="text-xl font-semibold pb-4 ">
                  Purchased Votes:
                </div>
                <div className="w-[409px] pl-4 pr-3 pt-7 pb-6 bg-blue-700 rounded-lg flex justify-center flex-col text-white gap-3 relative z-20">
                  <div className="absolute top-0 left-0 bottom-0 right-0 opacity-30 -z-10">
                    <img
                      src={cardBg.src}
                      alt="card-bg"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xl font-bold">
                    Total Number of Purchased votes for Election
                  </div>
                  <div className="text-4xl font-bold">100</div>
                  <div>
                    <button className="w-28 h-10 p-2 bg-zinc-100 rounded outline-none flex items-center justify-center text-blue-700 text-xl font-semibold">
                      Free Votar
                    </button>
                  </div>
                </div>
                <Link href="/admin/free-pro-meeting/election-details/purchasedVotes">
                  <div className="flex justify-end pt-7 text-[18px] text-slate-900">
                    View Purchase Details
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
};

export default ElectionDetails;

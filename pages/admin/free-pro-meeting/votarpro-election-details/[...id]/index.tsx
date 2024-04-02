import AdminLayout from "@/src/components/Admin/AdminLayout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiSettings } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import cardBg from "../../../../../public/assets/images/card-bg.png";
import SwitchButton from "@/src/components/Admin/AdminProfile/SwitchButton";

const VotarProElectionDetails = () => {
  const router = useRouter();
  const [electionName, setElectionName] = useState("");

  const { id } = router.query;
  useEffect(() => {
    if (id) {
      setElectionName(id[1]);
    }
  }, [id]);
  return (
    <div>
      <AdminLayout>
        <div className="max-w-[1300px] mx-auto py-[81px]">
          <div className="flex justify-between items-center gap-8">
            <div className="text-2xl font-bold">Votar Pro</div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-8">
                <div className="text-xl">
                  Election ID: <span>ELE20057</span>
                </div>
                <div>
                  <button className="w-20 h-9 px-3.5 py-1.5 bg-blue-700 rounded-md justify-center items-center gap-2.5 flex text-center text-zinc-100 text-xl">
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-xl">
                  Election Link: <span>**********</span>
                </div>
                <div>
                  <button className="w-20 h-9 px-3.5 py-1.5 bg-blue-700 rounded-md justify-center items-center gap-2.5 flex text-center text-zinc-100 text-xl">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-2xl font-bold pt-[55px]">
            {electionName}
          </div>
          <div className="text-center text-slate-900 text-2xl max-w-[50rem] mx-auto pt-4">
            This is an Election to select the crowned Princess of MBGA 2022. One
            Stage, One Voice.
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
                  Total Number of Registered Voters
                </div>
                <div className="bg-neutral-200 text-2xl font-semibold p-2 rounded text-neutral-600">
                  300
                </div>
              </div>

              <div className="flex items-center gap-5 py-5 mt-4">
                <div className="text-xl font-semibold">
                  Display Individual Number of Voters to the Public
                </div>
                <div>
                  <SwitchButton />
                </div>
              </div>
            </div>

            <div>
              <div className="mt-9 w-[409px]">
                <div className="w-[409px] pl-4 pr-3 pt-7 pb-6 bg-blue-700 rounded-lg flex justify-center flex-col text-white gap-3 relative z-20">
                  <div className="absolute top-0 left-0 bottom-0 right-0 opacity-30 -z-10">
                    <img
                      src={cardBg.src}
                      alt="card-bg"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xl font-bold">
                    Total Number of Voters in Election
                  </div>
                  <div className="text-4xl font-bold">250</div>
                  <div>
                    <button className=" h-10 p-2 bg-zinc-100 rounded outline-none flex items-center justify-center text-blue-700 text-xl font-semibold">
                      View Election Results
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 justify-end pt-20">
            <div>
              <button className="h-11 flex items-center justify-center p-3 bg-blue-700 rounded-lg text-sm text-white gap-3.5">
                <span>
                  <MdOutlineSubdirectoryArrowRight />
                </span>
                Go to Voters Page
              </button>
            </div>
            <div>
              <button className="h-11 flex items-center justify-center p-3 bg-blue-700 rounded-lg text-sm text-white gap-3.5">
                <span>
                  <AiOutlineEye />
                </span>
                View & Edit Elections
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
};

export default VotarProElectionDetails;

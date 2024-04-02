import AdminLayout from "@/src/components/Admin/AdminLayout";
import React from "react";

const PurchasedVotes = () => {
  const users = [
    "Adamazy@gmail.com",
    "Bukola001@gmail.com",
    "Zaphanayajacobs@gmail.com",
    "Jagajeez@gmail.com",
    "Abisolamarvelous@gmail.com",
  ];
  const numbers = [20, 5, 3, 12, 10];
  return (
    <AdminLayout>
      <div className="bg-neutral-100 h-screen pt-[60px]">
        <div className="max-w-[1300px] mx-auto flex justify-center gap-40 ">
          <div>
            <div className="max-w-[319px] border-b border-slate-900 p-2 text-2xl font-bold">
              Total Number Of Purchased Votes for Election
            </div>
            <div className="w-16 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-zinc-100 font-semibold mt-10">
              100
            </div>
            <div>
              <div className="pb-5 pt-[60px] text-xl font-semibold">User</div>
              <div className="flex flex-col gap-6">
                {users.map((user, index) => (
                  <div key={index}>
                    <div className="text-normal ">
                      {index <= 9 ? `0${index + 1}` : index + 1} {user}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="max-w-[319px] border-b border-slate-900 p-2 text-2xl font-bold">
              <div>Total Number Of Purchased Votes for Election</div>
            </div>
            <div className="w-32 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-zinc-100 font-semibold mt-10">
              NGN 500
            </div>
            <div className="text-center">
              <div className="pb-5 pt-[60px] text-xl font-semibold">
                Numbers Purchased
              </div>
              <div className="flex flex-col gap-6">
                {numbers.map((number, index) => (
                  <div key={index}>
                    <div className="text-normal ">
                      {number <= 9 ? `0${number}` : number}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PurchasedVotes;

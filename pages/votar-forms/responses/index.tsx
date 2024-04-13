import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/src/components/DashboardLayout";
import withAuth from "@/hoc/withAuth";
import ElectionHeader from "@/src/components/VotarFormsComponent/ElectionHeader";
import ResponseTable from "@/src/components/VotarFormsComponent/Response";

const Responses = () => {
  const router = useRouter();
  const [electionName, setElectionName] = useState("");
  const { id } = router.query;
  useEffect(() => {
    if (id) {
      setElectionName(id[0]);
    }
  }, [id]);
  return (
    <DashboardLayout>
      <div>
        <ElectionHeader
          electionTitle={"NATIONAL ASSOCIATION OF POLITICAL SCIENCE STUDENTS"}
          textContent="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum nostrum, alias ab excepturi nobis dolorem."
        />
      </div>
      <ResponseTable />
    </DashboardLayout>
  );
};

export default Responses;

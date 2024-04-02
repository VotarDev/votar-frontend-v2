import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/src/components/DashboardLayout";
import withAuth from "@/hoc/withAuth";
import ElectionHeader from "@/src/components/VotarFormsComponent/ElectionHeader";
import CreatorForm from "@/src/components/VotarFormsComponent/CreatorForm";

const CreateForm = () => {
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
          electionTitle={electionName}
          textContent=" Election Details Form"
        />
      </div>
      <CreatorForm />
    </DashboardLayout>
  );
};

export default withAuth(CreateForm);

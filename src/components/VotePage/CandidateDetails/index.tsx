import React from "react";
import { getMimeTypeFromBase64 } from "@/utils/util";

const CandidateDetails = ({ details }: any) => {
  console.log(details[0]);

  return (
    <div className="bg-white rounded-lg min-h-[20rem] w-full m-auto flex items-center justify-center flex-col gap-5 p-4">
      <div>
        {details.media.type === "video" && (
          <video controls>
            <source src={`${URL.createObjectURL(details.media.docs)}`} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div>
        {details.media.type === "image" && (
          <img
            src={`${URL.createObjectURL(details.media.docs)}`}
            alt=""
            className="w-40 h-40 object-cover"
          />
        )}
      </div>
      <div>{details.more_details}</div>
    </div>
  );
};

export default CandidateDetails;

import React from "react";
import { getMimeTypeFromBase64 } from "@/utils/util";

const CandidateDetails = ({ details }: any) => {
  console.log(details[0]);

  return (
    <div className="bg-white rounded-lg min-h-[20rem] w-full m-auto flex items-center justify-center flex-col gap-5 p-4">
      <div>
        {details[0].media.type === "video" && (
          <video controls>
            <source
              src={details[0].media.data[0]}
              type={getMimeTypeFromBase64(details[0].media.data[0])}
            />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div>
        {details[0].media.type === "image" && (
          <img
            src={details[0].media.data[0]}
            alt=""
            className="w-40 h-40 object-cover"
          />
        )}
      </div>
      <div>{details[0].dets}</div>
    </div>
  );
};

export default CandidateDetails;

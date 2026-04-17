import React from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "@/src/components/Modal";

interface CandidateDetailsModalProps {
  showDetails: boolean;
  selectedDetails: string | null;
  onClose: () => void;
}

const CandidateDetailsModal: React.FC<CandidateDetailsModalProps> = ({
  showDetails,
  selectedDetails,
  onClose,
}) => {
  return (
    <AnimatePresence mode="wait">
      {showDetails && (
        <Modal
          key="modal"
          handleClose={onClose}
          classname="overflow-y-scroll h-[20vh] max-w-[400px] ballot-modal  rounded bg-white"
        >
          <div className="rounded h-full p-6">
            <h1 className="text-lg font-medium">Candidate More Details</h1>
            <div className="whitespace-pre-wrap mt-4">
              {!selectedDetails && (
                <p>No details available for this candidate.</p>
              )}
              {selectedDetails}
            </div>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default CandidateDetailsModal;

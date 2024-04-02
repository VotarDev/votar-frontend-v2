import React, { useState } from "react";
import CardTable from "./CardTable";
import { CardRowTypess } from "@/utils/types";
import Modal from "../../Modal";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { add } from "lodash";

const CardsList = ({
  cards,
  setNewCard,
}: {
  cards: CardRowTypess[];
  setNewCard: any;
}) => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);
  const router = useRouter();

  const [value, setValues] = useState({
    name: "",
    cardHolder: "",
    cardNumber: "",
    expires: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prevInput) => ({
      ...prevInput,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const cardData = { ...value, status: "Inactive" };
    setNewCard([...cards, cardData]);
    closeModal();
  };

  const addCardHandler = () => {
    router.push(`/profile/billing/add`);
  };
  return (
    <div>
      <div className="flex justify-between pb-3 items-center">
        <div className="text-xl">
          You have {cards.length} cards in your account.
        </div>
        <div>
          <button
            onClick={() => {
              addCardHandler();
            }}
            className="border-none outline-none bg-blue-700 uppercase font-semibold p-2 w-40 h-12 flex justify-center items-center text-zinc-100 rounded-lg"
          >
            Add new card
          </button>
        </div>
      </div>
      <hr></hr>
      <div>
        <CardTable cards={cards} />
      </div>

      <AnimatePresence mode="wait">
        {showModal && (
          <Modal key="modal" handleClose={closeModal}>
            <div className="bg-white rounded-lg pt-[24px] pb-[83px] px-10 text-left">
              <div className="w-full mx-auto overflow-y-scroll min-h-[80vh]">
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name">Card Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="border border-zinc-600 w-full rounded h-12 outline-none p-4"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="username">Card Holder</label>
                    <input
                      type="text"
                      id="cardHolder"
                      name="cardHolder"
                      className="border border-zinc-600 w-full rounded h-12 outline-none p-4"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="password">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      className="border border-zinc-600 w-full rounded h-12 outline-none p-4"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="password">Expires on</label>
                    <input
                      type="text"
                      id="expires"
                      name="expires"
                      className="border border-zinc-600 w-full rounded h-12 outline-none p-4"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mt-5">
                    <button className="w-full h-12 outline-none flex items-center justify-center bg-blue-700 text-white rounded">
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardsList;

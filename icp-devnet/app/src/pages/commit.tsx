import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { Select, SelectItem } from "@/components/ui";
import DefaultLayout from "@/layouts/default";
import fetchLotteryData from "@/utils/fetchLotteryData";
import fetchJoinedLotteriesData from "@/utils/fetchJoinedLotteriesData";
import { dapp3_backend } from 'declarations/dapp3_backend';  

export default function DocsPage() {
  const [purpose, setPurpose] = useState("");
  const [lotteryId, setLotteryId] = useState("");
  const [commitValue, setCommitValue] = useState(""); 
  const [joinedLotteries, setJoinedLotteries] = useState<
    { purpose: string; lotteryId: string; tickets: number; price: number; commitPhase: boolean }[]
  >([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lotteryData, setLotteryData] = useState<any>({});  

  const purposes = [
    { key: "Entertainment", label: "Entertainment" },
    { key: "Fundraiser", label: "Fundraiser" },
    { key: "DAOTreasury", label: "DAO Treasury" },
    { key: "Custom", label: "Custom" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lotteryData = await fetchLotteryData();
        setLotteryData(lotteryData);  

        const joinedLotteriesData = await fetchJoinedLotteriesData();
        setJoinedLotteries(joinedLotteriesData); 
      } catch (error) {
        alert("Failed to load lottery data or joined lotteries.");
      }
    };

    fetchData();
  }, []);

  const handleCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitValue.trim()) {
      alert("Please enter a commit value.");
      return;
    }

    setLoading(true);

    try {
      
      const response = await dapp3_backend.create_commitment({ lotteryId, commitValue });

      if (response.success) {
        alert(`You have successfully committed "${commitValue}" for Lottery ID: ${lotteryId} under Purpose: ${purpose}.`);

        setJoinedLotteries((prev) =>
          prev.map((lottery) =>
            lottery.lotteryId === lotteryId ? { ...lottery, commitPhase: true } : lottery
          )
        );
      } else {
        throw new Error('Commit failed');
      }
    } catch (error) {
      console.error("Error committing to lottery:", error);
      alert("Failed to commit.");
    }

    setLoading(false);
    setIsModalOpen(false);
    setCommitValue(""); 
  };

  const handleOpenModal = (lottery: { purpose: string; lotteryId: string; commitPhase: boolean }) => {
    setPurpose(lottery.purpose);
    setLotteryId(lottery.lotteryId); 
    setIsModalOpen(true);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full max-w-md mt-6">
          <h4 className="text-xl font-semibold">Your Bought Tickets</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {joinedLotteries.length > 0 ? (
              joinedLotteries.map((lottery, index) => (
                <div
                  key={index}
                  className="w-full p-4 rounded-lg border bg-card text-card-foreground shadow-lg animate-move-up transition-all duration-200 hover:shadow-xl cursor-pointer"
                  onClick={() => handleOpenModal(lottery)}
                >
                 <h5 className="text-sm font-semibold break-words flex-wrap">{lottery.lotteryId}</h5>
                  <p className="text-sm">Purpose: {lottery.purpose}</p>
                  <p className="text-sm">Total Price: ${lottery.price}</p>
                  <p className={`text-sm font-semibold ${lottery.commitPhase ? "text-green-500" : "text-red-500"}`}>
                    Commit Phase: {lottery.commitPhase ? "Active" : "Inactive"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">You haven't bought any tickets yet.</p>
            )}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full max-w-md rounded-lg border bg-white text-gray-900 shadow-lg p-6 relative">
            <h3 className="text-2xl font-semibold leading-none tracking-tight text-center">
              {joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.commitPhase
                ? "Commit Phase Already Started"
                : "Start Commit Phase"}
            </h3>

            <p className="text-sm text-gray-600 text-center mt-2">
              {joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.commitPhase
                ? `The commit phase has already started for Lottery ID: ${lotteryId} under Purpose: ${purpose}.`
                : "Click the button below to start the commit phase for this lottery."}
            </p>

            {!joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.commitPhase && (
              <div className="flex items-center justify-center mt-6">
                <button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      
                      const response = await dapp3_backend.start_commitment_phase({ lotteryId });
                      
                      if (response.success) {
                        alert(`Commit phase has started for Lottery ID: ${lotteryId} under Purpose: ${purpose}.`);
                        setJoinedLotteries((prev) =>
                          prev.map((lottery) =>
                            lottery.lotteryId === lotteryId ? { ...lottery, commitPhase: true } : lottery
                          )
                        );
                      } else {
                        alert("Failed to start commit phase.");
                      }
                    } catch (error) {
                      console.error("Error starting commit phase:", error);
                      alert("Failed to start commit phase.");
                    }
                    setLoading(false);
                    setIsModalOpen(false);
                  }}
                  className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Start Commit Phase"
                  )}
                </button>
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}

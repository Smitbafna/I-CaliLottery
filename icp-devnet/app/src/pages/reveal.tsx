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
  const [joinedLotteries, setJoinedLotteries] = useState<
    { purpose: string; lotteryId: string; tickets: number; price: number; commitPhase: boolean }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lotteryData, setLotteryData] = useState<any>({}); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedLotteryData = await fetchLotteryData();
        const joinedLotteriesData = await fetchJoinedLotteriesData();
        setLotteryData(fetchedLotteryData); 
        setJoinedLotteries(joinedLotteriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (lottery: { purpose: string; lotteryId: string; tickets: number; price: number; commitPhase: boolean }) => {
    setPurpose(lottery.purpose);
    setLotteryId(lottery.lotteryId);
    setIsModalOpen(true);
  };

  const handleDeclareWinners = async (id: string) => {
    setLoading(true);
  
    try {
      const winner = await dapp3_backend.generate_and_set_winner(id);
      console.log(`Winner declared: ${winner}`);
  
      alert(`Winners declared for Lottery ID: ${id}`);
    } catch (error) {
      console.error("Error declaring winners:", error);
      alert("Failed to declare winners.");
    }
  
    setLoading(false);
    setIsModalOpen(false);
  };

  const handleEndCommitPhase = async (id: string) => {
    setCommitLoading(true);

    try {
      await dapp3_backend.end_commitment_phase(id);
      console.log(`Commit phase ended for Lottery ID: ${id}`);
      alert(`Commit phase ended for Lottery ID: ${id}`);
    } catch (error) {
      console.error("Error ending commit phase:", error);
      alert("Failed to end commit phase.");
    }

    setCommitLoading(false);
    setIsModalOpen(false);
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
                  className="w-full p-4 rounded-lg border bg-card text-card-foreground shadow-lg cursor-pointer"
                  onClick={() => handleOpenModal(lottery)}
                >
                  <h5 className="text-sm font-semibold break-words flex-wrap">{lottery.lotteryId}</h5>
                  <p className="text-sm">Purpose: {lottery.purpose}</p>
                  <p className="text-sm">Total Price: ${lottery.price}</p>
                  <p className={`text-sm font-semibold ${lottery.commitPhase ? "text-green-500" : "text-blue-500"}`}>
                    Commit Phase: {lottery.commitPhase ? "Active" : "End"}
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
            <h3 className="text-2xl font-semibold text-center">
              {joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.commitPhase
                ? "End Commit Phase"
                : "Declare Winners"} for Lottery ID: {lotteryId}
            </h3>

            <p className="text-sm text-gray-600 text-center mt-2">
              You are about to {joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.commitPhase
                ? "end the commit phase"
                : "declare winners"} for Lottery ID: {lotteryId} under Purpose: {purpose}.
            </p>

            <div className="flex items-center justify-center mt-6">
              {joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.commitPhase ? (
                <button
                  onClick={() => handleEndCommitPhase(lotteryId)}
                  className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition flex items-center justify-center"
                  disabled={commitLoading} 
                >
                  {commitLoading ? (
                    <div className="w-5 h-5 border-4 border-t-transparent border-white border-solid rounded-full animate-spin"></div>
                  ) : (
                    "End Commit Phase"
                  )}
                </button>
              ) : (
                <>
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
                  ) : (
                    <button
                      onClick={() => handleDeclareWinners(lotteryId)}
                      className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                    >
                      Declare Winners
                    </button>
                  )}
                </>
              )}
            </div>

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

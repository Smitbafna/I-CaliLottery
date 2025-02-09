import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { Select, SelectItem } from "@/components/ui";
import DefaultLayout from "@/layouts/default";
import fetchLotteryData from "@/utils/fetchLotteryData"; 
import { fetchModeratorId } from '@/utils/moderatorService';
import { getStorageAppEndpointKey } from '../utils/storage';
import {
  clearApplicationId,
  getJWTObject,
  getStorageExecutorPublicKey,
} from '../utils/storage';
import {
  TransferPrizeRequest
} from '../api/contractApi';

import axios from 'axios';

const handleTransferPrize = async (request: TransferPrizeRequest) => {
  try {
  
    const apiEndpoint = `${getStorageAppEndpointKey()}/admin-api/contexts/${getJWTObject()?.context_id}/lottery/transfer-prize`;
    const body = request;

    const response = await axios.post(apiEndpoint, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

 
    console.log('Transfer successful', response.data);
    return response.data; 

  } catch (error) {
    console.error('Error in transferring prize:', error);
    throw new Error('Transfer failed');
  }
};



export default function DocsPage() {
  const [purpose, setPurpose] = useState("");
  const [lotteryId, setLotteryId] = useState("");
  const [commitValue, setCommitValue] = useState("");
  const [joinedLotteries, setJoinedLotteries] = useState<
    { purpose: string; lotteryId: string; tickets: number; price: number; commitPhase: boolean; winnerId?: string; winnerIndex?: number; verificationString?: string; verificationHash?: string }[]
  >([]);
  const [isTransferring, setIsTransferring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const purposes = [
    { key: "Entertainment", label: "Entertainment" },
    { key: "Fundraiser", label: "Fundraiser" },
    { key: "DAOTreasury", label: "DAO Treasury" },
    { key: "Custom", label: "Custom" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLotteryData();
        setJoinedLotteries(data);
      } catch (error) {
        console.error("Error fetching lottery data:", error);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (lottery: { purpose: string; lotteryId: string; commitPhase: boolean }) => {
    setPurpose(lottery.purpose);
    setLotteryId(lottery.lotteryId);
    setIsModalOpen(true);
  };

  const handleInitiateTransfer = async () => {
    setIsTransferring(true);
  
    try {
      const lottery = joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId);
      if (!lottery) {
        alert("Lottery not found.");
        return;
      }
  
      const winnerId = lottery.winnerId || "Unknown";
      const prizePool = lottery.price;
  
      // 60% to the winner and 30% to the moderator
      const winnerShare = (prizePool * 0.60).toFixed(2);
  
      const moderatorId = await fetchModeratorId(lotteryId);
      if (!moderatorId) {
        alert("Failed to fetch moderator ID.");
        return;
      }
  
      const moderatorShare = (prizePool * 0.30).toFixed(2);
  
      
      const transferRequest: TransferPrizeRequest = {
        lotteryId: lotteryId,
        winnerId: winnerId,
        prizePool: prizePool, 
      };
  
      
      await handleTransferPrize(transferRequest);
  
      alert(`
        Prize successfully transferred:
        - Winner (ID: ${winnerId}) gets ${winnerShare} USD
        - Moderator (ID: ${moderatorId}) gets ${moderatorShare} USD
      `);
  
      setJoinedLotteries((prev) =>
        prev.map((lottery) =>
          lottery.lotteryId === lotteryId ? { ...lottery, commitPhase: false } : lottery
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error during transfer:", error);
      alert("Failed to initiate transfer.");
    } finally {
      setIsTransferring(false);
    }
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
                  <p className={`text-sm font-semibold ${lottery.commitPhase ? "text-blue-500" : "text-purple-500"}`}>
                    Lottery Status: {lottery.commitPhase ? "Ended" : "Transferred"}
                  </p>
                  {lottery.commitPhase && lottery.winnerId && (
                    <div className="mt-2 text-sm">
                      <p className="font-semibold">Winner ID: {lottery.winnerId}</p>
                      <p className="font-semibold">Winner Index: {lottery.winnerIndex}</p>
                    </div>
                  )}
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
                ? "Winners Declared"
                : "Lottery has been ended"}
            </h3>

            <p className="text-sm text-gray-600 text-center mt-2">
              {joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.commitPhase
                ? `The winners have been declared for Lottery ID: ${lotteryId} under Purpose: ${purpose}.`
                : "The funds have been transferred to the winner and moderator. For auditing purposes:"}
            </p>

            {joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.commitPhase && (
              <div className="mt-4 text-center">
                <p className="font-semibold">Winner ID: {joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.winnerId}</p>
                <p className="font-semibold">Winner Index: {joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.winnerIndex}</p>
                <h5 className="text-sm font-semibold break-words flex-wrap">Verification String: {joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.verificationString}</h5>
                <h5 className="text-sm font-semibold break-words flex-wrap">Verification Hash: {joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.verificationHash}</h5>
                <div className="flex justify-center">
                  <button
                    onClick={handleInitiateTransfer}
                    className={`mt-4 px-6 py-2 text-white rounded-md transition flex items-center justify-center ${
                      isTransferring ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    }`}
                    disabled={isTransferring}
                  >
                    {isTransferring ? (
                      <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Initiate Transfer"
                    )}
                  </button>
                </div>
              </div>
            )}

            {!joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.commitPhase && (
              <div className="mt-4 text-center">
                <p className="font-semibold">Winner ID: {joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.winnerId}</p>
                <p className="font-semibold">Winner Index: {joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.winnerIndex}</p>
                <h5 className="text-sm font-semibold break-words flex-wrap">Verification Hash: {joinedLotteries.find((lottery) => lottery.lotteryId === lotteryId)?.verificationHash}</h5>
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

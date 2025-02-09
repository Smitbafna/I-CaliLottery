import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { Select, SelectItem } from "@/components/ui";
import DefaultLayout from "@/layouts/default";
import fetchLotteryData from "@/utils/fetchLotteryData";  
import fetchJoinedLotteriesData from "@/utils/fetchJoinedLotteriesData"; 
import { getStorageAppEndpointKey } from '../utils/storage';
import {
  clearApplicationId,
  getJWTObject,
  getStorageExecutorPublicKey,
} from '../utils/storage';
import {
  PurchaseTicketRequest
} from '../api/contractApi';
import axios from 'axios';

export default function DocsPage() {
  const [purpose, setPurpose] = useState("");
  const [lotteryId, setLotteryId] = useState("");
  const [ticketCount, setTicketCount] = useState(1);  
  const [joinedLotteries, setJoinedLotteries] = useState<
     { purpose: string; lotteryId: string; tickets: number; price: number; commitPhase: boolean }[]
   >([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lotteryData, setLotteryData] = useState({});
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    if (!lotteryId) {
      alert("Please select a valid lottery ID.");
      setLoading(false);
      return;
    }
  
    try {
      console.log("Entering Lottery:", lotteryId);
      alert(`You have entered lottery ID: ${lotteryId} under purpose: ${purpose}`);
      setJoinedLotteries([
        ...joinedLotteries,
        { purpose, lotteryId: String(lotteryId), tickets: 0, price: lotteryData[lotteryId] }
      ]);
      
    } catch (error) {
      console.error("Error entering lottery:", error);
      alert("Failed to enter lottery.");
    }
  
    setLoading(false);
    setIsModalOpen(false);
  };

  const handlePurchaseTicket = async (request: PurchaseTicketRequest) => {
  
    const apiEndpoint = `${getStorageAppEndpointKey()}/admin-api/contexts/${getJWTObject()?.context_id}/lottery/purchase-ticket`;
  
    try {
      await axios.post(apiEndpoint, request, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Ticket purchased successfully');
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      // Handle error appropriately
    }
  };
  
  
  const handleOpenModal = (lottery: { purpose: string; lotteryId: string }) => {
    setPurpose(lottery.purpose);
    setLotteryId(String(lottery.lotteryId)); 
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
                 <h5 className="text-sm font-semibold">{lottery.lotteryId}</h5>
                  <p className="text-sm">Purpose: {lottery.purpose}</p>
                  <p className="text-sm">Price: ${lottery.price}</p>
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
            <h3 className="text-2xl font-semibold">Enter Lottery</h3>

            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-center mt-6">
                <button
                  className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Join Lottery"
                  )}
                </button>
              </div>
            </form>

            {/* Close Modal */}
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

import React, { useState } from "react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Select, SelectItem } from "@/components/ui";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { dapp3_backend } from 'declarations/dapp3_backend';

export default function DocsPage() {
  const [purpose, setPurpose] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const purposes = [
    { key: "Entertainment", label: "Entertainment" },
    { key: "Fundraiser", label: "Fundraiser" },
    { key: "DAOTreasury", label: "DAO Treasury" },
    { key: "Custom", label: "Custom" }
  ];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const price = Number(ticketPrice);
    const id = lotteryId;

    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid ticket price.");
      setLoading(false);
      return;
    }

    if (!id || !purpose) {
      alert("Please enter a valid lottery ID and purpose.");
      setLoading(false);
      return;
    }

    try {
     
      const response = await dapp3_backend.create_new_lottery({ purpose, price });

      if (response.success) {
        setJoinedLotteries((prev) => [
          ...prev,
          { lotteryId: id, purpose, price },
        ]);

        alert(`Lottery Created with Purpose: ${purpose} with Lottery ID: ${id}`);
      } else {
        throw new Error('Lottery creation failed');
      }
    } catch (error) {
      console.error("Error creating lottery:", error);
      alert("Failed to create lottery.");
    }

    setLoading(false);
  };
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
       
        <div className="w-full max-w-md rounded-lg border bg-card text-card-foreground shadow-lg animate-move-up transition-all duration-200 hover:shadow-xl">
          <div className="flex flex-col space-y-1.5 p-6 border-b border-gray-200">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">New Lottery</h3>
            <p className="text-sm text-muted-foreground">Create a new lottery event with your details.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="custom-label">
                  Lottery Purpose
                </label>
                <Select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="custom-select mt-1.5"
                  required
                >
                  {purposes.map((purposeOption) => (
                    <SelectItem 
                      key={purposeOption.key} 
                      value={purposeOption.key}
                    >
                      {purposeOption.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div>
                <label className="custom-label">
                  Ticket Price
                </label>
                <Input
                  type="number"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                  placeholder="Enter ticket price"
                  min="1"
                  required
                  className="custom-input mt-1.5"
                />
              </div>
            </div>
            <div className="flex items-center justify-end pt-4 border-t border-gray-200">
              <Button 
                type="submit" 
                disabled={loading || !purpose}
                className="custom-button"
              >
                {loading ? "Creating..." : "Create Lottery"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </DefaultLayout>
  );
}  
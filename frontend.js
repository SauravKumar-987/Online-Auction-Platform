import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function AuctionPlatform() {
  const [items, setItems] = useState([]);
  const [bid, setBid] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data));

    socket.on("bidUpdate", (updatedItem) => {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    });
  }, []);

  const placeBid = () => {
    if (!selectedItem || !bid) return;
    socket.emit("placeBid", { itemId: selectedItem.id, bid: parseFloat(bid) });
    setBid("");
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="p-4">
          <CardContent>
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p className="text-gray-500">Current Bid: ${item.currentBid}</p>
            <Button onClick={() => setSelectedItem(item)}>Place Bid</Button>
          </CardContent>
        </Card>
      ))}
      {selectedItem && (
        <div className="fixed bottom-4 left-4 right-4 bg-white p-4 shadow-lg rounded-lg">
          <h3 className="text-lg font-bold">Bidding on: {selectedItem.name}</h3>
          <Input
            type="number"
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            placeholder="Enter bid amount"
          />
          <Button onClick={placeBid} className="mt-2">Submit Bid</Button>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardFooter } from "./ui/card";
import Image from "next/image";

interface ListingProps {
  listing: {
    _id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    category: string;
    attributes: {
      size?: string;
      colour?: string;
      brand?: string;
    };
  };
}

function Listing({ listing }: ListingProps) {
  return (
    <Card className="w-full gap-1 p-2 cursor-pointer">
      <CardContent className="w-full flex flex-row px-2 gap-2 ">
        <Image
          src="/images/listing.jpg"
          width={100}
          height={60}
          alt={listing.title}
          className="rounded-xl bg-gray-200"
        />
        <div className="flex flex-col justify-between">
          <h3 className="flex-grow text-sm font-semibold">{listing.title}</h3>
          <p className="text-xs text-gray-500 line-clamp-2">
            {listing.description}
          </p>
          <div className="text-sm font-semibold">${listing.price}</div>
          <div className="text-xs text-gray-400">{listing.location}</div>
        </div>
      </CardContent>
      {/* <CardFooter className="m-0 px-2">its the footer of the card</CardFooter> */}
    </Card>
  );
}

export default Listing;

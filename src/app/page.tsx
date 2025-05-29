"use client";
import Filter from "@/components/filter";
import Listing from "@/components/listing";
import Search from "@/components/search";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";

const facets = [
  {
    name: "Size",
    slug: "size",
    type: "dropdown",
    options: [
      { label: "6", value: "6" },
      { label: "7", value: "7" },
      { label: "8", value: "8" },
      { label: "9", value: "9" },
    ],
  },
  {
    name: "Colour",
    slug: "colour",
    type: "check",
    options: [
      { label: "Red", value: "red" },
      { label: "Black", value: "black" },
    ],
  },
  {
    name: "Price",
    slug: "price",
    type: "range",
    min: 500,
    max: 4999,
  },
  {
    name: "Brand",
    slug: "brand",
    type: "check",
    options: [
      { label: "Nike", value: "nike" },
      { label: "Puma", value: "puma" },
    ],
  },
];

const products = [
  {
    _id: "654a123df45b123abc789",

    title: "Nike Zoom Red Running Shoes Size 9",

    description:
      "High-performance running shoes for professionals. Lightweight, breathable and stylish.",

    price: 1999,

    location: "Mumbai",

    category: "running-shoes",

    attributes: {
      size: "9",

      colour: "red",

      brand: "nike",
    },
  },
];

const fetchProducts = async (
  search: string,
  categories: string,
  filters: any
) => {
  console.log("search", search, categories, filters);

  try {
    // For GET request with query params (recommended)
    const { data } = await axios.get("/api/search", {
      params: {
        search,
        categories,
        filters,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [categories, setCategories] = useState<string>("running-shoes");
  const [filters, setFilters] = useState<any>();

  const { data, isLoading } = useQuery({
    queryKey: ["search", search, categories, filters],
    queryFn: () => fetchProducts(search, categories, filters),
  });

  // if (isLoading) return <div>Loading...</div>;

  console.log(data);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-5/6 max-w-3xl">
        <h1 className="text-4xl font-semibold">B2BMarketplace</h1>
        <Search
          search={search}
          setSearch={setSearch}
          categories={categories}
          setCategories={setCategories}
        />
        <Card className="w-full min-h-60 max-h-8/12">
          <CardContent className=" flex flex-row gap-2">
            <div className="w-2/6">
              <Filter facets={facets} />
            </div>
            <div className="grow gap-2 flex flex-col scroll-auto max-h-8/12">
              {data?.results?.map((product: any) => (
                <Listing listing={product} />
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}

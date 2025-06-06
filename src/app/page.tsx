"use client";
import Filter from "@/components/filter";
import Listing from "@/components/listing";
import Search from "@/components/search";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"; // Import the Button component

const fetchProducts = async (
  search: string,
  categories: string,
  filters: any,
  page: number // Add page parameter
) => {
  console.log("search", search, categories, filters, page);

  try {
    const { data } = await axios.get("/api/search", {
      params: {
        search,
        category: `${categories}`,
        filters: `${JSON.stringify(filters)}`,
        page,
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

const productSkeleton = [1, 2, 3];

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [categories, setCategories] = useState<string>("running-shoes");
  const [filters, setFilters] = useState<any>();
  const [page, setPage] = useState<number>(1); // New state for current page

  const { data, isLoading } = useQuery({
    queryKey: ["search", search, categories, filters, page],
    queryFn: () => fetchProducts(search, categories, filters, page),
    placeholderData: keepPreviousData,
  });

  console.log(data);

  const handleNextPage = () => {
    if (data && page < data.totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

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
              <Filter
                category={categories}
                filters={filters}
                setFilters={setFilters}
              />
            </div>
            <div className="grow gap-2 flex flex-col scroll-auto max-h-8/12">
              {(isLoading ? productSkeleton : data?.results)?.map(
                (product: any, index: number) => (
                  <Listing key={product._id ?? index} listing={product} />
                )
              )}
              {!isLoading && data?.results?.length === 0 && (
                <div className="w-full p-3 text-center">No Results Found</div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {/* Pagination Controls */}
            <div className="flex justify-between w-full mt-4">
              <Button
                onClick={handlePreviousPage}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <span className="self-center">
                Page {page} of {data?.totalPages || 1}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={isLoading || (data && page >= data.totalPages)}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}

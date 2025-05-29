import { Label } from "@radix-ui/react-label";
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const Search = ({
  search,
  setSearch,
  categories,
  setCategories,
}: {
  search: string;
  setSearch: (value: string) => void;
  categories: string;
  setCategories: (value: string) => void;
}) => {
  return (
    <div className="flex gap-2 items-end w-full">
      <div className="grow">
        <Label htmlFor="search">Search</Label>

        <Input
          type="text"
          id="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            console.log(e.target.value);

            setSearch(e.target.value);
          }}
        />
      </div>
      <Select
        value={categories}
        onValueChange={(val) => {
          setCategories(val);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="running-shoes">Running Shoes</SelectItem>
          <SelectItem value="clothing">Clothing</SelectItem>
          <SelectItem value="books">Books</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Search;

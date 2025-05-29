import { Label } from "@radix-ui/react-label";
import React from "react";
import { Input } from "./ui/input";

function Search() {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="search">Search</Label>
      <Input type="text" id="search" placeholder="Search..." />
    </div>
  );
}

export default Search;

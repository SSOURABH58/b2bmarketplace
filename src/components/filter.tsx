import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

interface Option {
  label: string;
  value: string;
}

interface Facet {
  name: string;
  slug: string;
  type: "dropdown" | "check" | "range";
  options?: Option[];
  min?: number;
  max?: number;
}

interface FilterProps {
  facets: Facet[];
}

function Filter({ facets }: FilterProps) {
  return (
    <div className="space-y-4">
      {facets.map((facet) => (
        <div key={facet.slug} className="border p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">{facet.name}</h3>
          {
            facet.type === "dropdown" && facet.options && (
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={`Select a ${facet.name}`} />
                </SelectTrigger>
                <SelectContent>
                  {facet.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }
          {
            facet.type === "check" && facet.options && (
              <div className="flex flex-col space-y-2">
                {facet.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox id={`${facet.slug}-${option.value}`} />
                    <Label htmlFor={`${facet.slug}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </div>
            )
          }
          {
            facet.type === "range" && facet.min !== undefined && facet.max !== undefined && (
              <div className="space-y-2">
                <Slider
                  defaultValue={[facet.min, facet.max]}
                  max={facet.max}
                  min={facet.min}
                  step={1}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{facet.min}</span>
                  <span>{facet.max}</span>
                </div>
              </div>
            )
          }
        </div>
      ))}
    </div>
  );
}

export default Filter;

import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";

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

interface AttributeSchema {
  name: string;
  slug: string;
  type: "dropdown" | "check" | "range";
  options?: Option[];
  min?: number;
  max?: number;
}

interface CategoryFilter {
  name: string;
  slug: string;
  attributeSchema: AttributeSchema[];
}

interface FilterProps {
  category: string;
  filters: Record<string, any>; // Receive current filters from parent
  setFilters: (filters: Record<string, any>) => void;
}

const fetchCategoryFilters = async (category: string = "running-shoes") => {
  const { data } = await axios.get(`/api/filters`, {
    params: { category },
  });
  return data || [];
};

function Filter({ category, filters, setFilters }: FilterProps) {
  const { data, isLoading } = useQuery<{ filters: CategoryFilter }>({
    queryKey: ["categoryFilters", category],
    queryFn: () => fetchCategoryFilters(category),
    staleTime: 10 * 60 * 1000, // 5 minutes
  });

  const facets = data?.filters?.attributeSchema || [];

  // Initialize filters in the parent component when facets data loads
  useEffect(() => {
    console.log("facets", facets);

    if (facets.length > 0) {
      const initialFilters: Record<
        string,
        { type: "dropdown" | "check" | "range"; value: any }
      > = {};
      facets.forEach((facet) => {
        if (facet.type === "dropdown") {
          initialFilters[facet.slug] = { type: "dropdown", value: null }; // Initial value for dropdown is null
        } else if (facet.type === "check") {
          initialFilters[facet.slug] = { type: "check", value: [] }; // Initial value for checkboxes is empty array
        } else if (
          facet.type === "range" &&
          facet.min !== undefined &&
          facet.max !== undefined
        ) {
          initialFilters[facet.slug] = {
            type: "range",
            value: [facet.min, facet.max],
          }; // Initial value for range is [min, max]
        }
      });
      console.log("initialFilters", initialFilters);

      setFilters(initialFilters);
    }
  }, [facets, setFilters]);

  const handleFilterChange = (
    slug: string,
    type: "dropdown" | "check" | "range",
    value: any
  ) => {
    setFilters({
      ...filters,
      [slug]: { type, value },
    });
  };

  console.log("filters", filters);

  if (isLoading || (facets && filters === undefined)) {
    return <Skeleton className="w-[180px] h-24" />;
  }

  if (!facets || facets.length === 0) {
    return <div>No filters available for this category.</div>;
  }

  return (
    <div className="space-y-4">
      {facets?.map((facet) => (
        <div key={facet.slug} className="border p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">{facet.name}</h3>
          {facet.type === "dropdown" && facet.options && (
            <Select
              value={filters[facet.slug]?.value || ""} // Use filters from props
              onValueChange={(value) =>
                handleFilterChange(facet.slug, facet.type, value)
              }
            >
              <SelectTrigger className="w-[180px] cursor-pointer">
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
          )}
          {facet.type === "check" && facet.options && (
            <div className="flex flex-col space-y-2">
              {facet.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Checkbox
                    className="cursor-pointer"
                    id={`${facet.slug}-${option.value}`}
                    checked={
                      filters[facet.slug]?.value?.includes(option.value) ||
                      false
                    } // Use filters from props
                    onCheckedChange={(checked) => {
                      const currentValues = filters[facet.slug]?.value || [];
                      if (checked) {
                        handleFilterChange(facet.slug, facet.type, [
                          ...currentValues,
                          option.value,
                        ]);
                      } else {
                        handleFilterChange(
                          facet.slug,
                          facet.type,
                          currentValues.filter(
                            (val: string) => val !== option.value
                          )
                        );
                      }
                    }}
                  />
                  <Label
                    htmlFor={`${facet.slug}-${option.value}`}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          )}
          {facet.type === "range" &&
            facet.min !== undefined &&
            facet.max !== undefined && (
              <div className="space-y-2">
                <Slider
                  defaultValue={[facet.min, facet.max]}
                  max={facet.max}
                  min={facet.min}
                  step={1}
                  value={filters[facet.slug]?.value || [facet.min, facet.max]} // Use filters from props
                  onValueChange={(value) =>
                    handleFilterChange(facet.slug, facet.type, value)
                  }
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{filters[facet.slug]?.value?.[0] || facet.min}</span>
                  <span>{filters[facet.slug]?.value?.[1] || facet.max}</span>
                </div>
              </div>
            )}
        </div>
      ))}
    </div>
  );
}

export default Filter;

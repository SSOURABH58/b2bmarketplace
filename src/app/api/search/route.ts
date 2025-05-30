import { Listing } from "@/db/models/Listing";
import { connectToDB } from "@/db/mongo";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const SearchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  // filters: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  page: z.string().min(0).optional().transform(Number),
  limit: z.string().min(1).max(100).optional(),
  filters: z
    .record(
      z.string(),
      z
        .object({
          type: z.union([
            z.literal("dropdown"),
            z.literal("check"),
            z.literal("range"),
          ]), // e.g., 'string', 'number', 'boolean', 'array'
          value: z
            .union([
              z.string(),
              z.number(),
              z.boolean(),
              z.array(z.union([z.string(), z.number(), z.boolean()])),
              z.null(), // Allow null for initial or unset values
            ])
            .optional(), // Make value optional, as it might be null initially
        })
        .optional() // Make the filter object optional, as a filter might not be applied
    )
    .optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Convert URLSearchParams to a plain object for Zod validation
    const paramsObject = Object.fromEntries(searchParams.entries());
    console.log(paramsObject);

    const parsed = SearchSchema.safeParse({
      ...(paramsObject ?? {}),
      filters: JSON.parse(
        paramsObject.filters === "undefined" ? "{}" : paramsObject.filters
      ),
    });
    // console.log({
    //   ...paramsObject,
    //   filters: JSON.parse(paramsObject.filters ?? "{}"),
    // });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // # We connect to mongo db
    await connectToDB();

    const { search, category, filters, page = 1, limit = "4" } = parsed.data;

    console.log(paramsObject, parsed.data);

    let query: any = {
      title: { $regex: search ?? "", $options: "i" },
      ...(category && { category: category }),
    };

    if (filters) {
      for (const key in filters) {
        const filter = filters[key];
        if (filter && filter.value !== null && filter.value !== undefined) {
          switch (filter.type) {
            case "dropdown": // Handles single string or number values from dropdowns
              query[key] = filter.value;
              break;
            case "check": // Handles array of values from checkboxes
              if (Array.isArray(filter.value) && filter.value.length > 0) {
                query[key] = { $in: filter.value };
              }
              break;
            case "range": // Handles range values from sliders
              if (Array.isArray(filter.value) && filter.value.length === 2) {
                const [min, max] = filter.value;
                if (min !== null && max !== null) {
                  query[key] = { $gte: min, $lte: max };
                } else if (min !== null) {
                  query[key] = { $gte: min };
                } else if (max !== null) {
                  query[key] = { $lte: max };
                }
              }
              break;
            default:
              console.warn(`Unknown filter type for ${key}: ${filter.type}`);
              break;
          }
        }
      }
    }

    const totalListings = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    return NextResponse.json({
      results: listings,
      currentPage: page,
      totalPages: Math.ceil(totalListings / Number(limit)),
      totalResults: totalListings,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

import { Listing } from "@/db/models/Listing";
import { connectToDB } from "@/db/mongo";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const SearchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  filters: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  page: z
    .preprocess(
      (a) => parseInt(z.string().parse(a), 10),
      z.number().min(1).default(1)
    )
    .optional(),
  limit: z
    .preprocess(
      (a) => parseInt(z.string().parse(a), 10),
      z.number().min(1).max(100).default(10)
    )
    .optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    console.log(searchParams);

    // Convert URLSearchParams to a plain object for Zod validation
    const paramsObject = Object.fromEntries(searchParams.entries());
    const parsed = SearchSchema.safeParse(paramsObject);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // # We connect to mongo db
    await connectToDB();

    const { search, category, filters, page = 1, limit = 4 } = parsed.data;

    const query: any = {
      title: { $regex: search ?? "", $options: "i" },
      ...(category && { category: category }),
      ...Object.entries(filters || {}).reduce((acc, [key, val]) => {
        acc[`attributes.${key}`] = val; // add the filter to the query as an attribute
        return acc;
      }, {} as any),
    };

    const totalListings = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      results: listings,
      currentPage: page,
      totalPages: Math.ceil(totalListings / limit),
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

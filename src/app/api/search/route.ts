import { Listing } from "@/db/models/Listing";
import { connectToDB } from "@/db/mongo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // # We connect to mongo db
    await connectToDB();
    // # We get the search params from the request
    const { searchParams } = new URL(req.url);

    const query: any = {
      title: { $regex: searchParams.search, $options: "i" }, // regular expression search for the title
      ...(searchParams.category && { category: searchParams.category }), // if category is provided, add it to the query
      ...Object.entries(searchParams.filters || {}).reduce(
        (acc, [key, val]) => {
          acc[`attributes.${key}`] = val; // add the filter to the query
          return acc;
        },
        {} as any
      ),
    };
    console.log(query);

    const listings = await Listing.find(query).limit(10);

    return NextResponse.json({ results: listings });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

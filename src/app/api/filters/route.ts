import { Filters } from "@/db/models/filters";
import { connectToDB } from "@/db/mongo";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const SearchSchema = z.object({
  category: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    console.log("Filter: ", searchParams);

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

    const { category } = parsed.data;

    const query: any = {
      slug: category,
    };

    const filters = await Filters.findOne(query);
    console.log("filters", filters);

    return NextResponse.json({
      filters,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

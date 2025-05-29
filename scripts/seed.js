const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri = "mongodb://root:example@localhost:27017/";
const dbName = "b2b-marketplace";

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    const categoriesColl = db.collection("categories");
    const listingsColl = db.collection("listings");

    const categoryCount = await categoriesColl.countDocuments();
    const listingCount = await listingsColl.countDocuments();

    if (categoryCount > 0 || listingCount > 0) {
      console.log("✅ DB already seeded. Skipping.");
      return;
    }

    const seedPath = path.join(__dirname, "b2b-marketplace-seed.json");
    const data = JSON.parse(fs.readFileSync(seedPath, "utf-8"));

    await categoriesColl.insertMany(data.categories);
    await listingsColl.insertMany(data.listings);

    console.log("✅ Seeding complete.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await client.close();
  }
}

seed();

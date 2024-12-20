// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb";
import { PINECONE_INDEX } from "@/constants";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  let globalWithMongo = global; // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

if (clientPromise) {
  clientPromise.then((client) => {
    client
      .db(dbsForPineconeIndex[PINECONE_INDEX])
      .collection("videos")
      .createIndex(
        { ytVidId: 1 },
        {
          unique: true,
        },
      );
  });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
const dbsForPineconeIndex = {
  "100xdevs": "100xdevs_vizolv",
  "video-semantic-search": "videoai",
  "yt-vizolv": "yt_vizolv",
};
export async function getMongoClient(dbName, dbRequired = false) {
  if (dbRequired && !dbName) {
    throw new Error("Database name is required");
  }
  const client = await clientPromise;
  return client.db(dbName || dbsForPineconeIndex[PINECONE_INDEX]);
}
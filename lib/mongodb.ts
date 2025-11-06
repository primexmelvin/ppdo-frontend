import { MongoClient, MongoClientOptions, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

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

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

/**
 * Get database instance
 * @param dbName - Database name (defaults to MONGODB_DB or 'ppdo')
 */
export async function getDb(dbName?: string): Promise<Db> {
  const client = await clientPromise;
  const databaseName = dbName || process.env.MONGODB_DB || "ppdo";
  return client.db(databaseName);
}

/**
 * Helper to safely close connection (useful for scripts/tests)
 */
export async function closeConnection(): Promise<void> {
  const client = await clientPromise;
  await client.close();
}


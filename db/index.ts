import { config } from "dotenv"; // To load environment variables
import { drizzle } from "drizzle-orm/postgres-js"; // Drizzle ORM function
import postgres from "postgres"; // The underlying PostgreSQL driver

// Load environment variables from .env.local
config({ path: ".env.local" });

// Retrieve the database connection string
const connectionString = process.env.DATABASE_URL;

// Validate the connection string
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create the low-level PostgreSQL client connection
// The 'prepare: false' option is often recommended for compatibility with
// connection poolers like Supabase's PgBouncer or serverless environments.
const client = postgres(connectionString, { prepare: false });

// Create the Drizzle ORM instance, wrapping the low-level client
// This 'db' object is what your application code will use for queries.
export const db = drizzle(client);

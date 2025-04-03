import { config } from "dotenv"; // Import dotenv to load environment variables
import { defineConfig } from "drizzle-kit"; // Import defineConfig from drizzle-kit

// Load environment variables from the .env.local file
config({ path: ".env.local" });

// Retrieve the database connection string from process.env
const connectionString = process.env.DATABASE_URL;

// Validate that the DATABASE_URL is set
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set. Please check your .env.local file.");
}

// Export the configuration object for Drizzle Kit
export default defineConfig({
  /**
   * Specifies the directory containing your Drizzle schema files.
   * Drizzle Kit will watch this directory for changes.
   */
  schema: "./db/schema",

  /**
   * Specifies the directory where Drizzle Kit will output the
   * generated SQL migration files.
   */
  out: "./db/migrations",

  /**
   * Specifies the database dialect. For PostgreSQL (used by Supabase),
   * this should be "postgresql".
   */
  dialect: "postgresql",

  /**
   * Provides the database credentials needed for Drizzle Kit to connect
   * to the database, primarily for introspection during migration generation.
   */
  dbCredentials: {
    url: connectionString
  }
});

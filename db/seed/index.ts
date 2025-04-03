import { db } from "@/db"; // Adjust the import path if your db/index.ts is elsewhere
import { prompts } from "../schema/prompts-schema"; // Import the Drizzle schema definition

/**
 * An array of sample prompt objects to be inserted into the database.
 * Note: We don't specify 'id', 'created_at', or 'updated_at' as they
 * are handled automatically by the database/Drizzle schema defaults.
 */
const seedPrompts = [
  {
    name: "Code Explainer",
    description: "Explains code in simple terms",
    content: "Please explain this code in simple terms, as if you're teaching a beginner programmer:"
  },
  {
    name: "Bug Finder",
    description: "Helps identify bugs in code",
    content: "Review this code and identify potential bugs, performance issues, or security vulnerabilities:"
  },
  {
    name: "Feature Planner",
    description: "Helps plan new features",
    content: "Help me plan the implementation of this feature. Consider edge cases, potential challenges, and best practices:"
  },
  {
    name: "SQL Query Helper",
    description: "Assists with SQL queries",
    content: "Help me write an efficient SQL query to accomplish the following task:"
  },
  {
    name: "API Documentation",
    description: "Generates API documentation",
    content: "Generate clear and comprehensive documentation for this API endpoint, including parameters, responses, and examples:"
  },
  {
    name: "Code Refactorer",
    description: "Suggests code improvements",
    content: "Review this code and suggest improvements for better readability, maintainability, and performance:"
  },
  {
    name: "Test Case Generator",
    description: "Creates test cases",
    content: "Generate comprehensive test cases for this function, including edge cases and error scenarios:"
  },
  {
    name: "UI/UX Reviewer",
    description: "Reviews UI/UX design",
    content: "Review this UI design and provide feedback on usability, accessibility, and user experience:"
  },
  {
    name: "Git Command Helper",
    description: "Helps with Git commands",
    content: "What Git commands should I use to accomplish the following task:"
  }
];

/**
 * Asynchronous function to perform the database seeding operation.
 */
async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Optional: Delete all existing prompts before inserting new ones.
    // This makes the script idempotent (safe to run multiple times).
    // Use with caution, especially outside of development!
    console.log("🗑️ Clearing existing data from 'prompts' table...");
    await db.delete(prompts);

    // Insert the array of seed prompts into the 'prompts' table.
    console.log("📥 Inserting seed data into 'prompts' table...");
    await db.insert(prompts).values(seedPrompts);

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    // Catch and log any errors during the seeding process.
    console.error("❌ Error during database seeding:", error);
    // Optionally re-throw the error to indicate script failure
    throw error;
  } finally {
    // IMPORTANT: Close the database connection pool when the script is done.
    // Standalone scripts need to explicitly close connections.
    console.log("🚪 Closing database connection...");
    // Access the underlying client (syntax might depend on exact driver setup)
    // For the `postgres` library, it's typically .$client.end()
    await db.$client.end();
    console.log("🔌 Database connection closed.");
  }
}

// Immediately invoke the seed function when the script is run.
seed();

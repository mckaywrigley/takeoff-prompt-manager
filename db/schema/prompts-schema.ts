// Import necessary functions from Drizzle's PostgreSQL core library
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Schema definition for the "prompts" table using Drizzle ORM.
 * This object describes the structure and constraints of the 'prompts' table
 * that will be created in our PostgreSQL database.
 */
export const prompts = pgTable("prompts", {
  /**
   * 'id' column:
   * - Type: serial (PostgreSQL's auto-incrementing integer)
   * - Constraint: primaryKey() - Uniquely identifies each row in the table.
   * - Implicitly NOT NULL and UNIQUE.
   */
  id: serial("id").primaryKey(),

  /**
   * 'name' column:
   * - Type: text (Variable-length character string)
   * - Constraint: notNull() - This column cannot contain NULL values.
   */
  name: text("name").notNull(),

  /**
   * 'description' column:
   * - Type: text
   * - Constraint: notNull()
   */
  description: text("description").notNull(),

  /**
   * 'content' column:
   * - Type: text
   * - Constraint: notNull()
   */
  content: text("content").notNull(),

  /**
   * 'created_at' column:
   * - Type: timestamp (Date and time)
   * - Constraint: defaultNow() - Sets the default value to the current timestamp
   *   when a new row is inserted if no value is provided.
   * - Constraint: notNull()
   */
  created_at: timestamp("created_at").defaultNow().notNull(),

  /**
   * 'updated_at' column:
   * - Type: timestamp
   * - Constraint: defaultNow() - Sets the initial value upon insertion.
   * - Constraint: notNull()
   * - Special Drizzle Helper: .$onUpdate(() => new Date()) - Automatically updates
   *   this column's value to the current timestamp whenever the row is updated
   *   using Drizzle's update functions.
   */
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

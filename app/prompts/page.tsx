import { getPrompts } from "@/actions/prompts-actions"; // Import server action
import { Header } from "@/components/header";
import { Suspense } from "react"; // Import Suspense
import { LoadingGrid } from "./_components/loading-grid"; // Import loading component
import { PromptsGrid } from "./_components/prompts-grid";

export const dynamic = "force-dynamic";

// Keep as default export, but we won't fetch directly here for Suspense
export default async function PromptsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Prompts</h1>

          {/* Use Suspense to handle the loading state */}
          <Suspense fallback={<LoadingGrid />}>
            {/* Render an intermediate async component to handle data fetching */}
            <PromptsLoader />
          </Suspense>
        </div>
      </div>
    </>
  );
}

/**
 * An async Server Component responsible for fetching the data.
 * React Suspense will catch the promise awaited here and show the fallback.
 */
async function PromptsLoader() {
  // Fetch the prompts data using the Server Action
  const prompts = await getPrompts();

  // Once data is ready, render the Client Component with the data
  return <PromptsGrid initialPrompts={prompts} />;
}

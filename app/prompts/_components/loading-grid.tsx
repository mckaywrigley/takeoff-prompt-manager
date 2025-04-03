import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Plus } from "lucide-react";

export const LoadingGrid = () => {
  return (
    <>
      {/* Mimic header buttons but disabled */}
      <div className="mb-6 flex justify-end">
        <Button
          disabled
          className="gap-2"
        >
          <Plus className="w-5 h-5" /> Create Prompt
        </Button>
      </div>
      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map(
          (
            _,
            index // Render 6 skeleton cards
          ) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800/50 shadow-sm border border-gray-200 dark:border-gray-700/50"
            >
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="flex-1 min-w-0">
                    {/* Skeleton placeholders */}
                    <Skeleton className="h-5 w-3/4 mb-2 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="flex gap-1">
                    <Skeleton className="h-7 w-7 rounded bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-7 w-7 rounded bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-7 w-7 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
                <Skeleton className="h-24 w-full mt-2 bg-gray-100 dark:bg-gray-700/60" />
              </CardContent>
            </Card>
          )
        )}
      </div>
    </>
  );
};

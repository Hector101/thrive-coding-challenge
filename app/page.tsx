"use client";

import { Suspense } from "react";
import { Provider } from "react-redux";

import VirtualizedTable from "../components/virtualized-table";
import { Skeleton } from "../components/ui/skeleton";
import { store } from "@/store/store";

function LoadingFallback() {
  return (
    <div className="container mx-auto p-6 space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function Page() {
  return (
    <Provider store={store}>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            User Data Visualization Table
          </h1>
          <p className="text-muted-foreground mt-2">
            A high-performance table with virtualization, sorting, column
            reordering, and localStorage persistence.
          </p>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <VirtualizedTable />
        </Suspense>
      </div>
    </Provider>
  );
}

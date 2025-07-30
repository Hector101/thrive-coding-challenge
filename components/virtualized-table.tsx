"use client";

import React, { useMemo, useCallback, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import { FixedSizeList as List } from "react-window";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { UserWithComputed } from "../types/user";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {
  setColumnOrder,
  fetchUsers,
  rehydrateUsers,
  loadMoreUsers,
  resetPagination,
} from "@/store/table-slice";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import TableRow from "./table-row";
import SortableHeader from "./sortable-header";

const ROW_HEIGHT = 60;
const HEADER_HEIGHT = 80;

export default function VirtualizedTable() {
  const dispatch = useAppDispatch();
  const listRef = useRef<any>(null);
  const loadMoreTriggeredRef = useRef(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const tableState = useAppSelector((state) => state?.table);
  const filteredUsers = tableState?.filteredUsers || [];
  const loading = tableState?.loading || false;
  const loadingMore = tableState?.loadingMore || false;
  const error = tableState?.error || null;
  const sortConfig = tableState?.sortConfig || null;
  const columnOrder = tableState?.columnOrder || [
    "firstName",
    "lastName",
    "fullName",
    "email",
    "city",
    "registeredDate",
    "daysSinceRegistered",
  ];
  const pagination = tableState?.pagination || {
    page: 1,
    pageSize: 100,
    hasMore: true,
    totalCount: 0,
  };

  useEffect(() => {
    if (!loadingMore) {
      loadMoreTriggeredRef.current = false;
    }
  }, [loadingMore]);

  const handleLoadMore = useCallback(() => {
    if (
      pagination.hasMore &&
      !loadingMore &&
      !loading &&
      !loadMoreTriggeredRef.current
    ) {
      loadMoreTriggeredRef.current = true;
      dispatch(loadMoreUsers());
    }
  }, [
    dispatch,
    pagination.hasMore,
    pagination.page,
    loadingMore,
    loading,
    filteredUsers.length,
  ]);

  const handleScroll = useCallback(
    ({ scrollOffset, scrollUpdateWasRequested }: any) => {
      if (scrollUpdateWasRequested) return;

      if (!listRef.current) return;

      const listElement = listRef.current;
      const outerNode = listElement._outerNode;

      if (!outerNode) return;

      const { scrollHeight, clientHeight } = outerNode;

      if (!scrollHeight || !clientHeight) return;

      const scrollPercentage = (scrollOffset + clientHeight) / scrollHeight;

      if (scrollPercentage > 0.85) {
        handleLoadMore();
      }
    },
    []
  );

  useEffect(() => {
    dispatch(rehydrateUsers());

    if (filteredUsers.length === 0 && !loading && !loadingMore) {
      dispatch(fetchUsers(1));
    }
  }, [filteredUsers.length, loading, loadingMore]);

  const columns = useMemo<ColumnDef<UserWithComputed>[]>(() => {
    const baseColumns: ColumnDef<UserWithComputed>[] = [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
        size: 200,
        cell: ({ getValue }) => {
          const id = String(getValue());
          return (
            <Badge
              className="font-mono w-[390px] truncate"
              variant="secondary"
              title={id}
            >
              {id.substring(0, 15)}...
            </Badge>
          );
        },
      },
      {
        id: "firstName",
        accessorKey: "firstName",
        header: "First Name",
        size: 160,
      },
      {
        id: "lastName",
        accessorKey: "lastName",
        header: "Last Name",
        size: 160,
      },
      {
        id: "fullName",
        accessorKey: "fullName",
        header: "Full Name",
        size: 200,
        cell: ({ getValue }) => (
          <span className="font-medium">{String(getValue())}</span>
        ),
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
        size: 250,
        cell: ({ getValue }) => (
          <span className="text-primary hover:underline cursor-pointer">
            {String(getValue())}
          </span>
        ),
      },
      {
        id: "city",
        accessorKey: "city",
        header: "City",
        size: 150,
      },
      {
        id: "registeredDate",
        accessorKey: "registeredDate",
        header: "Registered Date",
        size: 180,
        cell: ({ getValue }) => {
          const date = new Date(String(getValue()));
          return (
            <span className="text-muted-foreground">
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          );
        },
      },
      {
        id: "daysSinceRegistered",
        accessorKey: "daysSinceRegistered",
        header: "DSR",
        size: 150,
        cell: ({ getValue }) => {
          const days = Number(getValue());
          return (
            <Badge
              variant={
                days < 30 ? "default" : days < 365 ? "secondary" : "outline"
              }
              className="font-mono whitespace-nowrap"
            >
              {days} Days
            </Badge>
          );
        },
      },
    ];

    return columnOrder
      .map((id) => baseColumns.find((col) => col.id === id))
      .filter(Boolean) as ColumnDef<UserWithComputed>[];
  }, [columnOrder]);

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const oldIndex = columnOrder.indexOf(String(active.id));
        const newIndex = columnOrder.indexOf(String(over?.id));
        const newOrder = arrayMove(columnOrder, oldIndex, newIndex);
        dispatch(setColumnOrder(newOrder));
      }
    },
    [columnOrder]
  );

  const handleRefresh = useCallback(() => {
    loadMoreTriggeredRef.current = false;
    dispatch(resetPagination());
    dispatch(fetchUsers(1));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Error loading data: {error}</p>
            <Button onClick={handleRefresh} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Users Info Visualization Dashboard</CardTitle>
            <p className="text-sm text-gray-900 mt-1">
              Showing {filteredUsers.length.toLocaleString()} of{" "}
              {pagination.totalCount.toLocaleString()} users
              {pagination.hasMore && " (scroll to load more)"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore || !pagination.hasMore}
              variant="outline"
              size="sm"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loadingMore ? "animate-spin" : ""}`}
              />
              Load More
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading && filteredUsers.length === 0 ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>No data available. Click refresh to load data.</p>
            <Button onClick={handleRefresh} className="mt-4">
              Load Data
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="border rounded-lg overflow-hidden">
              <div
                className="flex bg-muted border-b"
                style={{ height: HEADER_HEIGHT }}
              >
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.map((header) => (
                      <SortableHeader
                        key={header.id}
                        id={header.id}
                        column={header.column}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </SortableHeader>
                    ))
                  )}
                </SortableContext>
              </div>
              
              <List
                ref={listRef}
                width="100%"
                height={600}
                itemCount={
                  table.getRowModel().rows.length + (loadingMore ? 1 : 0)
                }
                itemSize={ROW_HEIGHT}
                onScroll={handleScroll}
                overscanCount={10}
                itemData={{
                  rows: table.getRowModel().rows,
                  columns: table.getAllColumns(),
                  loadingMore,
                  hasMore: pagination.hasMore,
                  onLoadMore: handleLoadMore,
                }}
              >
                {TableRow}
              </List>
            </div>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
}

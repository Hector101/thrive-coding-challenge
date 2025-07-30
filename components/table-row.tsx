import { flexRender } from "@tanstack/react-table";
import { RefreshCw as RefreshIcon } from "lucide-react";
import { useEffect } from "react";

interface TableRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    rows: any[];
    columns: any[];
    loadingMore: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
  };
}

const TableRow = ({ index, style, data }: TableRowProps) => {
  const { rows, loadingMore, hasMore, onLoadMore } = data;
  const row = rows[index];

  useEffect(() => {
    if (index >= rows.length - 10 && hasMore && !loadingMore) {
      onLoadMore();
    }
  }, [index, rows.length, hasMore, loadingMore, onLoadMore]);

  if (index === rows.length && loadingMore) {
    return (
      <div style={style} className="flex border-b border-border">
        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground w-full">
          <RefreshIcon className="h-4 w-4 mr-2 animate-spin" />
          Loading more users...
        </div>
      </div>
    );
  }

  if (!row) {
    return (
      <div style={style} className="flex border-b border-border">
        <div className="flex items-center p-4 text-sm text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div
      style={style}
      className="flex border-b border-border hover:bg-muted/50"
    >
      {row.getVisibleCells().map((cell: any) => (
        <div
          key={cell.id}
          className="flex items-center p-4 border-r border-border text-sm"
          style={{ width: cell.column.getSize() }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      ))}
    </div>
  );
};

export default TableRow;

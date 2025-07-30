import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical } from "lucide-react";
import { Button } from "./ui/button";

interface SortableHeaderProps {
  column: any;
  children: React.ReactNode;
  id: string;
}

const SortableHeader = ({ column, children, id }: SortableHeaderProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    width: column.getSize(),

  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-4 border-r border-border bg-muted font-semibold text-sm whitespace-nowrap"
      {...attributes}
    >
      <div {...listeners} className="cursor-grab hover:cursor-grabbing" title="Drag to rearrange">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 flex items-center justify-between">
        {children}
        <Button
          variant="ghost"
          size="sm"
          onClick={column.getToggleSortingHandler()}
          className="ml-2 h-6 w-6 p-0"
          title="Sort By"
        >
          {column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3 w-3" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowUpDown className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default SortableHeader;

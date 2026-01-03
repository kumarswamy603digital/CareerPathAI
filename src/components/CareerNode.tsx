import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';

interface CareerNodeProps {
  data: {
    label: string;
    isFiltered: boolean;
    isSelected?: boolean;
    isFocused?: boolean;
    onCareerClick?: (name: string) => void;
  };
}

export function CareerNode({ data }: CareerNodeProps) {
  const handleClick = () => {
    if (data.onCareerClick) {
      data.onCareerClick(data.label);
    }
  };

  return (
    <div
      onClick={handleClick}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleClick();
      }}
      className={cn(
        'px-4 py-3 md:py-2 rounded-lg border-2 transition-all duration-300 min-w-[120px] md:min-w-[130px] text-center cursor-pointer touch-manipulation',
        'bg-card border-border hover:glow-amber active:scale-95 md:hover:scale-105',
        data.isSelected && 'border-primary bg-accent ring-2 ring-primary/30 glow-amber',
        data.isFocused && !data.isSelected && 'border-primary/60 ring-2 ring-primary/20 scale-105',
        data.isFiltered && !data.isSelected && !data.isFocused && 'opacity-40 grayscale bg-muted-node border-muted-node'
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-border !w-2 !h-2" />
      <span
        className={cn(
          'text-xs md:text-sm font-medium select-none',
          data.isSelected ? 'text-primary font-semibold' : 'text-foreground',
          data.isFocused && !data.isSelected && 'text-primary',
          data.isFiltered && !data.isSelected && !data.isFocused && 'text-muted-foreground'
        )}
      >
        {data.label}
      </span>
      <Handle type="source" position={Position.Bottom} className="!bg-border !w-2 !h-2" />
    </div>
  );
}

export function SubCategoryNode({ data }: { data: { label: string } }) {
  return (
    <div className="px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm shadow-md border border-border">
      <Handle type="target" position={Position.Top} className="!bg-secondary-foreground !w-2 !h-2" />
      {data.label}
      <Handle type="source" position={Position.Bottom} className="!bg-secondary-foreground !w-2 !h-2" />
    </div>
  );
}

export function CategoryNode({ data }: { data: { label: string } }) {
  return (
    <div className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-serif font-bold text-lg shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-primary-foreground !w-2 !h-2" />
      {data.label}
      <Handle type="source" position={Position.Bottom} className="!bg-primary-foreground !w-2 !h-2" />
    </div>
  );
}

export function RootNode({ data }: { data: { label: string } }) {
  return (
    <div className="px-8 py-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-serif font-bold text-2xl shadow-xl animate-pulse-ring">
      {data.label}
      <Handle type="source" position={Position.Bottom} className="!bg-primary-foreground !w-3 !h-3" />
    </div>
  );
}

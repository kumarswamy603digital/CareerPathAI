import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';

interface CareerNodeProps {
  data: {
    label: string;
    category: string;
    isFiltered: boolean;
  };
}

const categoryColors: Record<string, string> = {
  Tech: 'bg-blue-500/20 border-blue-500',
  Science: 'bg-purple-500/20 border-purple-500',
  Creative: 'bg-pink-500/20 border-pink-500',
  Media: 'bg-orange-500/20 border-orange-500',
  Business: 'bg-green-500/20 border-green-500',
  Health: 'bg-teal-500/20 border-teal-500',
  Education: 'bg-yellow-500/20 border-yellow-500',
  Law: 'bg-red-500/20 border-red-500',
  Trades: 'bg-amber-500/20 border-amber-500',
  Operations: 'bg-indigo-500/20 border-indigo-500',
  Gaming: 'bg-violet-500/20 border-violet-500',
  Social: 'bg-rose-500/20 border-rose-500',
};

export function CareerNode({ data }: CareerNodeProps) {
  const colorClass = categoryColors[data.category] || 'bg-muted border-muted-foreground';
  
  return (
    <div
      className={cn(
        'px-4 py-2 rounded-lg border-2 transition-all duration-300 min-w-[140px] text-center',
        colorClass,
        data.isFiltered && 'opacity-20 grayscale'
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
      <span className={cn(
        'text-sm font-medium',
        data.isFiltered ? 'text-muted-foreground' : 'text-foreground'
      )}>
        {data.label}
      </span>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </div>
  );
}

export function CategoryNode({ data }: { data: { label: string } }) {
  return (
    <div className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-primary-foreground" />
      {data.label}
      <Handle type="source" position={Position.Bottom} className="!bg-primary-foreground" />
    </div>
  );
}

export function RootNode({ data }: { data: { label: string } }) {
  return (
    <div className="px-8 py-4 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-xl shadow-xl">
      {data.label}
      <Handle type="source" position={Position.Bottom} className="!bg-primary-foreground" />
    </div>
  );
}

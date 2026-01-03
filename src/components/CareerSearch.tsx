import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { careers } from '@/data/careerData';
import { cn } from '@/lib/utils';

interface CareerSearchProps {
  onCareerSelect: (careerName: string) => void;
}

export function CareerSearch({ onCareerSelect }: CareerSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCareers = query.trim()
    ? careers.filter(career =>
        career.name.toLowerCase().includes(query.toLowerCase()) ||
        career.category.toLowerCase().includes(query.toLowerCase()) ||
        career.interests.some(i => i.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8)
    : [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredCareers.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCareers.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCareers.length) % filteredCareers.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(filteredCareers[selectedIndex].name);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (careerName: string) => {
    onCareerSelect(careerName);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search careers..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 bg-background border-border"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && filteredCareers.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <ul className="py-1 max-h-80 overflow-y-auto">
            {filteredCareers.map((career, index) => (
              <li key={career.name}>
                <button
                  onClick={() => handleSelect(career.name)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors flex items-center justify-between gap-2",
                    index === selectedIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{career.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {career.interests.slice(0, 3).join(' • ')}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {career.category}
                  </Badge>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && query.trim() && filteredCareers.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 p-4 text-center">
          <p className="text-sm text-muted-foreground">No careers found for "{query}"</p>
        </div>
      )}
    </div>
  );
}

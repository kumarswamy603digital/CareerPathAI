import { useEffect, useCallback, useState } from 'react';
import { careerTree } from '@/data/careerTreeData';

interface UseTreeKeyboardNavigationProps {
  onCareerSelect: (careerName: string) => void;
  filteredOutCareers: Set<string>;
}

export function useTreeKeyboardNavigation({
  onCareerSelect,
  filteredOutCareers,
}: UseTreeKeyboardNavigationProps) {
  const [focusedCareerIndex, setFocusedCareerIndex] = useState<number>(-1);
  const [isNavigating, setIsNavigating] = useState(false);

  // Get all career names in a flat list (respecting tree order)
  const allCareers = useCallback(() => {
    const careers: string[] = [];
    careerTree.forEach(category => {
      category.subcategories.forEach(subcategory => {
        subcategory.careers.forEach(career => {
          if (!filteredOutCareers.has(career.name)) {
            careers.push(career.name);
          }
        });
      });
    });
    return careers;
  }, [filteredOutCareers]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const careers = allCareers();
      if (careers.length === 0) return;

      // Check if we're in an input field
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          setIsNavigating(true);
          setFocusedCareerIndex(prev => {
            const next = prev + 1;
            return next >= careers.length ? 0 : next;
          });
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          setIsNavigating(true);
          setFocusedCareerIndex(prev => {
            const next = prev - 1;
            return next < 0 ? careers.length - 1 : next;
          });
          break;

        case 'Enter':
        case ' ':
          if (focusedCareerIndex >= 0 && focusedCareerIndex < careers.length) {
            event.preventDefault();
            onCareerSelect(careers[focusedCareerIndex]);
          }
          break;

        case 'Escape':
          setIsNavigating(false);
          setFocusedCareerIndex(-1);
          break;

        case 'Home':
          event.preventDefault();
          setIsNavigating(true);
          setFocusedCareerIndex(0);
          break;

        case 'End':
          event.preventDefault();
          setIsNavigating(true);
          setFocusedCareerIndex(careers.length - 1);
          break;
      }
    },
    [allCareers, focusedCareerIndex, onCareerSelect]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset focus when filters change
  useEffect(() => {
    setFocusedCareerIndex(-1);
    setIsNavigating(false);
  }, [filteredOutCareers]);

  const focusedCareer = focusedCareerIndex >= 0 ? allCareers()[focusedCareerIndex] : null;

  return {
    focusedCareer,
    isNavigating,
    focusedCareerIndex,
    totalCareers: allCareers().length,
  };
}

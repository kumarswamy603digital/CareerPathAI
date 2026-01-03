import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FilterPanel, SalaryRange, salaryRanges, EducationLevel, educationLevels, GrowthRate, growthRates } from '@/components/FilterPanel';
import { MobileTreeControls } from '@/components/MobileTreeControls';
import { AIChatButton } from '@/components/AIChatButton';
import { CareerSearch } from '@/components/CareerSearch';
import { CareerNode, CategoryNode, SubCategoryNode, RootNode } from '@/components/CareerNode';
import { CareerDetailPanel } from '@/components/CareerDetailPanel';
import { CareerCompareModal } from '@/components/CareerCompareModal';
import { careerTree } from '@/data/careerTreeData';
import { getCareerDetails, CareerDetails, careerDetails } from '@/data/careerDetails';
import { Personality, Interest } from '@/data/careerData';
import { useCareerShortlist } from '@/hooks/useCareerShortlist';
import { useCareerHistory } from '@/hooks/useCareerHistory';
import { useTreeKeyboardNavigation } from '@/hooks/useTreeKeyboardNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

const nodeTypes = {
  career: CareerNode,
  category: CategoryNode,
  subcategory: SubCategoryNode,
  root: RootNode,
};

import { cn } from '@/lib/utils';

function generateNodesAndEdges(
  filteredOutCareers: Set<string>,
  selectedCareer: string | null,
  onCareerClick: (name: string) => void,
  focusedCareer: string | null
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Root node at the top
  nodes.push({
    id: 'root',
    type: 'root',
    position: { x: 800, y: 0 },
    data: { label: 'Career Paths' },
  });

  // Calculate positions for categories
  const categorySpacing = 350;
  const totalWidth = careerTree.length * categorySpacing;
  const startX = 800 - totalWidth / 2 + categorySpacing / 2;

  careerTree.forEach((category, catIndex) => {
    const categoryId = `category-${category.id}`;
    const categoryX = startX + catIndex * categorySpacing;

    nodes.push({
      id: categoryId,
      type: 'category',
      position: { x: categoryX, y: 120 },
      data: { label: category.name },
    });

    edges.push({
      id: `edge-root-${categoryId}`,
      source: 'root',
      target: categoryId,
      style: { stroke: 'hsl(42 100% 50%)', strokeWidth: 2 },
    });

    // Subcategories
    const subSpacing = 200;
    const subStartX = categoryX - ((category.subcategories.length - 1) * subSpacing) / 2;

    category.subcategories.forEach((subcategory, subIndex) => {
      const subId = `subcategory-${subcategory.id}`;
      const subX = subStartX + subIndex * subSpacing;
      const subY = 250;

      nodes.push({
        id: subId,
        type: 'subcategory',
        position: { x: subX, y: subY },
        data: { label: subcategory.name },
      });

      edges.push({
        id: `edge-${categoryId}-${subId}`,
        source: categoryId,
        target: subId,
        style: { stroke: 'hsl(36 28% 35%)', strokeWidth: 1.5 },
      });

      // Careers under each subcategory
      const careerSpacing = 55;
      const careersPerRow = 2;
      
      subcategory.careers.forEach((career, careerIndex) => {
        const careerId = `career-${career.id}`;
        const row = Math.floor(careerIndex / careersPerRow);
        const col = careerIndex % careersPerRow;
        const xOffset = (col - (careersPerRow - 1) / 2) * 140;
        const careerX = subX + xOffset;
        const careerY = subY + 130 + row * careerSpacing;

        const isFiltered = filteredOutCareers.has(career.name);
        const isSelected = selectedCareer === career.name;
        const isFocused = focusedCareer === career.name;

        nodes.push({
          id: careerId,
          type: 'career',
          position: { x: careerX, y: careerY },
          data: {
            label: career.name,
            isFiltered: isFiltered && !isSelected && !isFocused, // Don't gray out if it's the selected or focused career
            isSelected,
            isFocused,
            onCareerClick,
          },
        });

        edges.push({
          id: `edge-${subId}-${careerId}`,
          source: subId,
          target: careerId,
          style: {
            stroke: isFiltered && !isSelected ? 'hsl(0 0% 85%)' : 'hsl(36 20% 88%)',
            strokeWidth: 1,
          },
        });
      });
    });
  });

  return { nodes, edges };
}

function CareerTreeContent() {
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  
  // Get initial values from URL params (from onboarding)
  const initialCareer = searchParams.get('career') || null;
  const initialInterests = searchParams.get('interests')?.split(',').filter(Boolean) as Interest[] || [];
  const initialPersonalities = searchParams.get('personality')?.split(',').filter(Boolean) as Personality[] || [];

  const [selectedPersonalities, setSelectedPersonalities] = useState<Personality[]>(initialPersonalities);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>(initialInterests);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<SalaryRange>('all');
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<EducationLevel>('all');
  const [selectedGrowthRate, setSelectedGrowthRate] = useState<GrowthRate>('all');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selectedCareer] = useState<string | null>(initialCareer);
  
  // Detail panel state
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [selectedCareerDetails, setSelectedCareerDetails] = useState<CareerDetails | null>(null);

  // Shortlist hook
  const { shortlist, isInShortlist, toggleShortlist, removeFromShortlist } = useCareerShortlist();

  // History hook
  const { addToHistory } = useCareerHistory();

  // Compare modal state
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [careersToCompare, setCareersToCompare] = useState<string[]>([]);

  const handleCareerClick = useCallback((careerName: string) => {
    const details = getCareerDetails(careerName);
    if (details) {
      setSelectedCareerDetails(details);
      setDetailPanelOpen(true);
      // Track view in history
      addToHistory(careerName);
    }
  }, [addToHistory]);

  const handleCompare = useCallback((careers: string[]) => {
    setCareersToCompare(careers);
    setCompareModalOpen(true);
  }, []);

  const handleRemoveFromCompare = useCallback((careerName: string) => {
    setCareersToCompare(prev => {
      const updated = prev.filter(c => c !== careerName);
      if (updated.length < 2) {
        setCompareModalOpen(false);
      }
      return updated;
    });
  }, []);

  const filteredOutCareers = useMemo(() => {
    const filtered = new Set<string>();

    // Get salary filter bounds
    const salaryFilter = salaryRanges.find(r => r.value === selectedSalaryRange);
    const salaryMin = salaryFilter?.min ?? 0;
    const salaryMax = salaryFilter?.max ?? Infinity;

    // Get education filter keywords
    const educationFilter = educationLevels.find(e => e.value === selectedEducationLevel);
    const educationKeywords = educationFilter?.keywords ?? [];

    // Get growth rate filter
    const growthFilter = growthRates.find(g => g.value === selectedGrowthRate);
    const growthOutlook = growthFilter?.jobOutlook ?? '';

    if (selectedPersonalities.length === 0 && selectedInterests.length === 0 && selectedSalaryRange === 'all' && selectedEducationLevel === 'all' && selectedGrowthRate === 'all' && !remoteOnly) {
      return filtered;
    }

    careerTree.forEach(category => {
      category.subcategories.forEach(subcategory => {
        subcategory.careers.forEach(career => {
          let matchesPersonality = selectedPersonalities.length === 0;
          let matchesInterest = selectedInterests.length === 0;
          let matchesSalary = selectedSalaryRange === 'all';
          let matchesEducation = selectedEducationLevel === 'all';
          let matchesGrowth = selectedGrowthRate === 'all';
          let matchesRemote = !remoteOnly;

          if (selectedPersonalities.length > 0) {
            matchesPersonality = selectedPersonalities.some(p => 
              career.personalities.includes(p as Personality)
            );
          }

          if (selectedInterests.length > 0) {
            matchesInterest = selectedInterests.some(i => 
              career.interests.includes(i as Interest)
            );
          }

          // Check salary range if filter is active
          if (selectedSalaryRange !== 'all') {
            const details = careerDetails[career.name];
            if (details) {
              // Career matches if its salary range overlaps with the filter range
              matchesSalary = details.salaryRange.max >= salaryMin && details.salaryRange.min <= salaryMax;
            } else {
              // If no salary data, don't filter out
              matchesSalary = true;
            }
          }

          // Check education level if filter is active
          if (selectedEducationLevel !== 'all') {
            const details = careerDetails[career.name];
            if (details && details.education) {
              // Career matches if any of its education options contain the filter keywords
              matchesEducation = details.education.some(edu => 
                educationKeywords.some(keyword => edu.toLowerCase().includes(keyword.toLowerCase()))
              );
            } else {
              // If no education data, don't filter out
              matchesEducation = true;
            }
          }

          // Check growth rate if filter is active
          if (selectedGrowthRate !== 'all') {
            const details = careerDetails[career.name];
            if (details && details.jobOutlook) {
              matchesGrowth = details.jobOutlook === growthOutlook;
            } else {
              // If no growth data, don't filter out
              matchesGrowth = true;
            }
          }

          // Check remote compatibility if filter is active
          if (remoteOnly) {
            const details = careerDetails[career.name];
            if (details) {
              matchesRemote = details.remoteCompatible === true;
            } else {
              // If no remote data, don't filter out
              matchesRemote = true;
            }
          }

          if (!matchesPersonality || !matchesInterest || !matchesSalary || !matchesEducation || !matchesGrowth || !matchesRemote) {
            filtered.add(career.name);
          }
        });
      });
    });

    return filtered;
  }, [selectedPersonalities, selectedInterests, selectedSalaryRange, selectedEducationLevel, selectedGrowthRate, remoteOnly]);

  // Keyboard navigation hook
  const { focusedCareer, isNavigating, focusedCareerIndex, totalCareers } = useTreeKeyboardNavigation({
    onCareerSelect: handleCareerClick,
    filteredOutCareers,
  });

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => generateNodesAndEdges(filteredOutCareers, selectedCareer, handleCareerClick, focusedCareer),
    [filteredOutCareers, selectedCareer, handleCareerClick, focusedCareer]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when filters or focused career change
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateNodesAndEdges(filteredOutCareers, selectedCareer, handleCareerClick, focusedCareer);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [filteredOutCareers, selectedCareer, handleCareerClick, focusedCareer, setNodes, setEdges]);

  // Zoom handlers for mobile
  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 300 });
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 300 });
  }, [zoomOut]);

  const handleFitView = useCallback(() => {
    fitView({ duration: 300, padding: 0.2 });
  }, [fitView]);

  return (
    <div className="h-screen w-full flex bg-card">
      {/* Desktop Filter Panel */}
      {!isMobile && (
        <FilterPanel
          selectedPersonalities={selectedPersonalities}
          selectedInterests={selectedInterests}
          selectedSalaryRange={selectedSalaryRange}
          selectedEducationLevel={selectedEducationLevel}
          selectedGrowthRate={selectedGrowthRate}
          remoteOnly={remoteOnly}
          onPersonalityChange={setSelectedPersonalities}
          onInterestChange={setSelectedInterests}
          onSalaryRangeChange={setSelectedSalaryRange}
          onEducationLevelChange={setSelectedEducationLevel}
          onGrowthRateChange={setSelectedGrowthRate}
          onRemoteOnlyChange={setRemoteOnly}
          recommendedCareer={selectedCareer}
          shortlist={shortlist}
          onRemoveFromShortlist={removeFromShortlist}
          onCompare={handleCompare}
          onCareerClick={handleCareerClick}
        />
      )}

      <div className="flex-1 relative">
        {/* Keyboard Navigation Indicator - Desktop only */}
        {!isMobile && isNavigating && focusedCareer && (
          <div className="absolute top-4 right-4 z-20 bg-card border border-border rounded-lg shadow-lg px-4 py-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Navigating:</span>
              <span className="font-medium text-primary">{focusedCareer}</span>
              <span className="text-muted-foreground">({focusedCareerIndex + 1}/{totalCareers})</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ↑↓←→ Navigate • Enter Select • Esc Exit
            </div>
          </div>
        )}

        {/* Global Career Search */}
        <div className={cn(
          "absolute z-10 w-full px-4",
          isMobile ? "top-2 max-w-xs left-2 translate-x-0" : "top-4 left-1/2 -translate-x-1/2 max-w-md"
        )}>
          <CareerSearch onCareerSelect={handleCareerClick} />
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.05}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: isMobile ? 0.25 : 0.4 }}
          // Mobile touch settings
          panOnScroll={!isMobile}
          panOnDrag={true}
          zoomOnPinch={true}
          zoomOnScroll={!isMobile}
          zoomOnDoubleClick={true}
          preventScrolling={true}
          // Larger hit areas on mobile
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background color="hsl(36 20% 88%)" gap={24} size={1} />
          {/* Hide default controls on mobile - we use custom ones */}
          {!isMobile && (
            <Controls className="bg-card border border-border rounded-lg shadow-lg" />
          )}
          {/* Hide minimap on mobile to save space */}
          {!isMobile && (
            <MiniMap
              className="bg-card border border-border rounded-lg shadow-lg"
              nodeColor={(node) => {
                if (node.type === 'root') return 'hsl(42 100% 50%)';
                if (node.type === 'category') return 'hsl(42 100% 50%)';
                if (node.type === 'subcategory') return 'hsl(36 28% 35%)';
                if (node.data?.isFocused) return 'hsl(42 80% 60%)';
                if (node.data?.isSelected) return 'hsl(42 100% 50%)';
                if (node.data?.isFiltered) return 'hsl(0 0% 85%)';
                return 'hsl(36 20% 88%)';
              }}
            />
          )}
        </ReactFlow>

        {/* Mobile Controls */}
        {isMobile && (
          <MobileTreeControls
            selectedPersonalities={selectedPersonalities}
            selectedInterests={selectedInterests}
            selectedSalaryRange={selectedSalaryRange}
            selectedEducationLevel={selectedEducationLevel}
            selectedGrowthRate={selectedGrowthRate}
            remoteOnly={remoteOnly}
            onPersonalityChange={setSelectedPersonalities}
            onInterestChange={setSelectedInterests}
            onSalaryRangeChange={setSelectedSalaryRange}
            onEducationLevelChange={setSelectedEducationLevel}
            onGrowthRateChange={setSelectedGrowthRate}
            onRemoteOnlyChange={setRemoteOnly}
            recommendedCareer={selectedCareer}
            shortlist={shortlist}
            onRemoveFromShortlist={removeFromShortlist}
            onCompare={handleCompare}
            onCareerClick={handleCareerClick}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFitView={handleFitView}
          />
        )}
      </div>

      <CareerDetailPanel
        career={selectedCareerDetails}
        open={detailPanelOpen}
        onOpenChange={setDetailPanelOpen}
        isInShortlist={selectedCareerDetails ? isInShortlist(selectedCareerDetails.name) : false}
        onToggleShortlist={toggleShortlist}
        onViewCareer={handleCareerClick}
      />

      <CareerCompareModal
        careers={careersToCompare}
        open={compareModalOpen}
        onOpenChange={setCompareModalOpen}
        onRemoveCareer={handleRemoveFromCompare}
      />

      <AIChatButton />
    </div>
  );
}

// Wrapper component to provide ReactFlowProvider
export default function CareerTree() {
  return (
    <ReactFlowProvider>
      <CareerTreeContent />
    </ReactFlowProvider>
  );
}

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FilterPanel } from '@/components/FilterPanel';
import { CareerNode, CategoryNode, SubCategoryNode, RootNode } from '@/components/CareerNode';
import { careerTree } from '@/data/careerTreeData';
import { Personality, Interest } from '@/data/careerData';

const nodeTypes = {
  career: CareerNode,
  category: CategoryNode,
  subcategory: SubCategoryNode,
  root: RootNode,
};

function generateNodesAndEdges(
  filteredOutCareers: Set<string>,
  selectedCareer: string | null
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

        nodes.push({
          id: careerId,
          type: 'career',
          position: { x: careerX, y: careerY },
          data: {
            label: career.name,
            isFiltered: isFiltered && !isSelected, // Don't gray out if it's the selected career
            isSelected,
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

export default function CareerTree() {
  const [searchParams] = useSearchParams();
  
  // Get initial values from URL params (from onboarding)
  const initialCareer = searchParams.get('career') || null;
  const initialInterests = searchParams.get('interests')?.split(',').filter(Boolean) as Interest[] || [];
  const initialPersonalities = searchParams.get('personality')?.split(',').filter(Boolean) as Personality[] || [];

  const [selectedPersonalities, setSelectedPersonalities] = useState<Personality[]>(initialPersonalities);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>(initialInterests);
  const [selectedCareer] = useState<string | null>(initialCareer);

  const filteredOutCareers = useMemo(() => {
    const filtered = new Set<string>();

    if (selectedPersonalities.length === 0 && selectedInterests.length === 0) {
      return filtered;
    }

    careerTree.forEach(category => {
      category.subcategories.forEach(subcategory => {
        subcategory.careers.forEach(career => {
          let matchesPersonality = selectedPersonalities.length === 0;
          let matchesInterest = selectedInterests.length === 0;

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

          if (!matchesPersonality || !matchesInterest) {
            filtered.add(career.name);
          }
        });
      });
    });

    return filtered;
  }, [selectedPersonalities, selectedInterests]);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => generateNodesAndEdges(filteredOutCareers, selectedCareer),
    [filteredOutCareers, selectedCareer]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when filters change
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateNodesAndEdges(filteredOutCareers, selectedCareer);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [filteredOutCareers, selectedCareer, setNodes, setEdges]);

  return (
    <div className="h-screen w-full flex bg-card">
      <FilterPanel
        selectedPersonalities={selectedPersonalities}
        selectedInterests={selectedInterests}
        onPersonalityChange={setSelectedPersonalities}
        onInterestChange={setSelectedInterests}
        recommendedCareer={selectedCareer}
      />

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.4 }}
        >
          <Background color="hsl(36 20% 88%)" gap={24} size={1} />
          <Controls className="bg-card border border-border rounded-lg shadow-lg" />
          <MiniMap
            className="bg-card border border-border rounded-lg shadow-lg"
            nodeColor={(node) => {
              if (node.type === 'root') return 'hsl(42 100% 50%)';
              if (node.type === 'category') return 'hsl(42 100% 50%)';
              if (node.type === 'subcategory') return 'hsl(36 28% 35%)';
              if (node.data?.isSelected) return 'hsl(42 100% 50%)';
              if (node.data?.isFiltered) return 'hsl(0 0% 85%)';
              return 'hsl(36 20% 88%)';
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

import { useState, useCallback, useMemo } from 'react';
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
import { CareerNode, CategoryNode, RootNode } from '@/components/CareerNode';
import { careers, categories, Personality, Interest } from '@/data/careerData';

const nodeTypes = {
  career: CareerNode,
  category: CategoryNode,
  root: RootNode,
};

function generateNodesAndEdges(
  filteredOutCareers: Set<string>
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Root node
  nodes.push({
    id: 'root',
    type: 'root',
    position: { x: 600, y: 0 },
    data: { label: '🎯 Career Paths' },
  });

  // Category nodes - spread them horizontally
  const categorySpacing = 200;
  const startX = -(categories.length * categorySpacing) / 2 + 600;

  categories.forEach((category, index) => {
    const categoryId = `category-${category}`;
    nodes.push({
      id: categoryId,
      type: 'category',
      position: { x: startX + index * categorySpacing, y: 120 },
      data: { label: category },
    });

    edges.push({
      id: `edge-root-${categoryId}`,
      source: 'root',
      target: categoryId,
      style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2 },
    });
  });

  // Career nodes - group by category
  const careersByCategory: Record<string, typeof careers> = {};
  careers.forEach(career => {
    if (!careersByCategory[career.category]) {
      careersByCategory[career.category] = [];
    }
    careersByCategory[career.category].push(career);
  });

  categories.forEach((category, catIndex) => {
    const categoryCareers = careersByCategory[category] || [];
    const categoryX = startX + catIndex * categorySpacing;
    const careerSpacing = 60;
    const startY = 250;

    categoryCareers.forEach((career, careerIndex) => {
      const careerId = `career-${career.name.replace(/\s+/g, '-')}`;
      const xOffset = (careerIndex % 2 === 0 ? -50 : 50);
      
      nodes.push({
        id: careerId,
        type: 'career',
        position: { 
          x: categoryX + xOffset, 
          y: startY + Math.floor(careerIndex / 2) * careerSpacing 
        },
        data: { 
          label: career.name, 
          category: career.category,
          isFiltered: filteredOutCareers.has(career.name),
        },
      });

      edges.push({
        id: `edge-${category}-${careerId}`,
        source: `category-${category}`,
        target: careerId,
        style: { 
          stroke: filteredOutCareers.has(career.name) 
            ? 'hsl(var(--muted))' 
            : 'hsl(var(--muted-foreground))', 
          strokeWidth: 1 
        },
      });
    });
  });

  return { nodes, edges };
}

export default function CareerTree() {
  const [selectedPersonalities, setSelectedPersonalities] = useState<Personality[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);

  const filteredOutCareers = useMemo(() => {
    const filtered = new Set<string>();
    
    if (selectedPersonalities.length === 0 && selectedInterests.length === 0) {
      return filtered;
    }

    careers.forEach(career => {
      let matchesPersonality = selectedPersonalities.length === 0;
      let matchesInterest = selectedInterests.length === 0;

      if (selectedPersonalities.length > 0) {
        matchesPersonality = selectedPersonalities.some(p => career.personalities.includes(p));
      }

      if (selectedInterests.length > 0) {
        matchesInterest = selectedInterests.some(i => career.interests.includes(i));
      }

      if (!matchesPersonality || !matchesInterest) {
        filtered.add(career.name);
      }
    });

    return filtered;
  }, [selectedPersonalities, selectedInterests]);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => generateNodesAndEdges(filteredOutCareers),
    [filteredOutCareers]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when filters change
  useMemo(() => {
    const { nodes: newNodes, edges: newEdges } = generateNodesAndEdges(filteredOutCareers);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [filteredOutCareers, setNodes, setEdges]);

  return (
    <div className="h-screen w-full flex bg-background">
      <FilterPanel
        selectedPersonalities={selectedPersonalities}
        selectedInterests={selectedInterests}
        onPersonalityChange={setSelectedPersonalities}
        onInterestChange={setSelectedInterests}
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
          defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
        >
          <Background color="hsl(var(--muted-foreground))" gap={20} size={1} />
          <Controls className="bg-card border border-border rounded-lg" />
          <MiniMap 
            className="bg-card border border-border rounded-lg"
            nodeColor={(node) => {
              if (node.type === 'root') return 'hsl(var(--primary))';
              if (node.type === 'category') return 'hsl(var(--primary))';
              return 'hsl(var(--muted-foreground))';
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

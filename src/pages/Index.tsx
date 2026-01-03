import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, GitBranch, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <Compass className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            CareerPath
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover your ideal career path based on your personality and interests
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-10">
          <div className="p-6 rounded-xl bg-card border border-border">
            <GitBranch className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Visual Career Tree</h3>
            <p className="text-sm text-muted-foreground">
              Explore 68+ careers organized in an interactive flowchart
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <Sparkles className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Smart Filters</h3>
            <p className="text-sm text-muted-foreground">
              Filter by personality type and interests to find your match
            </p>
          </div>
        </div>

        <Link to="/tree">
          <Button size="lg" className="text-lg px-8 py-6">
            Explore Career Tree
            <GitBranch className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;

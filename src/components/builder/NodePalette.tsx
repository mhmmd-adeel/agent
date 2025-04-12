import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NodeCategory, NodeType } from "@/types/builder";
import { nodeCategories } from "@/data/nodeData";

interface NodePaletteProps {
  onAddNode: (type: NodeType) => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const filteredCategories = React.useMemo(() => {
    if (!searchTerm) return nodeCategories;
    
    return nodeCategories.map(category => ({
      ...category,
      nodes: category.nodes.filter(node => 
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.nodes.length > 0);
  }, [searchTerm, nodeCategories]);
  
  return (
    <div className="border rounded-lg bg-card h-full flex flex-col">
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5 h-auto p-1 mx-3 mt-2">
          <TabsTrigger value="all" className="text-xs py-1.5">All</TabsTrigger>
          <TabsTrigger value="llm" className="text-xs py-1.5">LLM</TabsTrigger>
          <TabsTrigger value="memory" className="text-xs py-1.5">Memory</TabsTrigger>
          <TabsTrigger value="tools" className="text-xs py-1.5">Tools</TabsTrigger>
          <TabsTrigger value="flow" className="text-xs py-1.5">Flow</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="flex-1 mt-0">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="p-3 space-y-4">
              {filteredCategories.map((category) => (
                <CategorySection 
                  key={category.id} 
                  category={category} 
                  onAddNode={onAddNode} 
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* Other tabs would be similar, but filtered by category */}
        <TabsContent value="llm" className="flex-1 mt-0">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="p-3 space-y-4">
              {filteredCategories
                .filter(cat => cat.id === 'llm')
                .map((category) => (
                  <CategorySection 
                    key={category.id} 
                    category={category} 
                    onAddNode={onAddNode} 
                  />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* Similar pattern for other tab contents */}
      </Tabs>
    </div>
  );
};

const CategorySection: React.FC<{
  category: NodeCategory;
  onAddNode: (type: NodeType) => void;
}> = ({ category, onAddNode }) => {
  if (category.nodes.length === 0) return null;
  
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{category.name}</h3>
      <div className="grid grid-cols-1 gap-2">
        {category.nodes.map((node) => (
          <ComponentItem 
            key={node.type} 
            name={node.name} 
            description={node.description}
            type={node.type} 
            onAdd={() => onAddNode(node.type)} 
          />
        ))}
      </div>
    </div>
  );
};

const ComponentItem: React.FC<{
  name: string;
  description: string;
  type: NodeType;
  onAdd: () => void;
}> = ({ name, description, type, onAdd }) => {
  return (
    <div className="border rounded-md p-2 bg-white hover:border-garden-teal cursor-pointer transition-colors"
      onClick={onAdd}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{name}</span>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}>
          <span className="sr-only">Add</span>
          <span className="text-xs font-medium">+</span>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
    </div>
  );
};

export default NodePalette;

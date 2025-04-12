
import React from "react";
import { NodeData } from "@/types/builder";
import { LucideIcon } from "lucide-react";
import { getNodeIcon, getNodeColor } from "@/lib/nodeUtils";

interface AgentNodeProps {
  node: NodeData;
  onDragStart: (e: React.MouseEvent) => void;
  onConnectorMouseDown: (
    e: React.MouseEvent,
    nodeId: string,
    type: 'input' | 'output'
  ) => void;
  onConnectorMouseUp: (
    e: React.MouseEvent,
    nodeId: string,
    type: 'input' | 'output'
  ) => void;
}

const AgentNode: React.FC<AgentNodeProps> = ({
  node,
  onDragStart,
  onConnectorMouseDown,
  onConnectorMouseUp,
}) => {
  const Icon = getNodeIcon(node.type);
  const colorClass = getNodeColor(node.type);
  
  return (
    <div
      className="agent-node select-none cursor-move"
      style={{
        position: 'absolute',
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        width: '150px',
        zIndex: 10
      }}
      onMouseDown={onDragStart}
    >
      <div className={`absolute -top-2 -left-2 p-1.5 rounded-md ${colorClass}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      
      <div className="node-connector-input"
        onMouseDown={(e) => onConnectorMouseDown(e, node.id, 'input')}
        onMouseUp={(e) => onConnectorMouseUp(e, node.id, 'input')}
      />
      
      <div className="node-connector-output"
        onMouseDown={(e) => onConnectorMouseDown(e, node.id, 'output')}
        onMouseUp={(e) => onConnectorMouseUp(e, node.id, 'output')}
      />
      
      <div className="pt-2">
        <h3 className="font-medium text-sm">{node.name}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {node.description}
        </p>
      </div>
    </div>
  );
};

export default AgentNode;

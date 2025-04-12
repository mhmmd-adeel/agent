
import React, { useState } from "react";
import AgentNode from "./AgentNode";
import { NodeConnection } from "./NodeConnection";
import { NodeData, ConnectionData } from "@/types/builder";
import { generateId } from "@/lib/utils";

interface BuilderCanvasProps {
  nodes: NodeData[];
  connections: ConnectionData[];
  onNodesChange: (nodes: NodeData[]) => void;
  onConnectionsChange: (connections: ConnectionData[]) => void;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({
  nodes,
  connections,
  onNodesChange,
  onConnectionsChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startConnector, setStartConnector] = useState<{ nodeId: string; type: 'input' | 'output' } | null>(null);
  const [tempConnectionEnd, setTempConnectionEnd] = useState<{ x: number; y: number } | null>(null);

  const handleNodeDragStart = (
    e: React.MouseEvent,
    nodeId: string,
    currentPosition: { x: number; y: number }
  ) => {
    setIsDragging(true);
    setDragNodeId(nodeId);
    setDragOffset({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragNodeId) {
      const newNodes = nodes.map((node) => {
        if (node.id === dragNodeId) {
          return {
            ...node,
            position: {
              x: e.clientX - dragOffset.x,
              y: e.clientY - dragOffset.y,
            },
          };
        }
        return node;
      });
      onNodesChange(newNodes);
    }

    if (startConnector && !isDragging) {
      setTempConnectionEnd({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragNodeId(null);
    setStartConnector(null);
    setTempConnectionEnd(null);
  };

  const handleConnectorMouseDown = (
    e: React.MouseEvent,
    nodeId: string,
    type: 'input' | 'output'
  ) => {
    e.stopPropagation();
    setStartConnector({ nodeId, type });
    setTempConnectionEnd({ x: e.clientX, y: e.clientY });
  };

  const handleConnectorMouseUp = (
    e: React.MouseEvent,
    nodeId: string,
    type: 'input' | 'output'
  ) => {
    e.stopPropagation();
    
    if (startConnector && startConnector.nodeId !== nodeId) {
      // Don't connect input to input or output to output
      if (startConnector.type === type) return;
      
      const source = type === 'input' ? nodeId : startConnector.nodeId;
      const target = type === 'input' ? startConnector.nodeId : nodeId;
      
      // Check if this connection already exists
      const connectionExists = connections.some(
        conn => conn.sourceId === source && conn.targetId === target
      );
      
      if (!connectionExists) {
        const newConnection: ConnectionData = {
          id: generateId(),
          sourceId: source,
          targetId: target,
        };
        
        onConnectionsChange([...connections, newConnection]);
      }
    }
    
    setStartConnector(null);
    setTempConnectionEnd(null);
  };

  return (
    <div 
      className="relative w-full h-full bg-slate-50 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(20px,1fr))] grid-rows-[repeat(40,minmax(20px,1fr))] opacity-20 pointer-events-none">
        {Array.from({ length: 41 }).map((_, i) => (
          <div key={`h-${i}`} className="col-span-full h-px bg-slate-300" />
        ))}
        {Array.from({ length: 41 }).map((_, i) => (
          <div key={`v-${i}`} className="row-span-full w-px bg-slate-300" />
        ))}
      </div>
      
      <svg className="absolute inset-0 pointer-events-none">
        {connections.map((connection) => {
          const sourceNode = nodes.find(n => n.id === connection.sourceId);
          const targetNode = nodes.find(n => n.id === connection.targetId);
          
          if (!sourceNode || !targetNode) return null;
          
          return (
            <NodeConnection 
              key={connection.id}
              sourcePosition={{ 
                x: sourceNode.position.x + 150, 
                y: sourceNode.position.y + 50 
              }}
              targetPosition={{ 
                x: targetNode.position.x, 
                y: targetNode.position.y + 50
              }}
              animated
            />
          );
        })}
        
        {startConnector && tempConnectionEnd && (
          <NodeConnection 
            sourcePosition={
              startConnector.type === 'output'
                ? {
                    x: nodes.find(n => n.id === startConnector.nodeId)!.position.x + 150,
                    y: nodes.find(n => n.id === startConnector.nodeId)!.position.y + 50,
                  }
                : tempConnectionEnd
            }
            targetPosition={
              startConnector.type === 'input'
                ? {
                    x: nodes.find(n => n.id === startConnector.nodeId)!.position.x,
                    y: nodes.find(n => n.id === startConnector.nodeId)!.position.y + 50,
                  }
                : tempConnectionEnd
            }
            dashed
          />
        )}
      </svg>
      
      {nodes.map((node) => (
        <AgentNode
          key={node.id}
          node={node}
          onDragStart={(e) => handleNodeDragStart(e, node.id, node.position)}
          onConnectorMouseDown={handleConnectorMouseDown}
          onConnectorMouseUp={handleConnectorMouseUp}
        />
      ))}
    </div>
  );
};

export default BuilderCanvas;

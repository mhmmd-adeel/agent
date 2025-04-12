
import React from "react";

interface NodeConnectionProps {
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  animated?: boolean;
  dashed?: boolean;
}

export const NodeConnection: React.FC<NodeConnectionProps> = ({
  sourcePosition,
  targetPosition,
  animated = false,
  dashed = false,
}) => {
  const dx = targetPosition.x - sourcePosition.x;
  const dy = targetPosition.y - sourcePosition.y;
  const midX = sourcePosition.x + dx / 2;
  
  const path = `
    M ${sourcePosition.x} ${sourcePosition.y}
    C ${midX} ${sourcePosition.y}, ${midX} ${targetPosition.y}, ${targetPosition.x} ${targetPosition.y}
  `;
  
  return (
    <path
      d={path}
      fill="none"
      className={`${animated ? 'connection-line' : 'stroke-garden-purple stroke-2'}`}
      strokeDasharray={dashed ? "5,5" : "none"}
    />
  );
};

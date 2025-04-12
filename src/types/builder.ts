
export type NodeType = 
  // LLM nodes
  | 'llm-prompt'
  | 'llm-completion'
  | 'llm-chat'
  | 'llm-system-prompt'
  // Memory nodes
  | 'memory-store'
  | 'memory-retrieve'
  | 'memory-vector'
  | 'memory-conversation'
  // Tool nodes
  | 'tool-web-search'
  | 'tool-calculator'
  | 'tool-code-executor'
  | 'tool-data-analysis'
  | 'tool-api'
  // Flow nodes
  | 'flow-input'
  | 'flow-output'
  | 'flow-condition'
  | 'flow-loop';

export interface NodeData {
  id: string;
  type: NodeType;
  name: string;
  description: string;
  position: {
    x: number;
    y: number;
  };
  data: Record<string, any>;
}

export interface ConnectionData {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface NodeCategory {
  id: string;
  name: string;
  nodes: {
    type: NodeType;
    name: string;
    description: string;
  }[];
}

export interface AgentData {
  id: string;
  name: string;
  description: string;
  nodes: NodeData[];
  connections: ConnectionData[];
  createdAt: string;
  updatedAt: string;
}

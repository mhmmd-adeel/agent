
import { Cpu, MessageSquare, Brain, Database, Search, Calculator, Code, BarChart2, Globe, User, ArrowRight, GitFork, Repeat } from "lucide-react";
import { NodeType } from "@/types/builder";

export const getNodeIcon = (type: NodeType) => {
  switch (type) {
    // LLM nodes
    case 'llm-prompt':
    case 'llm-completion':
    case 'llm-chat':
    case 'llm-system-prompt':
      return MessageSquare;
    // Memory nodes
    case 'memory-store':
    case 'memory-retrieve':
    case 'memory-vector':
    case 'memory-conversation':
      return Database;
    // Tool nodes
    case 'tool-web-search':
      return Search;
    case 'tool-calculator':
      return Calculator;
    case 'tool-code-executor':
      return Code;
    case 'tool-data-analysis':
      return BarChart2;
    case 'tool-api':
      return Globe;
    // Flow nodes
    case 'flow-input':
      return User;
    case 'flow-output':
      return ArrowRight;
    case 'flow-condition':
      return GitFork;
    case 'flow-loop':
      return Repeat;
    default:
      return Cpu;
  }
};

export const getNodeColor = (type: NodeType) => {
  if (type.startsWith('llm-')) {
    return 'bg-purple-500';
  } else if (type.startsWith('memory-')) {
    return 'bg-blue-500';
  } else if (type.startsWith('tool-')) {
    return 'bg-amber-500';
  } else if (type.startsWith('flow-')) {
    return 'bg-green-500';
  }
  return 'bg-slate-500';
};

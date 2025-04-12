
import { NodeCategory } from "@/types/builder";

export const nodeCategories: NodeCategory[] = [
  {
    id: "llm",
    name: "LLM Components",
    nodes: [
      {
        type: "llm-prompt",
        name: "Prompt Template",
        description: "Create prompt templates with variables",
      },
      {
        type: "llm-completion",
        name: "Text Completion",
        description: "Generate text based on a prompt",
      },
      {
        type: "llm-chat",
        name: "Chat Message",
        description: "Send or receive chat messages",
      },
      {
        type: "llm-system-prompt",
        name: "System Prompt",
        description: "Set behavior instructions for the AI",
      },
    ],
  },
  {
    id: "memory",
    name: "Memory Components",
    nodes: [
      {
        type: "memory-store",
        name: "Store Memory",
        description: "Save data for later use",
      },
      {
        type: "memory-retrieve",
        name: "Retrieve Memory",
        description: "Access previously stored data",
      },
      {
        type: "memory-vector",
        name: "Vector Storage",
        description: "Store and query embeddings",
      },
      {
        type: "memory-conversation",
        name: "Conversation History",
        description: "Track and maintain conversation context",
      },
    ],
  },
  {
    id: "tools",
    name: "Tool Components",
    nodes: [
      {
        type: "tool-web-search",
        name: "Web Search",
        description: "Search the internet for information",
      },
      {
        type: "tool-calculator",
        name: "Calculator",
        description: "Perform mathematical operations",
      },
      {
        type: "tool-code-executor",
        name: "Code Executor",
        description: "Run code snippets and return results",
      },
      {
        type: "tool-data-analysis",
        name: "Data Analysis",
        description: "Process and analyze data sets",
      },
      {
        type: "tool-api",
        name: "API Connector",
        description: "Connect to external APIs",
      },
    ],
  },
  {
    id: "flow",
    name: "Flow Components",
    nodes: [
      {
        type: "flow-input",
        name: "User Input",
        description: "Entry point for user input",
      },
      {
        type: "flow-output",
        name: "Output",
        description: "Final response to the user",
      },
      {
        type: "flow-condition",
        name: "Condition",
        description: "Branch flow based on conditions",
      },
      {
        type: "flow-loop",
        name: "Loop",
        description: "Repeat steps until a condition is met",
      },
    ],
  },
];

export const sampleAgentTemplates = [
  {
    id: "study-planner",
    name: "Study Planner Agent",
    description: "Creates personalized study plans and tracks progress",
    thumbnail: "study-planner.svg",
    category: "Education",
  },
  {
    id: "content-creator",
    name: "Content Creator",
    description: "Generates and refines content for blogs and social media",
    thumbnail: "content-creator.svg",
    category: "Productivity",
  },
  {
    id: "coding-tutor",
    name: "Coding Tutor",
    description: "Teaches programming concepts and reviews code",
    thumbnail: "coding-tutor.svg",
    category: "Education",
  },
  {
    id: "fitness-coach",
    name: "Fitness Coach",
    description: "Creates workout plans and provides fitness advice",
    thumbnail: "fitness-coach.svg",
    category: "Health",
  },
  {
    id: "research-assistant",
    name: "Research Assistant",
    description: "Helps research topics and summarize findings",
    thumbnail: "research-assistant.svg",
    category: "Research",
  },
  {
    id: "task-manager",
    name: "Task Manager",
    description: "Helps organize and prioritize tasks",
    thumbnail: "task-manager.svg",
    category: "Productivity",
  },
];

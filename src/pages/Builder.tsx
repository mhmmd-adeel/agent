import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import BuilderToolbar from "@/components/builder/BuilderToolbar";
import BuilderCanvas from "@/components/builder/BuilderCanvas";
import NodePalette from "@/components/builder/NodePalette";
import TestPanel from "@/components/builder/TestPanel";
import { AgentData, NodeData, ConnectionData, NodeType } from "@/types/builder";
import { generateId } from "@/lib/utils";
import { saveAgent, getAgent } from "@/lib/agentService";

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  
  const [agentName, setAgentName] = useState("Untitled Agent");
  const [agentDescription, setAgentDescription] = useState("");
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [testPanelOpen, setTestPanelOpen] = useState(false);
  
  // For undo/redo functionality
  const [history, setHistory] = useState<{nodes: NodeData[], connections: ConnectionData[]}[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  useEffect(() => {
    if (isNew) {
      // Initialize with empty canvas
      setNodes([]);
      setConnections([]);
      setAgentName("Untitled Agent");
      setAgentDescription("");
      
      // Reset history
      setHistory([{ nodes: [], connections: [] }]);
      setHistoryIndex(0);
    } else {
      // Load an existing agent by ID
      const loadAgent = async () => {
        setLoading(true);
        try {
          const { agent, error } = await getAgent(id!);
          
          if (error) {
            toast.error(`Error loading agent: ${error}`);
            return;
          }
          
          if (agent) {
            setNodes(agent.nodes);
            setConnections(agent.connections);
            setAgentName(agent.name);
            setAgentDescription(agent.description || "");
            
            // Initialize history with the loaded agent
            setHistory([{ 
              nodes: agent.nodes, 
              connections: agent.connections 
            }]);
            setHistoryIndex(0);
          }
        } catch (error) {
          console.error("Error loading agent:", error);
          toast.error("Failed to load agent");
        } finally {
          setLoading(false);
        }
      };
      
      loadAgent();
    }
  }, [id, isNew]);
  
  const saveToHistory = (newNodes: NodeData[], newConnections: ConnectionData[]) => {
    // Drop any future history if we're not at the latest point
    const newHistory = history.slice(0, historyIndex + 1);
    
    // Add the new state to history
    newHistory.push({ nodes: newNodes, connections: newConnections });
    
    // Update history state
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const handleAddNode = (type: NodeType) => {
    const newNode: NodeData = {
      id: generateId(),
      type,
      name: getNodeName(type),
      description: getNodeDescription(type),
      position: { x: 200, y: 200 },
      data: {}
    };
    
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    
    // Save to history
    saveToHistory(newNodes, connections);
    
    toast.success(`Added ${newNode.name}`);
  };
  
  const handleNodesChange = (newNodes: NodeData[]) => {
    setNodes(newNodes);
    
    // Don't save to history for every drag update
    // Could implement a debounced version for drag operations
  };
  
  const handleConnectionsChange = (newConnections: ConnectionData[]) => {
    setConnections(newConnections);
    
    // Save to history
    saveToHistory(nodes, newConnections);
  };
  
  const handleSave = async () => {
    setLoading(true);
    
    try {
      const agentData: AgentData = {
        id: isNew ? 'new' : id!,
        name: agentName,
        description: agentDescription,
        nodes,
        connections,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const { success, error, id: newId } = await saveAgent(agentData);
      
      if (!success || error) {
        throw new Error(error || "Failed to save agent");
      }
      
      toast.success("Agent saved successfully");
      
      // If it's a new agent, redirect to the edit page with the new ID
      if (isNew && newId) {
        navigate(`/builder/${newId}`);
      }
    } catch (error) {
      console.error("Error saving agent:", error);
      toast.error("Failed to save agent");
    } finally {
      setLoading(false);
    }
  };
  
  const handleTest = () => {
    // First save the agent, then open the test panel
    handleSave();
    setTestPanelOpen(true);
  };
  
  const handleClear = () => {
    setNodes([]);
    setConnections([]);
    
    // Save to history
    saveToHistory([], []);
    
    toast.info("Canvas cleared");
  };
  
  const handleExport = () => {
    const agentData: AgentData = {
      id: id || generateId(),
      name: agentName,
      description: agentDescription,
      nodes,
      connections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(agentData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${agentName.replace(/\s+/g, '-').toLowerCase()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast.success("Agent exported as JSON");
  };
  
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const { nodes: historyNodes, connections: historyConnections } = history[newIndex];
      
      setNodes(historyNodes);
      setConnections(historyConnections);
      setHistoryIndex(newIndex);
      
      toast.info("Undo");
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const { nodes: historyNodes, connections: historyConnections } = history[newIndex];
      
      setNodes(historyNodes);
      setConnections(historyConnections);
      setHistoryIndex(newIndex);
      
      toast.info("Redo");
    }
  };
  
  const getNodeName = (type: NodeType): string => {
    switch (type) {
      case 'llm-prompt':
        return 'Prompt Template';
      case 'llm-completion':
        return 'Text Completion';
      case 'llm-chat':
        return 'Chat Message';
      case 'llm-system-prompt':
        return 'System Prompt';
      case 'memory-store':
        return 'Store Memory';
      case 'memory-retrieve':
        return 'Retrieve Memory';
      case 'memory-vector':
        return 'Vector Storage';
      case 'memory-conversation':
        return 'Conversation History';
      case 'tool-web-search':
        return 'Web Search';
      case 'tool-calculator':
        return 'Calculator';
      case 'tool-code-executor':
        return 'Code Executor';
      case 'tool-data-analysis':
        return 'Data Analysis';
      case 'tool-api':
        return 'API Connector';
      case 'flow-input':
        return 'User Input';
      case 'flow-output':
        return 'Output';
      case 'flow-condition':
        return 'Condition';
      case 'flow-loop':
        return 'Loop';
      default:
        return 'Node';
    }
  };
  
  const getNodeDescription = (type: NodeType): string => {
    switch (type) {
      case 'llm-prompt':
        return 'Create prompt templates with variables';
      case 'llm-completion':
        return 'Generate text based on a prompt';
      case 'llm-chat':
        return 'Send or receive chat messages';
      case 'llm-system-prompt':
        return 'Set behavior instructions for the AI';
      case 'memory-store':
        return 'Save data for later use';
      case 'memory-retrieve':
        return 'Access previously stored data';
      case 'memory-vector':
        return 'Store and query embeddings';
      case 'memory-conversation':
        return 'Track and maintain conversation context';
      case 'tool-web-search':
        return 'Search the internet for information';
      case 'tool-calculator':
        return 'Perform mathematical operations';
      case 'tool-code-executor':
        return 'Run code snippets and return results';
      case 'tool-data-analysis':
        return 'Process and analyze data sets';
      case 'tool-api':
        return 'Connect to external APIs';
      case 'flow-input':
        return 'Entry point for user input';
      case 'flow-output':
        return 'Final response to the user';
      case 'flow-condition':
        return 'Branch flow based on conditions';
      case 'flow-loop':
        return 'Repeat steps until a condition is met';
      default:
        return 'Generic node description';
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Loading agent...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  const currentAgent: AgentData = {
    id: id || 'new',
    name: agentName,
    description: agentDescription,
    nodes,
    connections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <BuilderToolbar
          name={agentName}
          onNameChange={setAgentName}
          description={agentDescription}
          onDescriptionChange={setAgentDescription}
          onSave={handleSave}
          onTest={handleTest}
          onClear={handleClear}
          onZoomIn={() => toast.info("Zoom in")}
          onZoomOut={() => toast.info("Zoom out")}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onExport={handleExport}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 border-r">
            <NodePalette onAddNode={handleAddNode} />
          </div>
          
          <div className="flex-1 overflow-hidden">
            <BuilderCanvas
              nodes={nodes}
              connections={connections}
              onNodesChange={handleNodesChange}
              onConnectionsChange={handleConnectionsChange}
            />
          </div>
        </div>
        
        <TestPanel 
          open={testPanelOpen} 
          onOpenChange={setTestPanelOpen} 
          agent={currentAgent} 
        />
      </div>
    </Layout>
  );
};

export default Builder;

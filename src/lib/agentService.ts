
import { supabase } from "@/integrations/supabase/client";
import { AgentData, NodeData, ConnectionData } from "@/types/builder";
import { generateId } from "@/lib/utils";
import { Json } from "@/integrations/supabase/types";

export async function saveAgent(agent: AgentData): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    // If id is 'new', generate a new ID
    const agentId = agent.id === 'new' ? generateId() : agent.id;
    
    const { error } = await supabase
      .from('agents')
      .upsert([{  // Use an array with a single object for upsert
        id: agentId,
        name: agent.name,
        description: agent.description || '',
        nodes: agent.nodes as unknown as Json,
        connections: agent.connections as unknown as Json,
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'id'
      });
    
    if (error) throw error;
    
    return { success: true, id: agentId };
  } catch (error) {
    console.error("Error saving agent:", error);
    return { success: false, error: error.message };
  }
}

export async function getAgent(id: string): Promise<{ agent?: AgentData; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return { error: "Agent not found" };
    }
    
    const agent: AgentData = {
      id: data.id,
      name: data.name,
      description: data.description || "",
      nodes: (data.nodes as unknown as NodeData[]) || [],
      connections: (data.connections as unknown as ConnectionData[]) || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    
    return { agent };
  } catch (error) {
    console.error("Error fetching agent:", error);
    return { error: error.message };
  }
}

export async function getAgentList(): Promise<{ agents?: AgentData[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    const agents = data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      nodes: (item.nodes as unknown as NodeData[]) || [],
      connections: (item.connections as unknown as ConnectionData[]) || [],
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    
    return { agents };
  } catch (error) {
    console.error("Error fetching agents:", error);
    return { error: error.message };
  }
}

export async function deleteAgent(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting agent:", error);
    return { success: false, error: error.message };
  }
}

export async function getGeminiApiKey(): Promise<{ apiKey?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('api_key')
      .eq('service', 'gemini')
      .single();
    
    if (error) throw error;
    
    return { apiKey: data?.api_key };
  } catch (error) {
    console.error("Error fetching Gemini API key:", error);
    return { error: error.message };
  }
}

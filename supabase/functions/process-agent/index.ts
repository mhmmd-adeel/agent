
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://pzzbilwsouyryuroobxb.supabase.co';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the Gemini API key from our database
    const { data, error } = await supabase
      .from('api_keys')
      .select('api_key')
      .eq('service', 'gemini')
      .single();

    if (error) {
      throw new Error(`Failed to get Gemini API key: ${error.message}`);
    }

    const geminiApiKey = data.api_key;
    
    // Get the input from the request
    const { agent, input } = await req.json();
    
    if (!agent || !agent.nodes || !agent.connections) {
      throw new Error('Invalid agent data');
    }
    
    // Process the agent flow
    const result = await processAgent(agent, input, geminiApiKey);
    
    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in process-agent function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processAgent(agent, userInput, apiKey) {
  // This is a simplified implementation that processes a linear flow
  // A complete implementation would handle branching, loops, etc.
  
  // First, find the input node
  const inputNode = agent.nodes.find(n => n.type === 'flow-input');
  if (!inputNode) {
    return { error: 'No input node found in agent' };
  }
  
  // Find all connections starting from the input node
  let currentNodeId = inputNode.id;
  let context = { input: userInput };
  let finalOutput = null;
  let visited = new Set();
  
  // Simple loop to follow connections
  while (currentNodeId && !visited.has(currentNodeId)) {
    visited.add(currentNodeId);
    const currentNode = agent.nodes.find(n => n.id === currentNodeId);
    
    if (!currentNode) {
      break;
    }
    
    // Process the current node based on its type
    const nodeResult = await processNode(currentNode, context, apiKey);
    context = { ...context, ...nodeResult };
    
    // If this is an output node, capture the result
    if (currentNode.type === 'flow-output') {
      finalOutput = nodeResult.output;
      break;
    }
    
    // Find the next connection
    const nextConnection = agent.connections.find(c => c.sourceId === currentNodeId);
    currentNodeId = nextConnection?.targetId || null;
  }
  
  return finalOutput || { message: 'Agent execution completed but no output was produced' };
}

async function processNode(node, context, apiKey) {
  switch (node.type) {
    case 'flow-input':
      return { output: context.input };
      
    case 'flow-output':
      return { output: context.output || context.input };
      
    case 'llm-prompt':
      // Replace variables in the prompt template
      let prompt = node.data.prompt || "Tell me about {{input}}";
      
      // Replace any variables like {{input}} with values from context
      Object.keys(context).forEach(key => {
        prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), context[key]);
      });
      
      // Call Gemini API
      const response = await callGeminiAPI(prompt, apiKey);
      return { output: response };
      
    case 'llm-system-prompt':
      // Similar to llm-prompt but sets up a system message
      const systemPrompt = node.data.prompt || "You are a helpful assistant.";
      return { systemPrompt };
      
    case 'memory-store':
      // Store data in a memory slot
      const key = node.data.key || 'default';
      const value = context.output || context.input;
      return { [key]: value, output: value };
      
    case 'memory-retrieve':
      // Retrieve data from a memory slot
      const memoryKey = node.data.key || 'default';
      return { output: context[memoryKey] || "No data found in memory" };
      
    // Add more node types as needed
      
    default:
      return { output: `Unsupported node type: ${node.type}` };
  }
}

async function callGeminiAPI(prompt, apiKey) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return `Error: ${data.error.message}`;
    }
    
    // Extract the response text
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return `Error calling AI service: ${error.message}`;
  }
}

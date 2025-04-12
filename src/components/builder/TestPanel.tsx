
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Send, XCircle } from "lucide-react";
import { AgentData } from "@/types/builder";
import { supabase } from "@/integrations/supabase/client";

interface TestPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: AgentData;
}

const TestPanel: React.FC<TestPanelProps> = ({ open, onOpenChange, agent }) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase.functions.invoke('process-agent', {
        body: { agent, input: input.trim() }
      });
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setOutput(data.result.output || data.result.message || "No output generated");
    } catch (err) {
      console.error("Error testing agent:", err);
      setError(err.message || "Failed to process agent");
      setOutput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80vh]">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle>Test Agent: {agent.name}</DrawerTitle>
          </DrawerHeader>
          
          <div className="p-4 flex flex-col h-[calc(80vh-180px)]">
            <div className="flex-1 bg-muted/40 rounded-md border p-4 overflow-y-auto mb-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Processing...</p>
                </div>
              ) : error ? (
                <div className="text-destructive">
                  <p className="font-semibold">Error:</p>
                  <p>{error}</p>
                </div>
              ) : output ? (
                <div className="whitespace-pre-wrap">{output}</div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Enter an input and submit to test your agent</p>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your test input..."
                className="flex-1"
                disabled={loading}
              />
              <Button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="self-end"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
          
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TestPanel;

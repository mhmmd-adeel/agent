
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Users, TrendingUp, Edit, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { sampleAgentTemplates } from "@/data/nodeData";
import { getAgentList } from "@/lib/agentService";
import { AgentData } from "@/types/builder";
import { formatDate } from "@/lib/utils";

const Dashboard = () => {
  const [recentAgents, setRecentAgents] = useState<AgentData[]>([]);
  const [agentCount, setAgentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const { agents, error } = await getAgentList();
        
        if (error) {
          console.error("Error loading agents:", error);
          return;
        }
        
        if (agents) {
          setAgentCount(agents.length);
          // Get the 3 most recent agents
          setRecentAgents(agents.slice(0, 3));
        }
      } catch (error) {
        console.error("Error loading agents:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAgents();
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Agent Garden</h1>
          <p className="text-muted-foreground mt-1">
            Build your own AI agents by combining modular components
          </p>
        </div>
        <Button asChild>
          <Link to="/builder/new">
            <Plus className="h-4 w-4 mr-2" />
            New Agent
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">My Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentCount}</div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link to="/agents" className="text-xs text-blue-500 hover:underline">
              View all agents
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Community Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120+</div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link to="/templates" className="text-xs text-blue-500 hover:underline">
              Browse templates
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50+</div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link to="/components" className="text-xs text-blue-500 hover:underline">
              Explore components
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Popular Templates</TabsTrigger>
          <TabsTrigger value="community">Community Picks</TabsTrigger>
          <TabsTrigger value="recent">Recently Used</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sampleAgentTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-garden-purple/20 to-garden-teal/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-garden-purple to-garden-teal flex items-center justify-center">
                    {template.category === "Education" && <Search className="h-8 w-8 text-white" />}
                    {template.category === "Productivity" && <TrendingUp className="h-8 w-8 text-white" />}
                    {template.category === "Health" && <Users className="h-8 w-8 text-white" />}
                    {template.category === "Research" && <Search className="h-8 w-8 text-white" />}
                  </div>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <span className="text-xs bg-muted px-2 py-1 rounded-md">
                    {template.category}
                  </span>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/builder/template/${template.id}`}>
                      Use Template
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="community">
          <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/40">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Explore community-created agents</p>
              <Button asChild>
                <Link to="/community">
                  Browse Community
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="recent">
          {loading ? (
            <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/40">
              <p className="text-muted-foreground">Loading recent agents...</p>
            </div>
          ) : recentAgents.length === 0 ? (
            <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/40">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">You haven't created any agents yet</p>
                <Button asChild>
                  <Link to="/builder/new">
                    Create Your First Agent
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentAgents.map((agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription>{agent.description || "No description"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Last updated: {formatDate(agent.updatedAt)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/builder/${agent.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Dashboard;

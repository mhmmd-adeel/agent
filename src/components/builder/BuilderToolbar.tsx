
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save, 
  Play, 
  Trash2, 
  Plus, 
  ChevronsUp, 
  ChevronsDown,
  Undo,
  Redo,
  Download,
  Info
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface BuilderToolbarProps {
  name: string;
  onNameChange: (name: string) => void;
  description?: string;
  onDescriptionChange?: (description: string) => void;
  onSave: () => void;
  onTest: () => void;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
}

const BuilderToolbar: React.FC<BuilderToolbarProps> = ({
  name,
  onNameChange,
  description = "",
  onDescriptionChange = () => {},
  onSave,
  onTest,
  onClear,
  onZoomIn,
  onZoomOut,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onExport
}) => {
  return (
    <div className="flex flex-col border-b bg-card">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-4">
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="font-medium text-lg w-64"
            placeholder="Untitled Agent"
          />
          
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onUndo}
                  disabled={!canUndo}
                >
                  <Undo className="h-4 w-4" />
                  <span className="sr-only">Undo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onRedo}
                  disabled={!canRedo}
                >
                  <Redo className="h-4 w-4" />
                  <span className="sr-only">Redo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center border rounded-md">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-none border-r" onClick={onZoomOut}>
                  <ChevronsDown className="h-4 w-4" />
                  <span className="sr-only">Zoom out</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-none" onClick={onZoomIn}>
                  <ChevronsUp className="h-4 w-4" />
                  <span className="sr-only">Zoom in</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom in</TooltipContent>
            </Tooltip>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export agent as JSON</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onClear}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear canvas</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onTest}>
                <Play className="h-4 w-4 mr-2" />
                Test
              </Button>
            </TooltipTrigger>
            <TooltipContent>Test this agent</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" onClick={onSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save agent</TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      <div className="px-3 pb-3">
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Add a description for your agent..."
          className="resize-none h-12 text-sm"
        />
      </div>
    </div>
  );
};

export default BuilderToolbar;

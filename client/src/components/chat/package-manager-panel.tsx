
import { useState, useEffect } from "react";
import { Package, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface PackageInfo {
  name: string;
  version: string;
}

export function PackageManagerPanel() {
  const [language, setLanguage] = useState<string>('nodejs');
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, [language]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/packages/list/${language}`);
      const data = await response.json();
      
      if (response.ok) {
        // Parse package list based on language
        if (language === 'nodejs') {
          const deps = data.packages?.dependencies || {};
          setPackages(
            Object.entries(deps).map(([name, version]) => ({
              name,
              version: typeof version === 'string' ? version : (version as any).version || 'unknown'
            }))
          );
        } else {
          setPackages(data.packages || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
      toast({
        title: "Failed to fetch packages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nodejs">Node.js</SelectItem>
            <SelectItem value="python">Python</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchPackages}
          disabled={loading}
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <ScrollArea className="h-[300px]">
        {packages.length === 0 ? (
          <Card className="p-4">
            <div className="text-center text-sm text-muted-foreground">
              No packages found
            </div>
          </Card>
        ) : (
          <div className="space-y-1">
            {packages.map((pkg) => (
              <Card key={pkg.name} className="p-2">
                <div className="flex items-center gap-2">
                  <Package className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-mono flex-1">{pkg.name}</span>
                  <span className="text-xs text-muted-foreground">{pkg.version}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

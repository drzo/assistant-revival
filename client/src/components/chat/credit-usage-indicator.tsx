import { useEffect, useState } from 'react';
import { Coins, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAssistantStore } from '@/hooks/use-assistant-store';

interface CreditUsage {
  used: number;
  limit: number;
  resetDate: string;
}

export function CreditUsageIndicator() {
  const [usage, setUsage] = useState<CreditUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const { messages } = useAssistantStore();

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/credits/usage');
        if (!response.ok) {
          throw new Error('Failed to fetch credit usage');
        }
        const data = await response.json();
        setUsage(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching credit usage:', err);
        setLoading(false);
      }
    };

    fetchUsage();
    
    // Poll every 30 seconds for updates
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, [messages]); // Refetch when messages change

  if (loading || !usage) return null; // Or a loading state component

  const percentage = (usage.used / usage.limit) * 100;
  const isNearLimit = percentage > 80;

  return (
    <Card className={`p-2 border-muted ${isNearLimit ? 'border-orange-200' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        <Coins className={`h-3 w-3 ${isNearLimit ? 'text-orange-500' : 'text-muted-foreground'}`} />
        <span className="text-xs font-medium">
          ${usage.used.toFixed(2)} / ${usage.limit.toFixed(2)}
        </span>
        {isNearLimit && <TrendingUp className="h-3 w-3 text-orange-500 ml-auto" />}
      </div>
      <Progress value={percentage} className="h-1" />
      <div className="text-xs text-muted-foreground mt-1">
        Resets {new Date(usage.resetDate).toLocaleDateString()}
      </div>
    </Card>
  );
}